"use client"
import Link from "next/link";
import Image from "next/image";

import { formatDistanceToNow } from "date-fns" 

import { Overlay } from "./overlay";
import { Footer } from "./footer";

import { useAuth } from "@clerk/nextjs";

interface BoardCardProps{
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    createAt: number;
    imageUrl: string;
    orgId: string;
    isFavourite: boolean;
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
                    </div>
                    <Footer
                        isFavourite={isFavourite}
                        title={title}
                        authorLabel={authorLabel}
                        createAtLabel={createAtLabel}
                        onClick={() => {}}
                        disabled={false}
                    />
                </div>   
            </Link>
        </div>
    )
}