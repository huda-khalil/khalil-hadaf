import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { TimelineEvent } from "../../schemas/timeline";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 40%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="absolute top-0 bottom-0 w-px bg-hairline"
        style={{ insetInlineStart: "50%" }}
      />

      <motion.div
        className="absolute top-0 w-px bg-burgundy origin-top"
        style={{
          insetInlineStart: "50%",
          height: lineHeight,
        }}
      />

      <div className="flex flex-col">
        {events.map((event, i) => (
          <TimelineItem
            key={event.id}
            event={event}
            side={i % 2 === 0 ? "start" : "end"}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({
  event,
  side,
}: {
  event: TimelineEvent;
  side: "start" | "end";
}) {
  const isStart = side === "start";
  const photoUrl = event.photo_path
    ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${event.photo_path}`
    : null;
  const altText = event.title || event.title_fa || "";

  return (
    <div className="relative grid grid-cols-2 gap-x-16 py-12">
      {/* Left column */}
      <div className={isStart ? "text-end pe-8" : "flex justify-end pe-8"}>
        {isStart ? (
          <EventContent event={event} align="end" />
        ) : photoUrl ? (
          <EventPhoto url={photoUrl} alt={altText} align="end" />
        ) : null}
      </div>

      {/* Right column */}
      <div className={!isStart ? "text-start ps-8" : "flex justify-start ps-8"}>
        {!isStart ? (
          <EventContent event={event} align="start" />
        ) : photoUrl ? (
          <EventPhoto url={photoUrl} alt={altText} align="start" />
        ) : null}
      </div>

      {/* Dot on the line */}
      <div
        className="absolute top-16 w-2.5 h-2.5 rounded-full bg-burgundy border-2 border-paper"
        style={{
          insetInlineStart: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}

function EventContent({
  event,
  align,
}: {
  event: TimelineEvent;
  align: "start" | "end";
}) {
  const isEnd = align === "end";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={isEnd ? "text-end" : "text-start"}
    >
      <div className="font-serif text-4xl md:text-5xl font-light text-burgundy leading-none">
        {event.year}
      </div>

      <div className="mt-3 font-serif text-xl md:text-2xl font-light text-ink">
        {event.title || event.title_fa}
      </div>

      {event.description && (
        <p className="mt-3 text-sm text-muted leading-relaxed max-w-xs inline-block">
          {event.description}
        </p>
      )}

      <div
        className={`mt-3 text-xs uppercase tracking-[0.2em] text-brass ${
          isEnd ? "text-end" : "text-start"
        }`}
      >
        {event.kind}
      </div>
    </motion.div>
  );
}

function EventPhoto({
  url,
  alt,
  align,
}: {
  url: string;
  alt: string;
  align: "start" | "end";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={align === "end" ? "text-end" : "text-start"}
    >
      <img
        src={url}
        alt={alt}
        className="w-40 h-40 md:w-56 md:h-56 object-cover inline-block"
        style={{
          boxShadow: "0 8px 20px rgba(28, 26, 23, 0.12)",
        }}
      />
    </motion.div>
  );
}
