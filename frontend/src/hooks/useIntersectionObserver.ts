import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverProps {
  threshold?: number | number[];
  rootMargin?: string;
}

export const useIntersectionObserver = (
  props?: UseIntersectionObserverProps,
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing after element becomes visible (one-time load)
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: props?.threshold ?? 0.1,
        rootMargin: props?.rootMargin ?? "50px",
      },
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [props?.threshold, props?.rootMargin]);

  return { elementRef, isVisible };
};
