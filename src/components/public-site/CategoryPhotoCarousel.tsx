"use client";

import { useEffect, useRef, useState } from "react";
import { SchoolImage } from "@/components/shared/SchoolImage";

export type CategoryCarouselPhoto = {
  imageUrl: string;
  title: string;
};

type CategoryPhotoCarouselProps = {
  photos: CategoryCarouselPhoto[];
  intervalMs?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

function useFinePointerHover(): boolean {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return canHover;
}

export function CategoryPhotoCarousel({
  photos,
  intervalMs = 2800,
  className = "",
  imageClassName = "h-full w-full object-cover",
  priority = false,
}: CategoryPhotoCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const canHover = useFinePointerHover();

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const element = rootRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const shouldPlay =
    photos.length > 1 &&
    ((canHover && hovering) || (!canHover && inView));

  useEffect(() => {
    if (!shouldPlay) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % photos.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [photos.length, intervalMs, shouldPlay]);

  if (photos.length === 0) {
    return null;
  }

  const activePhoto = photos[index] ?? photos[0];
  const hoverHandlers = canHover
    ? {
        onMouseEnter: () => setHovering(true),
        onMouseLeave: () => setHovering(false),
      }
    : {};

  if (photos.length === 1) {
    return (
      <div ref={rootRef} className={`relative h-full w-full ${className}`}>
        <SchoolImage
          src={activePhoto.imageUrl}
          alt={activePhoto.title}
          className={imageClassName}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full ${className}`}
      {...hoverHandlers}
    >
      {photos.map((photo, photoIndex) => {
        const isActive = photoIndex === index;

        return (
          <div
            key={`${photo.imageUrl}-${photoIndex}`}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
              isActive ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <SchoolImage
              src={photo.imageUrl}
              alt={photo.title}
              className={imageClassName}
              priority={priority && photoIndex === 0}
            />
          </div>
        );
      })}
    </div>
  );
}
