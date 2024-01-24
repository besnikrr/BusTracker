export function calculateBoundingBox(coordinates: number[][]) {
  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;

  coordinates.forEach((coordinate: number[]) => {
    north = Math.max(north, coordinate[0]);
    south = Math.min(south, coordinate[0]);
    east = Math.max(east, coordinate[1]);
    west = Math.min(west, coordinate[1]);
  });

  return {
    north: north,
    south: south,
    east: east,
    west: west,
  };
}
