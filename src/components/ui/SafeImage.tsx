import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Image with an honest fallback (§31).
 *
 * Asset paths in /src/content are typed `string | null`. `null` means Meet
 * hasn't supplied that file yet, and rendering a real <Image> for it would
 * 404. So this component draws a neutral placeholder at the correct aspect
 * ratio instead — the layout stays truthful, and no build breaks because a
 * photo is missing (§2, rule 11).
 *
 * In development the placeholder is labelled with what's needed, so gaps are
 * visible while building. In production it stays silent and neutral.
 */
export function SafeImage({
  src,
  alt,
  /** What's missing — shown on the dev placeholder, e.g. "Hero portrait". */
  label,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  className,
  containerClassName,
}: {
  src: string | null;
  /** Empty string marks the image decorative (§29). */
  alt: string;
  label?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
}) {
  if (!src) {
    return (
      <div
        // Decorative: it represents absent content, not content itself.
        aria-hidden
        className={cn(
          "flex items-center justify-center overflow-hidden bg-linear-to-br from-surface-alt to-primary-pale/40",
          fill ? "absolute inset-0" : "h-full w-full",
          containerClassName,
          className,
        )}
      >
        {process.env.NODE_ENV === "development" && (
          <span className="flex flex-col items-center gap-2 p-4 text-center">
            <ImageIcon className="size-6 text-primary/40" />
            <span className="text-xs font-medium text-primary-deep/60">
              {label ? `[[ADD ${label.toUpperCase()}]]` : "[[ADD IMAGE]]"}
            </span>
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      // §32: only true above-the-fold imagery gets priority; everything else
      // stays lazy.
      loading={priority ? undefined : "lazy"}
      className={cn(fill && "object-cover", className)}
    />
  );
}
