## canvas.tsx ('app\boards\_components\canvas.tsx'): Event Handling for Zooming and Cursor Tracking
This section defines two event handlers: onWheel and onPointersMove.
- **onWheel**: This function handles the mouse wheel event (WheelEvent). It's used for zooming in and out of the canvas.

```
const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY
        }))
    }, [])
```
1) *useCallback*: This hook memoizes the function, preventing unnecessary re-renders. It only recomputes the memoized value when one of its dependencies changes (in this case, there are no dependencies, so it's only created once).

2) *setCamera*: This function updates the camera state, which controls the viewport of the canvas.

3) *Logic*: When the user scrolls the mouse wheel, the deltaX and deltaY values of the event indicate the horizontal and vertical scroll amounts. The code subtracts these delta values from the current camera position, effectively panning the view in the opposite direction of the scroll. For example, scrolling down (positive deltaY) moves the camera up (decreases camera.y), making the content appear to move down.

- **onPointersMove**: This function handles pointer movement events (PointerEvent). It's used for tracking the user's cursor position and sharing it with other collaborators.

```
const onPointersMove = useMutation((
        { setMyPresence },
        e: React.PointerEvent
    ) => {
        e.preventDefault()

        const current = pointerEventToCanvasPoint(e, camera)
        setMyPresence({ cursor: current })
    }, [])
```
1) *useMutation*: This hook from Liveblocks is used to update the user's presence, which can be used for real-time collaboration features.

2) *setMyPresence*: This function, provided by the useMutation hook, updates the current user's presence data.

## canvas.tsx ('types\canvas.ts') : Type Definitions for Canvas Elements and States
This file defines various types used by the canvas component.

- **Color, Camera, Point, XYWH**: These types define basic geometric structures:
   - *Color*: Represents an RGB color.
   - *Camera*: Represents the viewport of the canvas.
   - *Point*: Represents a 2D point.
   - *XYWH*: Represents a rectangle by its top-left corner coordinates (x, y), width, and height.

- **LayerType**: An enum defining the different types of shapes that can be drawn on the canvas (Rectangle, Ellipse, Path, Text, Note).

- **RectangleLayer, EllipseLayer, PathLayer, TextLayer, NoteLayer**: These interfaces define the properties of each layer type, including its position, dimensions, fill color, and optional value (for text or notes).

- **Side**: An enum representing the sides of a rectangle (Top, Bottom, Left, Right). Used for resizing.

- **CanvasState**: A union type representing the different states the canvas can be in. This is crucial for managing user interaction:
   - *None*: No interaction is taking place.
   - *Pressing*: The user is pressing down on the canvas (possibly to start drawing or selecting).
   - *SelectionNet*: The user is dragging a selection net.
   - *Translating*: The user is moving selected elements.
   - *Inserting*: The user is inserting a new element of a specific type.
   - *Resizing*: The user is resizing an element.
   - *Pencil*: The user is drawing with the pencil tool.
   - *Erasing*: The user is erasing elements from the canvas.

- **CanvasMode**: An enum corresponding to the different modes in CanvasState.

## utils.ts ('lib\utils.ts')
This file contains utility functions.

- **pointerEventToCanvasPoint**: Converts a pointer event (like a mouse click or touch) into canvas coordinates, taking into account the camera offset. This is crucial for correct positioning of elements when the canvas is panned.
```
export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return ({
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y
  })
}
```
This function takes a React.PointerEvent (which contains information about the pointer interaction) and the Camera object as input. It returns a Point object representing the position of the pointer on the canvas.

e.clientX and e.clientY give the pointer coordinates relative to the browser window's viewport. Subtracting camera.x and camera.y respectively adjusts these coordinates to be relative to the canvas itself, considering the current pan offset. Math.round ensures the resulting coordinates are integers, which is usually necessary for pixel-based drawing.
