export default function PageSkeleton() {
    return (
        <div className="flex flex-col h-full gap-4 lg:gap-6">
            <div className="space-y-2">
                <div className="bg-muted w-1/4 h-6 rounded-lg animate-pulse"></div>
                <div className="bg-muted w-1/6 h-4 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex-1 grid grid-cols-5 grid-rows-5 gap-4">
                <div className="bg-muted col-span-3 rounded-lg animate-pulse"></div>
                <div className="bg-muted col-span-2 rounded-lg animate-pulse"></div>
                <div className="bg-muted col-span-4 rounded-lg animate-pulse"></div>
                <div className="bg-muted row-span-2 rounded-lg animate-pulse"></div>
                <div className="bg-muted col-span-1 rounded-lg animate-pulse"></div>
                <div className="bg-muted col-span-3 rounded-lg animate-pulse"></div>
                <div className="bg-muted col-span-2 rounded-lg animate-pulse"></div>
                <div className="bg-muted col-span-3 rounded-lg animate-pulse"></div>
                <div className="bg-muted col-span-4 rounded-lg animate-pulse"></div>
                <div className="bg-muted col-span-1 rounded-lg animate-pulse"></div>
            </div>
        </div>
    )
}