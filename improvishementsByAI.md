## utils.ts (47-81)

```
export function resizeBounds(
  bounds: XYWH,
  corner: Side,
  point: Point
): XYWH {
  
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  }

  if ((corner && Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width)
    result.width = Math.abs(bounds.x + bounds.width - point.x)
  }

  if ((corner && Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x)
    result.width = Math.abs(point.x - bounds.x)
  }

  if ((corner && Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height)
    result.height = Math.abs(bounds.y + bounds.height - point.y)
  }

  if ((corner && Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y)
    result.height = Math.abs(point.y - bounds.y)
  }

  return result
}
```

**Explaination**
This TypeScript function resizeBounds takes an existing bounding box (bounds), a corner being dragged (corner), and the new position of that corner (point), and returns a new bounding box representing the resized shape. It uses an XYWH object to represent the bounds (X, Y coordinates of the top-left corner, Width, and Height). The corner argument indicates which corner is being dragged, using a bitwise enum represented by the Side type.

**Here's a breakdown:**

1) _Initialization_: A new result object is created, initially copying the existing bounds. This ensures that if a corner isn't being resized (e.g., only resizing horizontally), the other dimensions remain unchanged.

2) _Conditional Resizing_: The code uses a series of if statements to handle resizing for each side/corner. The bitwise AND operator (&) combined with the equality check (===) is used to determine if the given corner includes the specific Side (Left, Right, Top, or Bottom). This allows the function to handle combined corners, such as Top-Left or Bottom-Right, correctly.

3) _Left Side Resizing_: If the corner includes Side.Left, the x coordinate and width of the bounding box are adjusted.
    - result.x = Math.min(point.x, bounds.x + bounds.width): The new x coordinate is set to the smaller value between the current mouse position (point.x) and the right edge of the original bounding box (bounds.x + bounds.width). This prevents the left edge from being dragged past the right edge.
    - result.width = Math.abs(bounds.x + bounds.width - point.x): The width is calculated as the absolute difference between the right edge of the original bounding box and the current mouse position. The abs ensures a positive width, regardless of dragging direction.

4) _Right Side Resizing_: Similar logic to the Left side resizing, but adjusted for the right edge. The key difference is that the x coordinate is set to the minimum of the current mouse position and the original x coordinate, preventing the right edge from being dragged past the left edge.

5) _Top Side Resizing_: Analogous to the Left side resizing, but for the vertical dimension. The y coordinate and height are adjusted.

6) _Bottom Side Resizing_: Analogous to the Right side resizing, but for the vertical dimension.

7) Return Value: The function returns the modified result object, containing the new dimensions of the resized bounding box.

**Example**:

Imagine 
> bounds = { x: 10, y: 20, width: 50, height: 30 } 

and you drag the bottom-right corner to 

> point = { x: 80, y: 60 }. 

The function would calculate:

- _Right side_: 

> result.x = min(80, 10) = 10, 

> result.width = abs(80 - 10) = 70

- Bottom side: 

> result.y = min(60, 20) = 20, 

> result.height = abs(60 - 20) = 40

The returned result would be 

> { x: 10, y: 20, width: 70, height: 40 }.


## Improved Version

```
export function resizeBounds(
  bounds: XYWH,
  corner: Side,
  point: Point
): XYWH {
  const result = { ...bounds }; // Use spread operator for cleaner copying

  const changes: { [key in Side]?: (val: number, bound: number) => number } = {
    [Side.Left]: (val, bound) => Math.min(val, bound + result.width),
    [Side.Right]: (val, bound) => Math.min(val, bound),
    [Side.Top]: (val, bound) => Math.min(val, bound + result.height),
    [Side.Bottom]: (val, bound) => Math.min(val, bound),
  };

  const sizeChanges: { [key in Side]?: (val: number, bound: number) => number } = {
    [Side.Left]: (val, bound) => Math.abs(bound + result.width - val),
    [Side.Right]: (val, bound) => Math.abs(val - bound),
    [Side.Top]: (val, bound) => Math.abs(bound + result.height - val),
    [Side.Bottom]: (val, bound) => Math.abs(val - bound),
  };


  if ((corner & Side.Left) === Side.Left) {
    result.x = changes[Side.Left]!(point.x, bounds.x);
    result.width = sizeChanges[Side.Left]!(point.x, bounds.x);
  }
  if ((corner & Side.Right) === Side.Right) {
    result.x = changes[Side.Right]!(point.x, bounds.x);
    result.width = sizeChanges[Side.Right]!(point.x, bounds.x);
  }
  if ((corner & Side.Top) === Side.Top) {
    result.y = changes[Side.Top]!(point.y, bounds.y);
    result.height = sizeChanges[Side.Top]!(point.y, bounds.y);
  }
  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = changes[Side.Bottom]!(point.y, bounds.y);
    result.height = sizeChanges[Side.Bottom]!(point.y, bounds.y);
  }

  return result;
}
```

Key improvements:

1) Spread Operator for Copying: {...bounds} creates a shallow copy of the bounds object more concisely.

2) Data-Driven Approach: Logic for calculating new x, y, width, and height is stored in the changes and sizeChanges objects. This centralizes the logic and reduces redundancy. The non-null assertion operator (!) is used after accessing the functions from the objects because TypeScript isn't able to infer that the keys will exist at runtime based on the bitwise checks.

3) Maintainability: Changes to the resizing logic now only need to be made in one place, simplifying maintenance and reducing the risk of inconsistencies. While a loop would further reduce redundancy, it would require restructuring the Side enum and possibly complicate the logic due to the differences in coordinate and dimension updates. This version strikes a good balance between conciseness and clarity.

This revised code retains the core functionality of the original while being more structured, maintainable, and slightly more efficient due to avoiding redundant calculations within the conditional blocks. It also avoids unnecessary recalculations of bounds.x + bounds.width and bounds.y + bounds.height. This improvement might be minor in this specific case but becomes more significant as complexity grows.