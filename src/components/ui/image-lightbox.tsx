import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
  style?: React.CSSProperties;
}

export default function ImageLightbox({ src, alt, className, caption, style }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-2 w-full">
        <div
          className="relative group cursor-zoom-in w-full"
          onClick={() => setOpen(true)}
        >
          <img
            src={src}
            alt={alt}
            className={className}
            style={style}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-sm">
            <div className="flex items-center gap-1.5 bg-black/60 text-white text-xs px-3 py-1.5 rounded-sm">
              <Icon name="ZoomIn" size={13} />
              Открыть полностью
            </div>
          </div>
        </div>
        {caption && (
          <p className="text-xs text-muted-foreground text-center">{caption}</p>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <Icon name="X" size={24} />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {caption && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60 text-center px-4">
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
