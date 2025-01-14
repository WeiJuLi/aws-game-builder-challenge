import * as SAT from "sat";

export const catVertices1 = [
    new SAT.Vector(461.99, 231.475),
    new SAT.Vector(449.781, 288.939),
    new SAT.Vector(434.686, 306.868),
    new SAT.Vector(452.791, 345.785),
    new SAT.Vector(443.313, 373.23),
    new SAT.Vector(407.629, 378.222),
    new SAT.Vector(378.82, 355.206),
    new SAT.Vector(347.598, 362.065),
    new SAT.Vector(347.656, 362.065),
    new SAT.Vector(355.479, 395.789),
    new SAT.Vector(355.479, 395.789),
    new SAT.Vector(335.233, 411.461),
    new SAT.Vector(335.233, 411.461),
    new SAT.Vector(306.006, 412.576),
    new SAT.Vector(305.854, 412.474),
    new SAT.Vector(305.702, 412.372),
    new SAT.Vector(264.448, 383.422),
    new SAT.Vector(264.448, 383.422),
    new SAT.Vector(166.092, 366.932),
    new SAT.Vector(110.467, 331.901),
    new SAT.Vector(52.354, 361.116),
    new SAT.Vector(12.972, 345.893),
    new SAT.Vector(11.456, 307.579),
    new SAT.Vector(47.296, 261.964),
    new SAT.Vector(47.296, 261.964),
    new SAT.Vector(50.943, 210.213),
    new SAT.Vector(50.765, 210.136),
    new SAT.Vector(50.587, 210.059),
    new SAT.Vector(77.63, 168.631),
    new SAT.Vector(77.63, 168.631),
    new SAT.Vector(77.63, 168.604),
    new SAT.Vector(41.441, 119.569),
    new SAT.Vector(41.441, 119.569),
    new SAT.Vector(41.441, 119.569),
    new SAT.Vector(32.375, 58.544),
    new SAT.Vector(32.375, 58.488),
    new SAT.Vector(32.375, 58.432),
    new SAT.Vector(52.233, 35.669),
    new SAT.Vector(54.464, 36.628),
    new SAT.Vector(129.945, 129.76),
    new SAT.Vector(252.628, 140.822),
    new SAT.Vector(252.628, 140.822),
    new SAT.Vector(255.939, 96.15),
    new SAT.Vector(273.113, 89.437),
    new SAT.Vector(288.19, 83.543),
    new SAT.Vector(316.922, 110.392),
    new SAT.Vector(316.922, 110.392),
    new SAT.Vector(316.922, 110.392),
    new SAT.Vector(339.517, 59.618),
    new SAT.Vector(339.517, 59.669),
    new SAT.Vector(339.517, 59.669),
    new SAT.Vector(366.845, 99.578),
    new SAT.Vector(366.845, 99.523),
    new SAT.Vector(399.265, 76.071),
    new SAT.Vector(399.265, 76.071),
    new SAT.Vector(419.811, 108.218),
    new SAT.Vector(421.565, 103.52),
    new SAT.Vector(437.977, 160.411),
    new SAT.Vector(461.99, 231.475),
  ];


// Upated polygon's vertices with cat's animations.
  export function updatePolygon(polygon, baseVertices, cat) {
    const scaleX = cat.scale.x * 0.95;
    const scaleY = cat.scale.y * 0.95;
    const posX = cat.x;
    const posY = cat.y;
  
    const updatedVertices = baseVertices.map(({ x, y }) =>
      new SAT.Vector(posX + (x-240) * scaleX, posY + (y-240) * scaleY)
    );
  
    polygon.setPoints(updatedVertices); // Update polygon's vertices;
  }
  
 