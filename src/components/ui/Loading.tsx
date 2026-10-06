import { motion } from "framer-motion";

export default function Loading({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 py-20 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-2 h-2 rounded-full bg-brass"
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      {label && (
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
      )}
    </div>
  );
}
