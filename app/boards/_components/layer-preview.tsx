"use client"

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { Rectangle } from "./subcomponents/rectangle";



interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor?: string
}

export const LayerPreview = memo(({
    id,
    onLayerPointerDown,
    selectionColor
}: LayerPreviewProps) => {

    const layer = useStorage((root) => root.layers.get(id))
    
    // console.log({
    //     layer
    // }, "LAYER_PREVIEW")

    if (!layer) {
        return null
    }

    switch (layer.type) {

        case LayerType.Rectangle:
            return (
                <Rectangle
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            );
        
        default:
            console.warn("Unknown Layer Type")
    }
})

LayerPreview.displayName = "LayerPreview"