"use client"

import { useCallback, useState } from "react"

import { nanoid } from "nanoid"

import {
    CanvasState,
    CanvasMode,
    Camera,
    Color,
    Point,
    LayerType
} from "@/types/canvas"

import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"

import { useStorage } from "@liveblocks/react"
// import { useSelf } from "@liveblocks/react/suspense";
import {
    useHistory,
    useCanUndo,
    useCanRedo,
    useMutation
} from "@liveblocks/react/suspense";

import { LiveObject } from "@liveblocks/client"

import { CursorsPresence } from "./cursors-presence"

import { pointerEventToCanvasPoint } from "@/lib/utils"
import { LayerPreview } from "./layer-preview"

interface CanvasProps {
    boardId: string;
}

const MAX_LAYERS = 100;

export const Canvas = ({
    boardId
}: CanvasProps) => {

    // const info = useSelf((me) => me.info)
    // console.log(info)

    // Retrieving info about all layers displayed on the canvas
    const layerIds = useStorage((root) => root.layerIds)

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    })

    // We are going to paint all layers with black color initially
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 0,
        g: 0,
        b: 0,
    })

    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })

    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()

    const insertLayer = useMutation((
        { storage, setMyPresence },
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
        position: Point,
    ) => {

        const liveLayers = storage.get("layers")

        if (liveLayers.size >= MAX_LAYERS) {
            return
        }

        const liveLayerIds = storage.get("layerIds")

        const layerId = nanoid()
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            width: 100,
            height: 100,
            fill: lastUsedColor,
        })

        liveLayerIds.push(layerId)
        liveLayers.set(layerId, layer)

        setMyPresence({ selection: [layerId] }, { addToHistory: true })
        setCanvasState({ mode: CanvasMode.None })

    }, [lastUsedColor])

    // Used for zooming in and out of the canvas
    const onWheel = useCallback((e: React.WheelEvent) => {

        // console.log({
        //     x: e.deltaX,
        //     y: e.deltaY
        // })

        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY
        }))

    }, [])

    const onPointersMove = useMutation((
        { setMyPresence },
        e: React.PointerEvent
    ) => {

        e.preventDefault()

        // Convert pointer event to canvas coordinates
        const current = pointerEventToCanvasPoint(e, camera)

        // console.log(current)

        setMyPresence({ cursor: current })
    }, [])

    const onPointersLeave = useMutation((
        { setMyPresence },
    ) => {

        setMyPresence({ cursor: null })

    }, [])

    const onPointersUp = useMutation((
        { },
        e: React.PointerEvent
    ) => {

        const point = pointerEventToCanvasPoint(e, camera)

        console.log({
            point,
            mode: canvasState.mode,
        })

        if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point)
        } else {
            mode: CanvasMode.None
        }

        history.resume

    }, [
        camera,
        canvasState,
        history,
        insertLayer,
    ])

    return (
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
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointersMove}
                onPointerLeave={onPointersLeave}
                onPointerUp={onPointersUp}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`
                    }}
                >
                    {layerIds?.map((layerId) => {
                        return (
                            <LayerPreview
                                key={layerId}
                                id={layerId}
                                onLayerPointerDown={() => { }}
                                selectionColor="#000"
                            />
                        )
                    })
                    }
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    )
}