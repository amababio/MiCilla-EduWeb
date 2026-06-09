"use client";

import { useEffect, useRef, useState } from "react";
import { SchoolImage } from "@/components/shared/SchoolImage";

export type HeroCarouselSlide = {
  imageUrl: string;
  title: string;
};

type HeroCarouselProps = {
  slides: HeroCarouselSlide[];
  intervalMs?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  playWhenInView?: boolean;
};

function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

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

export function HeroCarousel({
  slides,
  intervalMs = 4500,
  className = "",
  imageClassName = "h-full w-full object-cover",
  priority = false,
  playWhenInView = false,
}: HeroCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(!playWhenInView);
  const reducedMotion = usePrefersReducedMotion();
  const canHoverPause = useFinePointerHover();

  useEffect(() => {
    if (!playWhenInView || !rootRef.current) {
      return;
    }

    const element = rootRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [playWhenInView]);

  useEffect(() => {
    if (slides.length <= 1 || paused || !inView) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs, paused, inView]);

  if (slides.length === 0) {
    return null;
  }

  const hoverHandlers = canHoverPause
    ? {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
      }
    : {};

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full ${className}`}
      {...hoverHandlers}
    >
      {slides.map((slide, slideIndex) => {
        const isActive = slideIndex === index;

        return (
          <div
            key={`${slide.imageUrl}-${slideIndex}`}
            className={`absolute inset-0 ${
              isActive ? "z-10 opacity-100" : "z-0 opacity-0"
            } ${
              reducedMotion
                ? ""
                : "transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
            }`}
            aria-hidden={!isActive}
          >
            <SchoolImage
              src={slide.imageUrl}
              alt={slide.title || "School photo"}
              className={imageClassName}
              priority={priority && slideIndex === 0}
            />
          </div>
        );
      })}

      {slides.length > 1 ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-black/35 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5"
            aria-hidden="true"
          >
            {slides.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dotIndex === index ? "w-4 bg-white" : "w-1.5 bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
