import { Sprite, Assets, Graphics } from "pixi.js";
import * as SAT from "sat";

// Obstacle configuration
export const obstacleConfig = {
  order: [
    "hang1",
    "gift1",
    "hang2",
    "wall",
    "gift1",
    "gift2",
    "gift1",
    "hang1",
    "wall",
    "wall",
    "gift2",
    "hang1",
    "gift1",
    "wall",
  ],
  distances: [750, 750, 700, 650, 600, 550, 650, 600, 550, 550, 560, 600, 500],
};

// Load obstacle assets
export const loadObstacleAssets = () => {
  const assets = [
    { alias: "hang1", src: "/assets/hang1.png" },
    { alias: "hang2", src: "/assets/hang2.png" },
    { alias: "gift1", src: "/assets/gift1.png" },
    { alias: "gift2", src: "/assets/gift2.png" },
    { alias: "wall", src: "/assets/wall.png" },
  ];
  // Add assets and load them.
  assets.forEach((asset) => Assets.add(asset));
  // Taking the array of aliases and loads the corresponding assets into memory.
  return Assets.load(assets.map((asset) => asset.alias));
};

// Generate obstacles
export const generateObstacles = (app, config) => {
  const { order, distances } = config;
  const obstacles = [];
  let xPosition = 850;

  // Define settings for each type of obstacle.
  const settings = {
    hang1: { scale: { x: 0.5, y: 0.5 }, yPosit: 0, per: 1 },
    hang2: { scale: { x: 0.7, y: 0.7 }, yPosit: 0, per: 1 },
    gift1: { scale: { x: 0.25, y: 0.25 }, yPosit: 320, per: 1 },
    gift2: { scale: { x: 0.25, y: 0.25 }, yPosit: 320, per: 1 },
    wall: { scale: { x: 0.5, y: 0.5 }, yPosit: 0, per: 1 },
  };

  order.forEach((alias, index) => {
    const obstacle = Sprite.from(Assets.get(alias));
    const { scale, yPosit, per } = settings[alias] || {
      scale: { x: 1, y: 1 },
      yPosit: 98,
      per: 1,
    };
    obstacle.x = xPosition;
    obstacle.y = yPosit;
    obstacle.scale.set(scale.x, scale.y);
    //console.log(`xPosition before adding: ${xPosition}`);
    //console.log(`Distance to add: ${distances[index % distances.length]}`);
    obstacle.per = per;
    obstacle.alias = alias;
    //console.log(`obstacle bound: x=${obstacle.boundX}, y=${obstacle.boundY}, width=${obstacle.boundWidth}, height=${obstacle.boundHeight}`);
    obstacles.push(obstacle);
    app.stage.addChild(obstacle);
    xPosition += distances[index % distances.length];
  });

  return obstacles; // Array for collision detection
};

// Check collision
export function isPolygonCollision(catPolygon, obstacleBounds, graphics) {
  // Convert obstacleBounds to SAT Vector 4 points
  const obstacleVertices = [
    new SAT.Vector(obstacleBounds.x, obstacleBounds.y), // upper left
    new SAT.Vector(obstacleBounds.x+obstacleBounds.width, obstacleBounds.y), // upper right
    new SAT.Vector(obstacleBounds.x+obstacleBounds.width, obstacleBounds.y+obstacleBounds.height), // lower right
    new SAT.Vector(obstacleBounds.x, obstacleBounds.y+obstacleBounds.height), // lower left
    
  ];

  const obstaclePolygon = new SAT.Polygon(
    new SAT.Vector(0,0), // Starting point
    obstacleVertices
  );

  //obstaclePolygon.points.forEach((vertex, index) => {
    //console.log(`Vertex ${index + 1}: x=${vertex.x}, y=${vertex.y}`);
  //});

  //graphics.clear();

  // Draw vectors of obstacles. 
  /*
  obstacleVertices.forEach((vertex) => {
    graphics.circle(vertex.x, vertex.y, 5); 
    graphics.fill("blue");
  });
  */
  return SAT.testPolygonPolygon(catPolygon, obstaclePolygon);
}
