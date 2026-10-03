import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminBookSchema } from "../../schemas/adminBook";
import {
  useAdminBook,
  useCreateBook,
  useUpdateBook,
} from "../../hooks/useAdminBooks";
import { uploadFile } from "../../lib/upload";
import { slugify } from "../../lib/slug";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

const SPINE_COLORS = [
  { label: "Deepest Burgundy", value: "#3A1820" },
  { label: "Dark Burgundy", value: "#4A1F28" },
  { label: "Medium Burgundy", value: "#5A2631" },
  { label: "Burgundy Dark", value: "#521A29" },
  { label: "Primary Burgundy", value: "#6E2639" },
];

type FormState = {
  slug: string;
  title: string;
  title_fa: string;
  subtitle: string;
  subtitle_fa: string;
  description: string;
  description_fa: string;
  cover_path: string;
  year: string;
  publisher: string;
  isbn: string;
  language: string;
  category: "authored" | "translated" | "edited";
  original_author: string;
  original_title: string;
  buy_url: string;
  pdf_path: string;
  spine_color: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: FormState = {
  slug: "",
  title: "",
  title_fa: "",
  subtitle: "",
  subtitle_fa: "",
  description: "",
  description_fa: "",
  cover_path: "",
  year: "",
  publisher: "",
  isbn: "",
  language: "",
  category: "authored",
  original_author: "",
  original_title: "",
  buy_url: "",
  pdf_path: "",
  spine_color: "#4A1F28",
  featured: false,
  published: true,
};

export default function AdminBookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: existing } = useAdminBook(id);
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Load existing book into the form when editing
  useEffect(() => {
    if (existing) {
      setForm({
        slug: existing.slug ?? "",
        title: existing.title ?? "",
        title_fa: existing.title_fa ?? "",
        subtitle: existing.subtitle ?? "",
        subtitle_fa: existing.subtitle_fa ?? "",
        description: existing.description ?? "",
        description_fa: existing.description_fa ?? "",
        cover_path: existing.cover_path ?? "",
        year: existing.year?.toString() ?? "",
        publisher: existing.publisher ?? "",
        isbn: existing.isbn ?? "",
        language: existing.language ?? "",
        category: existing.category ?? "authored",
        original_author: existing.original_author ?? "",
        original_title: existing.original_title ?? "",
        buy_url: existing.buy_url ?? "",
        pdf_path: existing.pdf_path ?? "",
        spine_color: existing.spine_color ?? "#4A1F28",
        featured: existing.featured ?? false,
        published: existing.published ?? true,
      });
      if (existing.cover_path) {
        setCoverPreview(
          `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${existing.cover_path}`,
        );
      }
    }
  }, [existing]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const generateSlug = () => {
    if (form.slug) return; // don't override if dad typed one
    const source = form.title || form.title_fa;
    if (source) {
      setField("slug", slugify(source));
    }
  };

  const handleCoverPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };
  const handlePdfPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFile(file);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Year: empty string → null, otherwise Number
    const yearValue = form.year.trim() === "" ? null : Number(form.year);

    const payload = {
      ...form,
      year: yearValue,
      title_fa: form.title_fa || null,
      subtitle: form.subtitle || null,
      subtitle_fa: form.subtitle_fa || null,
      description: form.description || null,
      description_fa: form.description_fa || null,
      publisher: form.publisher || null,
      isbn: form.isbn || null,
      language: form.language || null,
      original_author: form.original_author || null,
      original_title: form.original_title || null,
      buy_url: form.buy_url || null,
      pdf_path: form.pdf_path || null,
      cover_path: form.cover_path || null,
    };

    const parsed = AdminBookSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      console.error("Zod errors:", parsed.error.issues);
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      let coverPath = form.cover_path;
      let pdfPath = form.pdf_path;

      if (coverFile) {
        coverPath = await uploadFile(coverFile, "book-covers");
      }
      if (pdfFile) {
        pdfPath = await uploadFile(pdfFile, "book-pdfs");
      }

      const finalPayload = {
        ...parsed.data,
        cover_path: coverPath || null,
        pdf_path: pdfPath || null,
      };

      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: finalPayload });
      } else {
        await createMutation.mutateAsync(finalPayload);
      }

      navigate("/admin/books");
    } catch (err: any) {
      console.error("Save error:", err);
      const message =
        err?.message ??
        err?.error_description ??
        err?.details ??
        "Save failed. Check the console.";
      setErrors({ form: message });
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
          {isEdit ? "Edit book" : "New book"}
        </div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          {isEdit ? form.title || form.title_fa || "Edit book" : "Add book"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Title (English / Latin) *" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              onBlur={generateSlug}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
          <Field label="عنوان (فارسی)">
            <input
              type="text"
              dir="rtl"
              value={form.title_fa}
              onChange={(e) => setField("title_fa", e.target.value)}
              onBlur={generateSlug}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy font-persian"
            />
          </Field>
        </div>

        {/* Slug */}
        <Field label="Slug (URL) *" error={errors.slug}>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setField("slug", e.target.value)}
            className="w-full border border-hairline bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-burgundy"
          />
        </Field>

        {/* Cover upload */}
        <Field label="Cover image">
          <div className="flex items-start gap-6">
            <div className="w-32 aspect-2/3 bg-well border border-hairline flex items-center justify-center overflow-hidden shrink-0">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted">No cover</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverPick}
                className="text-sm text-muted file:me-4 file:px-4 file:py-2 file:border file:border-hairline file:bg-white file:text-sm file:cursor-pointer hover:file:border-burgundy"
              />
              <p className="mt-3 text-xs text-muted">
                Recommended: portrait, 2:3 ratio, at least 600px wide.
              </p>
            </div>
          </div>
        </Field>
        {/* PDF UPLOAD */}
        <Field label="Book PDF (optional)">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfPick}
              className="text-sm text-muted file:me-4 file:px-4 file:py-2 file:border file:border-hairline file:bg-white file:text-sm file:cursor-pointer hover:file:border-burgundy"
            />
            {form.pdf_path && (
              <span className="text-xs text-muted">
                Current: {form.pdf_path.split("/").pop()}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            Upload the full book as PDF. Visitors can read or download it from
            the book page.
          </p>
        </Field>

        {/* Category + Spine color + Year + Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Category *" error={errors.category}>
            <select
              value={form.category}
              onChange={(e) =>
                setField("category", e.target.value as FormState["category"])
              }
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            >
              <option value="authored">Authored</option>
              <option value="translated">Translated</option>
              <option value="edited">Edited</option>
            </select>
          </Field>

          <Field label="Spine color">
            <select
              value={form.spine_color}
              onChange={(e) => setField("spine_color", e.target.value)}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            >
              {SPINE_COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Year" error={errors.year}>
            <input
              type="text"
              inputMode="numeric"
              value={form.year}
              onChange={(e) => {
                // Convert Persian/Arabic digits to Latin digits automatically
                const val = e.target.value
                  .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
                  .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
                setField("year", val);
              }}
              placeholder="2024"
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
          <Field label="Language">
            <select
              value={form.language}
              onChange={(e) => setField("language", e.target.value)}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            >
              <option value="">— Select —</option>
              <option value="fa">Persian (فارسی)</option>
              <option value="ar">Arabic (العربية)</option>
              <option value="en">English</option>
              <option value="fa-ar">Persian & Arabic</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Publisher">
            <input
              type="text"
              value={form.publisher}
              onChange={(e) => setField("publisher", e.target.value)}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
          <Field label="ISBN">
            <input
              type="text"
              value={form.isbn}
              onChange={(e) => setField("isbn", e.target.value)}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
        </div>

        {form.category === "translated" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Original author">
              <input
                type="text"
                value={form.original_author}
                onChange={(e) => setField("original_author", e.target.value)}
                className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
              />
            </Field>
            <Field label="Original title">
              <input
                type="text"
                value={form.original_title}
                onChange={(e) => setField("original_title", e.target.value)}
                className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
              />
            </Field>
          </div>
        )}

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={5}
            className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy resize-y"
          />
        </Field>

        <Field label="Buy URL">
          <input
            type="url"
            value={form.buy_url}
            onChange={(e) => setField("buy_url", e.target.value)}
            placeholder="https://..."
            className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
          />
        </Field>

        {/* Flags */}
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setField("featured", e.target.checked)}
              className="w-4 h-4 accent-burgundy"
            />
            <span className="text-sm">Featured on Home</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setField("published", e.target.checked)}
              className="w-4 h-4 accent-burgundy"
            />
            <span className="text-sm">Published</span>
          </label>
        </div>

        {errors.form && <p className="text-sm text-burgundy">{errors.form}</p>}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-hairline">
          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-paper px-6 py-3 text-sm tracking-wide hover:bg-burgundy transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create book"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/books")}
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-burgundy">{error}</p>}
    </div>
  );
}
