const SAT = require("sat");

const pathData =
  "M 461.99 231.475 L 449.781 288.939 L 434.686 306.868 L 452.791 345.785 L 443.313 373.23 L 407.629 378.222 L 378.82 355.206 L 347.598 362.065 C 347.656 362.065 355.479 395.789 355.479 395.789 L 335.233 411.461 C 335.233 411.461 306.006 412.576 305.854 412.474 C 305.702 412.372 264.448 383.422 264.448 383.422 L 166.092 366.932 L 110.467 331.901 L 52.354 361.116 L 12.972 345.893 L 11.456 307.579 L 47.296 261.964 C 47.296 261.964 50.943 210.213 50.765 210.136 C 50.587 210.059 77.63 168.631 77.63 168.631 C 77.63 168.604 41.441 119.569 41.441 119.569 C 41.441 119.569 32.375 58.544 32.375 58.488 C 32.375 58.432 52.233 35.669 54.464 36.628 L 129.945 129.76 L 252.628 140.822 C 252.628 140.822 255.939 96.15 273.113 89.437 C 288.19 83.543 316.922 110.392 316.922 110.392 C 316.922 110.392 339.517 59.618 339.517 59.669 C 339.517 59.669 366.845 99.578 366.845 99.523 L 399.265 76.071 C 399.265 76.071 419.811 108.218 421.565 103.52 L 437.977 160.411 L 461.99 231.475 Z";

// 正規表達式匹配所有的座標對 (x, y)
const points = pathData.match(/-?\d+(\.\d+)?\s-?\d+(\.\d+)?/g);

const vertices = points.map((point) => {
  const [x, y] = point.split(" ").map(Number);
  return new SAT.Vector(x, y);
});

// 格式化輸出
const formattedVertices = vertices
  .map((v) => `new SAT.Vector(${v.x}, ${v.y})`)
  .join(",\n");

//console.log(formattedVertices);


// 定義多邊形 A 和 B
const polygonA = new SAT.Polygon(new SAT.Vector(0, 0), [
  new SAT.Vector(0, 0), // 左上角
  new SAT.Vector(100, 0), // 右上角
  new SAT.Vector(100, 100), // 右下角
  new SAT.Vector(0, 100), // 左下角
]);

const polygonB = new SAT.Polygon(new SAT.Vector(101, 100), [
  new SAT.Vector(0, 0), // 左上角
  new SAT.Vector(100, 0), // 右上角
  new SAT.Vector(100, 100), // 右下角
  new SAT.Vector(0, 100), // 左下角
]);

// 碰撞檢測
const isCollision = SAT.testPolygonPolygon(polygonA, polygonB);

console.log("Collision detected:", isCollision);

/*
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
new SAT.Vector(461.99, 231.475)
 */