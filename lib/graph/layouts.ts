// Graph layout algorithms

import type { GraphNode, GraphData } from "./types";

/**
 * Calculate radial/concentric layout positions
 * Nodes are positioned in rings based on their distance from root
 */
export function calculateRadialLayout(
  data: GraphData,
  width: number,
  height: number
): GraphData {
  const centerX = width / 2;
  const centerY = height / 2;
  const ringSpacing = Math.min(width, height) / 8;

  // Group nodes by distance
  const nodesByDistance = new Map<number, GraphNode[]>();

  for (const node of data.nodes) {
    const distance = node.distance;
    if (!nodesByDistance.has(distance)) {
      nodesByDistance.set(distance, []);
    }
    nodesByDistance.get(distance)!.push(node);
  }

  // Position nodes in concentric rings
  const positionedNodes = data.nodes.map((node) => {
    if (node.isRoot) {
      return {
        ...node,
        x: centerX,
        y: centerY,
        fx: centerX,
        fy: centerY,
      };
    }

    const distance = node.distance;
    const nodesAtDistance = nodesByDistance.get(distance) || [];
    const nodeIndex = nodesAtDistance.indexOf(node);
    const totalAtDistance = nodesAtDistance.length;

    // Calculate angle for this node
    const angleStep = (2 * Math.PI) / totalAtDistance;
    const angle = nodeIndex * angleStep - Math.PI / 2; // Start from top

    // Calculate radius for this ring
    const radius = distance * ringSpacing;

    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      fx: centerX + radius * Math.cos(angle),
      fy: centerY + radius * Math.sin(angle),
    };
  });

  return { nodes: positionedNodes, links: data.links };
}

/**
 * Clear fixed positions to allow force simulation
 */
export function clearFixedPositions(data: GraphData): GraphData {
  const nodes = data.nodes.map((node) => ({
    ...node,
    fx: undefined,
    fy: undefined,
  }));

  return { nodes, links: data.links };
}

/**
 * Fix root node position at center
 */
export function fixRootPosition(
  data: GraphData,
  centerX: number,
  centerY: number
): GraphData {
  const nodes = data.nodes.map((node) => {
    if (node.isRoot) {
      return {
        ...node,
        x: centerX,
        y: centerY,
        fx: centerX,
        fy: centerY,
      };
    }
    return node;
  });

  return { nodes, links: data.links };
}

/**
 * Calculate initial positions for force layout
 * Spreads nodes out based on distance to help simulation converge faster
 */
export function calculateInitialPositions(
  data: GraphData,
  width: number,
  height: number
): GraphData {
  const centerX = width / 2;
  const centerY = height / 2;

  // Group nodes by distance
  const nodesByDistance = new Map<number, GraphNode[]>();

  for (const node of data.nodes) {
    const distance = node.distance;
    if (!nodesByDistance.has(distance)) {
      nodesByDistance.set(distance, []);
    }
    nodesByDistance.get(distance)!.push(node);
  }

  const positionedNodes = data.nodes.map((node) => {
    if (node.isRoot) {
      return {
        ...node,
        x: centerX,
        y: centerY,
      };
    }

    const distance = node.distance;
    const nodesAtDistance = nodesByDistance.get(distance) || [];
    const nodeIndex = nodesAtDistance.indexOf(node);
    const totalAtDistance = nodesAtDistance.length;

    // Spread initial positions with some randomness
    const baseAngle = (nodeIndex / totalAtDistance) * 2 * Math.PI;
    const angle = baseAngle + (Math.random() - 0.5) * 0.3;
    const baseRadius = distance * 100;
    const radius = baseRadius + (Math.random() - 0.5) * 50;

    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return { nodes: positionedNodes, links: data.links };
}

/**
 * Force simulation configuration for different layouts
 */
export function getForceConfig(layout: "force" | "radial") {
  if (layout === "radial") {
    return {
      linkDistance: 60,
      chargeStrength: -200,
      centerStrength: 0.05,
      collisionRadius: 20,
    };
  }

  // Default force layout
  return {
    linkDistance: 80,
    chargeStrength: -300,
    centerStrength: 0.03,
    collisionRadius: 25,
  };
}

/**
 * Calculate bounding box of nodes
 */
export function calculateBoundingBox(nodes: GraphNode[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    if (node.x !== undefined) {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
    }
    if (node.y !== undefined) {
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
    }
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Calculate zoom to fit all nodes in view
 */
export function calculateFitZoom(
  nodes: GraphNode[],
  containerWidth: number,
  containerHeight: number,
  padding = 50
): { scale: number; translateX: number; translateY: number } {
  const bbox = calculateBoundingBox(nodes);

  if (bbox.width === 0 || bbox.height === 0) {
    return { scale: 1, translateX: 0, translateY: 0 };
  }

  const availableWidth = containerWidth - padding * 2;
  const availableHeight = containerHeight - padding * 2;

  const scaleX = availableWidth / bbox.width;
  const scaleY = availableHeight / bbox.height;
  const scale = Math.min(scaleX, scaleY, 2); // Max zoom 2x

  const centerX = (bbox.minX + bbox.maxX) / 2;
  const centerY = (bbox.minY + bbox.maxY) / 2;

  const translateX = containerWidth / 2 - centerX * scale;
  const translateY = containerHeight / 2 - centerY * scale;

  return { scale, translateX, translateY };
}
