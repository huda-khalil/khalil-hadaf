import { useRef, useState, useEffect } from "react";
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

export default function VideoCarousel({ videos }: { videos: Video[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [openTitle, setOpenTitle] = useState("");
  const [openYoutubeId, setOpenYoutubeId] = useState<string | null>(null);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [videos.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = first?.offsetWidth ?? 320;
    const gap = 32;
    el.scrollBy({
      left: dir * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  const handleOpen = (video: Video) => {
    setOpenTitle(video.title);
    setOpenYoutubeId(video.youtube_id);
  };

  return (
    <div className="relative flex items-center gap-4">
      {/* Left arrow */}
      <button
        onClick={() => scrollByCard(-1)}
        aria-label="Previous"
        className="relative z-10 shrink-0 w-11 h-11 flex items-center justify-center border border-ink/40 rounded-full text-ink hover:text-burgundy hover:border-burgundy bg-paper transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M15 18l-6-6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollerRef}
        className="flex-1 flex gap-8 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((video, i) => (
          <motion.button
            key={video.id}
            data-card
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={() => handleOpen(video)}
            className="group text-start cursor-pointer shrink-0 w-[320px]"
          >
            <div className="relative aspect-video overflow-hidden bg-hairline">
              <img
                src={thumbnailUrl(video)}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 group-hover:bg-ink/25 transition-colors duration-300">
                <div className="w-14 h-14 rounded-full border border-paper/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs uppercase tracking-[0.2em] text-brass">
                {video.kind}
              </div>
              <h3 className="mt-2 font-serif text-lg md:text-xl font-light text-ink group-hover:text-burgundy transition-colors line-clamp-2">
                {video.title}
              </h3>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scrollByCard(1)}
        aria-label="Next"
        className="relative z-10 shrink-0 w-11 h-11 flex items-center justify-center border border-ink/40 rounded-full text-ink hover:text-burgundy hover:border-burgundy bg-paper transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <VideoModal
        youtubeId={openYoutubeId}
        title={openTitle}
        onClose={() => setOpenYoutubeId(null)}
      />
    </div>
  );
}
