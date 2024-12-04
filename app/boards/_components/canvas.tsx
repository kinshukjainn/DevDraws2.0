"use client"

import { useState } from "react"

import { CanvasState, CanvasMode } from "@/types/canvas"

import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"

// import { useSelf } from "@liveblocks/react/suspense";
import { useHistory, useCanUndo, useCanRedo } from "@liveblocks/react/suspense";

interface CanvasProps{
    boardId: string;
}

export const Canvas = ({
    boardId
}: CanvasProps) => {

    // const info = useSelf((me) => me.info)
    // console.log(info)

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    })

    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()

    return (
        // TODO: Use Tldr {https://tldraw.dev} to enhance canvas and more features later
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history.undo}
                redo={history.redo}
            />
        </main>
    )
}