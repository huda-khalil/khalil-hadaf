import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

type HeroImage = {
  path: string;
  position?: string;
  fit?: "cover" | "contain";
  blurBackdrop?: boolean;
};

const HERO_IMAGES: HeroImage[] = [
  { path: "hero/hero-1.jpg" },
  { path: "hero/hero-2.jpg", position: "center 45%" },
  { path: "hero/hero-4.jpg", fit: "contain" },
  { path: "hero/hero-5.jpg", fit: "contain", blurBackdrop: true },
  { path: "hero/hero-6.jpg", position: "center 50%" },
  { path: "hero/hero-7.jpg", position: "center 80%" },
  { path: "hero/hero-8.jpg" },
  { path: "hero/hero-10.jpg" },
];
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "media";
const FADE_MS = 1500;
const HOLD_MS = 6000;

export default function HeroCrossfade() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.05]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-ink h-[80vh] md:h-[70vh] lg:h-[75vh]">
      <motion.div style={{ opacity, scale }} className="absolute inset-0">
        {HERO_IMAGES.map((img, i) => {
          const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${img.path}`;
          const isActive = i === index;

          return (
            <motion.div
              key={img.path}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
            >
              {img.blurBackdrop && (
                <img
                  src={url}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-70"
                />
              )}
              <img
                src={url}
                alt=""
                data-hero={img.path.split("/").pop()?.replace(".jpg", "")}
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: img.fit ?? "cover",
                  objectPosition: img.position ?? "center 35%",
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="absolute inset-0 bg-ink/55" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <h1 className="hero-name text-paper text-6xl md:text-7xl lg:text-8xl leading-tight">
          {t("hero.name")}
        </h1>

        <div className="mt-6 h-px w-16 bg-brass" />

        <p className="mt-6 text-paper/80 text-sm md:text-base tracking-[0.2em] uppercase font-light">
          {t("hero.tagline")}
        </p>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-paper/70"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
