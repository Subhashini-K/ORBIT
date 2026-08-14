import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BrandIcon, type BrandKey } from "@/components/common/BrandIcon";
import { Skeleton } from "@/components/ui/skeleton";

interface UniverseNodeProps {
  brand: BrandKey;
  label: string;
  meta?: string;
  to: string;
  top: number; // percentage
  left: number; // percentage
  delay: number;
  loading?: boolean;
}

/** A single orbiting source icon within the Orbit Universe visualization. */
export function UniverseNode({ brand, label, meta, to, top, left, delay, loading }: UniverseNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top: `${top}%`, left: `${left}%` }}
    >
      <Link to={to} className="focus-ring group flex flex-col items-center gap-2 rounded-2xl">
        <motion.div whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.97 }} className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-white/5 blur-md transition-opacity group-hover:opacity-100" />
          <BrandIcon brand={brand} size={52} glow className="h-[52px] w-[52px] ring-2 ring-white/10 transition-all group-hover:ring-white/25 sm:h-16 sm:w-16" />
        </motion.div>
        <div className="text-center">
          <p className="text-xs font-semibold text-white sm:text-sm">{label}</p>
          {loading ? (
            <Skeleton className="mx-auto mt-1 h-3 w-14" />
          ) : (
            <p className="text-[11px] text-slate-400">{meta}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
