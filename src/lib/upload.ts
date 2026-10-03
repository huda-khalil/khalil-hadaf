import { supabase } from "./supabase";

const BUCKET = "media";

/**
 * Upload a file to the media bucket under a given folder.
 * Returns the path inside the bucket (e.g. "book-covers/abc-123.jpg").
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  return filename;
}

/**
 * Delete a file from the media bucket.
 * Silently ignores errors (safe for cleanup).
 */
export async function deleteFile(path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path]);
}
