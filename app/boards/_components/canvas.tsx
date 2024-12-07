"use client"

import {
    useCallback,
    useMemo,
    useState
} from "react"

import { nanoid } from "nanoid"

import {
    CanvasState,
    CanvasMode,
    Camera,
    Color,
    Point,
    LayerType,
    Side,
    XYWH
} from "@/types/canvas"

import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"
import { LayerPreview } from "./layer-preview"
import { SelectionBox } from "./selection-box"
import { CursorsPresence } from "./cursors-presence"

import { useStorage } from "@liveblocks/react"
// import { useSelf } from "@liveblocks/react/suspense";
import {
    useHistory,
    useCanUndo,
    useCanRedo,
    useMutation,
    useOthersMapped
} from "@liveblocks/react/suspense";

import { LiveObject } from "@liveblocks/client"

import {
    connectionIdToColor,
    pointerEventToCanvasPoint,
    resizeBounds
} from "@/lib/utils"

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

    const resizeSelectedLayer = useMutation((
        { storage, self },
        point: Point
    ) => {
        
        if (canvasState.mode !== CanvasMode.Resizing) {
            return
        }

        const bounds = resizeBounds(
            canvasState.initialBounds,
            canvasState.corner,
            point
        )

        const liveLayers = storage.get("layers")
        const layer = liveLayers.get(self.presence.selection[0])

        if (layer) {
            layer.update(bounds)
        }

    }, [canvasState])

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

        if (canvasState.mode === CanvasMode.Resizing) {
            // console.log("Resizing")
            resizeSelectedLayer(current)
        }

        setMyPresence({ cursor: current })

    }, [
        camera,
        canvasState,
        resizeSelectedLayer
    ])

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

        // console.log({
        //     point,
        //     mode: canvasState.mode,
        // })

        if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point)
        } else {
            mode: CanvasMode.None
        }

        setCanvasState({ mode: CanvasMode.None })

        history.resume

    }, [
        camera,
        canvasState,
        history,
        insertLayer,
    ])

    const onLayerPointerDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId: string
    ) => {

        if (
            canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting
        ) {
            return;
        }

        history.pause()
        e.stopPropagation()

        const point = pointerEventToCanvasPoint(e, camera)

        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true })
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point })

    }, [])

    const onResizeHandlePointerDown = useCallback((
        corner: Side,
        initialBounds: XYWH
    ) => {

        // console.log({
        //     corner,
        //     initialBounds
        // })

        history.pause();

        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner
        })
    }, [history])

    // Used to track the presence of other users in the room.
    const selections = useOthersMapped((other) => other.presence.selection)

    const layerIdsToColorSelection = useMemo(() => {

        const layerIdsToColorSelection: Record<string, string> = {}

        for (const user of selections) {
            const [connectionId, selection] = user

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
            }
        }

        return layerIdsToColorSelection

    }, [selections])

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
                                onLayerPointerDown={onLayerPointerDown}
                                selectionColor={layerIdsToColorSelection[layerId]}
                            />
                        )
                    })
                    }
                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    )
}