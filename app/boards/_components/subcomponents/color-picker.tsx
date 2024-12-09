"use client"

// import { useState } from "react";

import { colorToCss } from "@/lib/utils";

// import { TwitterPicker   } from "react-color"

import { Color } from "@/types/canvas"

interface ColorPickerProps {
    onChange: (color: Color) => void;
}

export const ColorPicker = ({
    onChange
}: ColorPickerProps) => {

    // const [showColorPicker, setShowColorPicker] = useState<Boolean>(false)
    // const [colorPicked, setColorPicked] = useState<Color>({
    //     r: 0,
    //     g: 0,
    //     b: 0
    // })

    // const handleChangeComplete = (color: any) => {
    //     setColorPicked({ r: color.rgb.r, g: color.rgb.g, b: color.rgb.b });
    //     onChange({ r: color.rgb.r, g: color.rgb.g, b: color.rgb.b });
    //     setShowColorPicker(false) 
    // } 

    return (
        <div
            className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200"
        >
            {/* Pre-defined colors */}
            <ColorButton
                onClick={onChange}
                color={{
                    r: 243,
                    g: 82,
                    b: 35
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 255,
                    g: 249,
                    b: 177
                }} 
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 68,
                    g: 202,
                    b: 99
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 39,
                    g: 142,
                    b: 237
                }}
            />
            <ColorButton  
                onClick={onChange} 
                color={{
                    r: 155,
                    g: 105,
                    b: 245
                }}
            />
            <ColorButton 
                onClick={onChange} 
                color={{
                    r: 252,
                    g: 142,
                    b: 42
                }} 
            />
            <ColorButton 
                onClick={onChange}
                color={{
                    r: 255,
                    g: 255,
                    b: 255
                }}     
            />
            {/* Remove if color picler implemented */}
            <ColorButton 
                onClick={onChange}
                color={{
                    r: 0,
                    g: 0,
                    b: 0
                }}     
            />


            {/* FIXME: Custom Color Picker not working */}
            {/* Custom Color Picker */}
            {/* <div>
                <button
                    className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition border border-neutral-300 rounded-md"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{
                        background: colorToCss(colorPicked)
                    }} // Display selected color
                >
                </button>

                {showColorPicker && ( 
                    <div className="absolute z-15"> 
                        <TwitterPicker
                            color={colorPicked}
                            onChangeComplete={handleChangeComplete}
                        />
                    </div>
                )}
            </div> */}
            
        </div>
    )
}

interface ColorButtonProps {
    onClick: (color: Color) => void;
    color: Color
}

const ColorButton = ({
    onClick,
    color
}: ColorButtonProps) => {
    return (
        <button
            className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
            onClick={() => onClick(color)}
        >
            <div
                className="h-8 w-8 rounded-md border border-neutral-300"
                style={{
                    background: colorToCss(color)
                }}
            >
            </div>
        </button>
    )
}