"use client"

import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { Actions } from "@/components/actions";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useQuery } from "convex/react";

import { useRenameModal } from "@/store/use-rename-modal";
import { Menu } from "lucide-react";

interface InfoProps {
    boardId: string;
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

export const TabSeparator = () => {
    return (
        <div className="text-neutral-300 px-1.5">
            |
        </div>
    )
}

export const Info = ({
    boardId
}: InfoProps) => {

    const { onOpen } = useRenameModal()

    const data = useQuery(api.board.Get, {
        id: boardId as Id<"boards">
    })

    if (!data) {
        return (
            <InfoSkeleton />
        )
    }

    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
            {/* TODO: Add functionality to access information about the board */}
            <Hint label="Go back to Homepage" side="bottom" sideOffset={12}>
                <Button className="px-2" variant="board" asChild>
                    <Link href="/">
                        <Image
                            src="/org-logo.svg"
                            alt="Logo"
                            height={60}
                            width={50}
                        />
                        <span className={cn("font-semibold text-xl ml-2 text-black", font.className)}>
                            DevDraws
                        </span>
                    </Link>
                </Button>
            </Hint>
            <TabSeparator />
            <Hint label="Click to edit title" side="bottom" sideOffset={12}>
              <Button
                variant="board"
                className="text-base font-normal px-2"
                onClick={() => onOpen(data._id, data.title)}
            >
                {data.title}
            </Button>  
            </Hint>
            <TabSeparator />
            <Actions
                id={data._id}
                title={data.title}
                side="bottom"
                sideOffset={12}
            >
                <div>
                    <Hint label="Main Menu" side="bottom" sideOffset={12}>
                        <Button size="icon" variant="board">
                            <Menu />
                        </Button>
                    </Hint> 
                </div>
            </Actions>
        </div>
    )
}

export const InfoSkeleton = () => {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]">
            <Skeleton className="h-full w-full bg-muted" />
        </div>
    )
}