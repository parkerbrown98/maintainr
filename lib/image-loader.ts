interface LocalImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function LocalImageLoader({
  src,
  width,
  quality,
}: LocalImageLoaderProps) {
  return `${src}?w=${width}${quality ? `&q=${quality}` : ""}`;
}
