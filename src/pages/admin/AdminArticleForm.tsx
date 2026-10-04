import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminArticleSchema } from "../../schemas/adminArticle";
import {
  useAdminArticle,
  useCreateArticle,
  useUpdateArticle,
} from "../../hooks/useAdminArticles";
import { uploadFile } from "../../lib/upload";
import { slugify } from "../../lib/slug";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

type FormState = {
  slug: string;
  title: string;
  title_fa: string;
  excerpt: string;
  excerpt_fa: string;
  body_md: string;
  body_md_fa: string;
  cover_path: string;
  published_in: string;
  published_at: string;
  language: string;
  tags: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: FormState = {
  slug: "",
  title: "",
  title_fa: "",
  excerpt: "",
  excerpt_fa: "",
  body_md: "",
  body_md_fa: "",
  cover_path: "",
  published_in: "",
  published_at: new Date().toISOString().slice(0, 10),
  language: "",
  tags: "",
  featured: false,
  published: true,
};

export default function AdminArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: existing, isLoading: loadingExisting } = useAdminArticle(id);
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        slug: existing.slug ?? "",
        title: existing.title ?? "",
        title_fa: existing.title_fa ?? "",
        excerpt: existing.excerpt ?? "",
        excerpt_fa: existing.excerpt_fa ?? "",
        body_md: existing.body_md ?? "",
        body_md_fa: existing.body_md_fa ?? "",
        cover_path: existing.cover_path ?? "",
        published_in: existing.published_in ?? "",
        published_at: existing.published_at ?? "",
        language: existing.language ?? "",
        tags: (existing.tags ?? []).join(", "),
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
    if (form.slug) return;
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

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      ...form,
      title_fa: form.title_fa || null,
      excerpt: form.excerpt || null,
      excerpt_fa: form.excerpt_fa || null,
      body_md: form.body_md || null,
      body_md_fa: form.body_md_fa || null,
      published_in: form.published_in || null,
      published_at: form.published_at || null,
      language: form.language || null,
      cover_path: form.cover_path || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const parsed = AdminArticleSchema.safeParse(payload);
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

      if (coverFile) {
        coverPath = await uploadFile(coverFile, "article-covers");
      }

      const finalPayload = { ...parsed.data, cover_path: coverPath || null };

      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: finalPayload });
      } else {
        await createMutation.mutateAsync(finalPayload);
      }

      navigate("/admin/articles");
    } catch (err: any) {
      console.error("Save error:", err);
      const message =
        err?.message ??
        err?.error_description ??
        err?.details ??
        "Save failed.";
      setErrors({ form: message });
      setSaving(false);
    }
  };

  if (isEdit && loadingExisting) {
    return <p className="text-muted text-sm">Loading…</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
          {isEdit ? "Edit article" : "New article"}
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
              onBlur={generateSlug}
              onChange={(e) => setField("title_fa", e.target.value)}
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

        {/* Cover */}
        <Field label="Cover image (optional)">
          <div className="flex items-start gap-6">
            <div className="w-32 aspect-video bg-well border border-hairline flex items-center justify-center overflow-hidden shrink-0">
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
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPick}
              className="text-sm text-muted file:me-4 file:px-4 file:py-2 file:border file:border-hairline file:bg-white file:text-sm file:cursor-pointer hover:file:border-burgundy"
            />
          </div>
        </Field>

        {/* Excerpt */}
        <Field label="Excerpt (short description)">
          <textarea
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
            rows={2}
            className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy resize-y"
          />
        </Field>

        {/* Body (Markdown) */}
        <Field label="Body (Markdown)">
          <textarea
            value={form.body_md}
            onChange={(e) => setField("body_md", e.target.value)}
            rows={20}
            className="w-full border border-hairline bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-burgundy resize-y"
          />
          <p className="mt-2 text-xs text-muted">
            Use # for headings, ** for bold, * for italic, &gt; for quotes.
          </p>
        </Field>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Published in">
            <input
              type="text"
              value={form.published_in}
              onChange={(e) => setField("published_in", e.target.value)}
              placeholder="Journal name"
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
          <Field label="Published date">
            <input
              type="date"
              value={form.published_at}
              onChange={(e) => setField("published_at", e.target.value)}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <Field label="Tags (comma-separated)">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setField("tags", e.target.value)}
              placeholder="translation, essay, poetry"
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
        </div>

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
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create article"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/articles")}
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
