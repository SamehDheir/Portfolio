import Image, { ImageProps } from "next/image";
import React from "react";

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  fallback?: string;
  containerClassName?: string;
}

export const OptimizedImage = React.memo(
  ({
    src,
    alt,
    fallback,
    containerClassName,
    ...props
  }: OptimizedImageProps) => {
    const [hasError, setHasError] = React.useState(false);
    const imageSrc = hasError && fallback ? fallback : src;

    return (
      <div className={containerClassName}>
        <Image
          src={imageSrc}
          alt={alt}
          {...props}
          onError={() => setHasError(true)}
          loading="lazy"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
        />
      </div>
    );
  },
);

OptimizedImage.displayName = "OptimizedImage";
