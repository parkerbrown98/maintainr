import { Upload } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { UploadTile } from "./upload-tile";

interface UploadTilesProps extends React.HTMLAttributes<HTMLDivElement> {
  uploads: Upload[];
  className?: string;
}

export function UploadTiles({
  uploads,
  className,
  ...props
}: UploadTilesProps) {
  return (
    <ScrollArea>
      <div
        className={cn(
          "max-h-[350px] flex flex-col space-y-1",
          className
        )}
        {...props}
      >
        {uploads.map((upload) => (
            <UploadTile key={upload.id} upload={upload} />
        ))}
      </div>
    </ScrollArea>
  );
}
