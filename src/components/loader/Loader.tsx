import {Skeleton} from "@/components/ui/skeleton.tsx";

export function Loader() {
    return (
        <div className="flex space-y-3 gap-4">
            <Skeleton className="h-[250px] w-[250px] rounded-xl" />
            <Skeleton className="h-[250px] w-[250px] rounded-xl" />
            <Skeleton className="h-[250px] w-[250px] rounded-xl hidden sm:block" />
            <Skeleton className="h-[250px] w-[250px] rounded-xl hidden sm:block" />
            <Skeleton className="h-[250px] w-[250px] rounded-xl hidden sm:block" />
        </div>
    )
}

export function LoaderMovieDetails() {
    return (
        <div className="flex space-y-3 gap-4">
            <Skeleton className="h-[250px] w-[250px] rounded-xl" />
            <Skeleton className="h-[250px] w-[250px] rounded-xl" />
        </div>
    )
}