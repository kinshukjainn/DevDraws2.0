"use client"

// Skip re-rendering a component when props are unchanged.
import { memo } from "react"

import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { Cursor } from "./subcomponents/cursor";

const Cursors = () => {
    const ids = useOthersConnectionIds()

    return (
        <>
            {ids.map((connectionId) => (
                <Cursor
                    key={connectionId}
                    connectionId={connectionId}
                />
            ))}
        </>
    )
}

export const CursorsPresence = memo(() => {
    return (
        <>
            {/* TODO: Draft Pencil Component */}
            <Cursors />
        </>
    )
})

CursorsPresence.displayName = "CursorsPresence"