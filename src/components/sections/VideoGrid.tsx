import { useState } from "react";
import { motion } from "framer-motion";
import type { Video } from "../../schemas/video";
import VideoModal from "./VideoModal";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

function thumbnailUrl(video: Video) {
  if (video.thumbnail_path) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${video.thumbnail_path}`;
  }
  return `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;
}

export default function VideoGrid({
  videos,
  columns = 3,
}: {
  videos: Video[];
  columns?: 2 | 3 | 4;
}) {
  const [openTitle, setOpenTitle] = useState("");
  const [openYoutubeId, setOpenYoutubeId] = useState<string | null>(null);

  const colClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={`grid grid-cols-1 ${colClass} gap-8`}>
        {videos.map((video, i) => (
          <motion.button
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={() => {
              setOpenTitle(video.title);
              setOpenYoutubeId(video.youtube_id);
            }}
            className="group text-start cursor-pointer"
          >
            <div className="relative aspect-video overflow-hidden bg-hairline">
              <img
                src={thumbnailUrl(video)}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 group-hover:bg-ink/25 transition-colors duration-300">
                <div className="w-14 h-14 rounded-full border border-paper/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-paper ms-0.5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs uppercase tracking-[0.2em] text-brass">
                {video.kind}
              </div>
              <h3 className="mt-2 font-serif text-lg md:text-xl font-light text-ink group-hover:text-burgundy transition-colors">
                {video.title}
              </h3>
              {video.description && (
                <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
                  {video.description}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <VideoModal
        youtubeId={openYoutubeId}
        title={openTitle}
        onClose={() => {
          setOpenYoutubeId(null);
        }}
      />
    </>
  );
}
