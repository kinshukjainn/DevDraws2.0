"use client"
import Link from "next/link";
import Image from "next/image";

import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal } from "lucide-react";

import { Overlay } from "./overlay";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";

import { useApiMutation } from "@/hooks/use-api-mutations";
import { api } from "@/convex/_generated/api";

import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
// import { useMutation } from "convex/react";
// import { Id } from "@/convex/_generated/dataModel";

interface BoardCardProps {
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    createAt: number;
    imageUrl: string;
    orgId: string;
    isFavourite: boolean;
    side?: 'left' | 'right';
}

export const BoardCard = ({
    id,
    title,
    authorName,
    authorId,
    createAt,
    imageUrl,
    orgId,
    isFavourite,
}: BoardCardProps) => {

    const userId = useAuth()

    const authorLabel = userId.userId === authorId ? "You" : authorName
    const createAtLabel = formatDistanceToNow(createAt, {
        addSuffix: true
    })

    // Using convex to manage favourites directly will loose the loading state property feature
    // const handleFavourite = useMutation(api.board.Favourite)
    // const handleUnfavourite = useMutation(api.board.Unfavourite)

    const {
        mutate: onFavourite,
        pending: pendingFavourite
    } = useApiMutation(api.board.Favourite)

    const {
        mutate: onUnfavourite ,
        pending: pendingUnfavourite
    } = useApiMutation(api.board.Unfavourite)

    const toggleFavourite = () => {
        if (isFavourite) {
            // handleUnfavourite({ id: id as Id<"boards"> })
            onUnfavourite({ id })
                .catch(() => toast.error("Failed to unfavourite"))
        } else {
            // handleFavourite({ id: id as Id<"boards">, orgId })
            onFavourite({ id, orgId })
                .catch(() => toast.error("Failed to favourite"))
        }
    }

    return (
        <div>
            <Link
                href={`/boards/${id}`}
            >
                <div
                    className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden"
                >
                    <div
                        className="relative flex-1 bg-amber-100"
                    >
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-fit"
                        />
                        <Overlay />
                        <Actions
                            id={id}
                            title={title}
                            side="right"
                        >
                            <button
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 px-3 py-2 outline-none"
                            >
                                <MoreHorizontal
                                    className="text-white opacity-75 hover:opacity-100 transition-opacity"
                                />
                            </button>
                        </Actions>
                    </div>
                    <Footer
                        isFavourite={isFavourite}
                        title={title}
                        authorLabel={authorLabel}
                        createAtLabel={createAtLabel}
                        onClick={toggleFavourite}
                        disabled={pendingFavourite || pendingUnfavourite}
                    />
                </div>
            </Link>
        </div>
    )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div
            className="aspect-[100/127] border rounded-lg overflow-hidden"
        >
            <Skeleton
                className="h-full w-full"
            />
        </div>
    )
}
