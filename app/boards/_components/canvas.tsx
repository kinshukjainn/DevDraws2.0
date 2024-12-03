"use client"

import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"

// import { useSelf } from "@liveblocks/react/suspense";

interface CanvasProps{
    boardId: string;
}

export const Canvas = ({
    boardId
}: CanvasProps) => {

    // boardId coming from [boardId] page.tsx, search querying

    // const info = useSelf((me) => me.info)
    // console.log(info)

    return (
        // TODO: Use Tldr {https://tldraw.dev} to enhance canvas and more features later
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar />
        </main>
    )
}