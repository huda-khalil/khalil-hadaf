import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminTimelineSchema } from "../../schemas/adminTimeline";
import {
  useAdminTimelineEvent,
  useCreateTimelineEvent,
  useUpdateTimelineEvent,
} from "../../hooks/useAdminTimeline";
import { uploadFile } from "../../lib/upload";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

type FormState = {
  year: string;
  title: string;
  title_fa: string;
  description: string;
  description_fa: string;
  photo_path: string;
  kind: "milestone" | "lecture" | "award" | "publication";
  sort_order: string;
  published: boolean;
};

const EMPTY: FormState = {
  year: "",
  title: "",
  title_fa: "",
  description: "",
  description_fa: "",
  photo_path: "",
  kind: "milestone",
  sort_order: "0",
  published: true,
};

export default function AdminTimelineForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: existing, isLoading: loadingExisting } =
    useAdminTimelineEvent(id);
  const createMutation = useCreateTimelineEvent();
  const updateMutation = useUpdateTimelineEvent();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        year: existing.year?.toString() ?? "",
        title: existing.title ?? "",
        title_fa: existing.title_fa ?? "",
        description: existing.description ?? "",
        description_fa: existing.description_fa ?? "",
        photo_path: existing.photo_path ?? "",
        kind: existing.kind ?? "milestone",
        sort_order: existing.sort_order?.toString() ?? "0",
        published: existing.published ?? true,
      });
      if (existing.photo_path) {
        setPhotoPreview(
          `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${existing.photo_path}`,
        );
      }
    }
  }, [existing]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      year: Number(form.year),
      title: form.title || null,
      title_fa: form.title_fa || null,
      description: form.description || null,
      description_fa: form.description_fa || null,
      photo_path: form.photo_path || null,
      kind: form.kind,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };

    const parsed = AdminTimelineSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      let photoPath = form.photo_path;

      if (photoFile) {
        photoPath = await uploadFile(photoFile, "timeline");
      }

      const finalPayload = { ...parsed.data, photo_path: photoPath || null };

      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: finalPayload });
      } else {
        await createMutation.mutateAsync(finalPayload);
      }
      navigate("/admin/timeline");
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? "Save failed.";
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
          {isEdit ? "Edit event" : "New event"}
        </div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          {isEdit ? form.title || form.title_fa || "Edit event" : "Add event"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Year *" error={errors.year}>
            <input
              type="text"
              inputMode="numeric"
              value={form.year}
              onChange={(e) => {
                const val = e.target.value
                  .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
                  .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
                setField("year", val);
              }}
              placeholder="1975"
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>

          <Field label="Kind *">
            <select
              value={form.kind}
              onChange={(e) =>
                setField("kind", e.target.value as FormState["kind"])
              }
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            >
              <option value="milestone">Milestone</option>
              <option value="lecture">Lecture</option>
              <option value="award">Award</option>
              <option value="publication">Publication</option>
            </select>
          </Field>

          <Field label="Sort order">
            <input
              type="text"
              inputMode="numeric"
              value={form.sort_order}
              onChange={(e) => {
                const val = e.target.value
                  .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
                  .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
                setField("sort_order", val);
              }}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Title (English / Latin)" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
            />
          </Field>
          <Field label="عنوان (فارسی)">
            <input
              type="text"
              dir="rtl"
              value={form.title_fa}
              onChange={(e) => setField("title_fa", e.target.value)}
              className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy font-persian"
            />
          </Field>
        </div>

        <Field label="Photo (optional)">
          <div className="flex items-start gap-6">
            <div className="w-32 aspect-square bg-well border border-hairline flex items-center justify-center overflow-hidden shrink-0">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Photo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted">No photo</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoPick}
              className="text-sm text-muted file:me-4 file:px-4 file:py-2 file:border file:border-hairline file:bg-white file:text-sm file:cursor-pointer hover:file:border-burgundy"
            />
          </div>
        </Field>

        <Field label="Description (English)">
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={3}
            className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy resize-y"
          />
        </Field>

        <Field label="توضیحات (فارسی)">
          <textarea
            dir="rtl"
            value={form.description_fa}
            onChange={(e) => setField("description_fa", e.target.value)}
            rows={3}
            className="w-full border border-hairline bg-white px-3 py-2 text-sm focus:outline-none focus:border-burgundy resize-y font-persian"
          />
        </Field>

        <div className="flex items-center gap-8">
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

        <div className="flex items-center gap-4 pt-4 border-t border-hairline">
          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-paper px-6 py-3 text-sm tracking-wide hover:bg-burgundy transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create event"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/timeline")}
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
