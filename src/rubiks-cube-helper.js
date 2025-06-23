import * as THREE from "three";
export function createCubie(x, y, z, cubeSize, gap, colors) {
  const faceColors = [
    x === 1 ? colors.orange : colors.black, // -X
    x === -1 ? colors.red : colors.black,   // +X
    y === 1 ? colors.yellow : colors.black, // -Y
    y === -1 ? colors.white : colors.black, // +Y
    z === 1 ? colors.blue : colors.black,   // -Z
    z === -1 ? colors.green : colors.black, // +Z
  ];
  const materials = faceColors.map(color => new THREE.MeshBasicMaterial({ color }));
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
    materials
  );
  const cubie = new THREE.Group();
  cubie.add(mesh);
  cubie.position.set(
    x * (cubeSize + gap),
    y * (cubeSize + gap),
    z * (cubeSize + gap)
  );
  cubie.userData = { x, y, z };
  console.log(`Cubie created at position: (${x}, ${y}, ${z})`);
  return cubie;
}

export function createRubiksCube(cubeSize, gap, colors) {
  const group = new THREE.Group();
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        group.add(createCubie(x, y, z, cubeSize, gap, colors));
      }
    }
  }
  return group;
}

function createLockedEventListener(handler) {
  let isLocked = false;

  return async function (...args) {
    if (isLocked) {
      console.warn("Event handler is locked, ignoring this event.");
      return;
    }

    isLocked = true;
    try {
      await handler.apply(this, args);
    } finally {
      isLocked = false;
    }
  };
}

// Keyboard controls
export function setupKeyboardControls(rubiksCube, scene) {
  document.addEventListener(
    "keydown",
    createLockedEventListener(async (e) => {
      // Timeout to prevent multiple key presses from triggering too quickly
      // TODO: this is a hacky way to prevent multiple key presses from triggering too quickly
      // Ideally, we should use a more robust solution like a queue or a state machine
      // to handle multiple key presses in a more controlled manner
      await new Promise((resolve) => setTimeout(resolve, 300));
      switch (e.key) {
        // Front/Back layers (Z-axis)
        case "f":
          rotateLayer("z", 1, 1, rubiksCube, scene);
          break; // Front layer clockwise
        case "F":
          rotateLayer("z", 1, -1, rubiksCube, scene);
          break;
        case "b":
          rotateLayer("z", -1, 1, rubiksCube, scene);
          break; // Back layer clockwise
        case "B":
          rotateLayer("z", -1, -1, rubiksCube, scene);
          break;

        // Left/Right layers (X-axis)
        case "l":
          rotateLayer("x", -1, 1, rubiksCube, scene);
          break; // Left layer clockwise
        case "L":
          rotateLayer("x", -1, -1, rubiksCube, scene);
          break;
        case "r":
          rotateLayer("x", 1, 1, rubiksCube, scene);
          break; // Right layer clockwise
        case "R":
          rotateLayer("x", 1, -1, rubiksCube, scene);
          break;

        // Top/Bottom layers (Y-axis)
        case "u":
          rotateLayer("y", 1, 1, rubiksCube, scene);
          break; // Top layer clockwise
        case "U":
          rotateLayer("y", 1, -1, rubiksCube, scene);
          break;
        case "d":
          rotateLayer("y", -1, 1, rubiksCube, scene);
          break; // Bottom layer clockwise
        case "D":
          rotateLayer("y", -1, -1, rubiksCube, scene);
          break;
      }
    }),
  );
}
// Rotate a layer of the Rubik's Cube
// axis: "x", "y", or "z"
// layer: -1 (left/bottom/back), 0 (middle), 1 (right/top/front)
// direction: 1 (clockwise) or -1 (counter-clockwise)
// rubiksCube: the THREE.Group containing the Rubik's Cube
// scene: the THREE.Scene to which the cube belongs
// This function rotates the specified layer of the Rubik's Cube
// around the specified axis in the specified direction.
// It finds all cubies in the specified layer, groups them, and applies a rotation animation
// to the group. After the rotation, it updates the positions of the cubies
// to reflect their new positions in the cube.
// It also logs the rotation action and the cubies involved in the rotation.
// It uses THREE.js for 3D rendering and animation.
function rotateLayer(axis, layer, direction, rubiksCube, scene) {
  // Validate axis and layer
  if (!["x", "y", "z"].includes(axis) || ![-1, 0, 1].includes(layer)) {
    console.error("Invalid axis or layer for rotation");
    return;
  }

  console.log(`Rotating layer ${layer} along ${axis}-axis in direction ${direction}`);
  const rotationSpeed = Math.PI / 20;
  // 1. Collect cubies in the layer
  const layerCubies = rubiksCube.children.filter(c => c.userData[axis] === layer);
  console.log(`Found ${layerCubies.length} cubies in layer ${layer} along ${axis}-axis`);
  
  const tempGroup = new THREE.Group();
  // 2. Create a temporary group and add cubies
  layerCubies.forEach(cubie => tempGroup.attach(cubie));
  scene.add(tempGroup);

  // 3. Animate rotation of tempGroup
  let currentRotation = 0;

  // TODO: should change this to more meaningful constant name
  // e.g. clockwise, counterclockwise
  const targetRotation = (Math.PI / 2) * direction;

  function rotationAnimateLoop() {
    const step = Math.min(rotationSpeed, Math.abs(targetRotation - rotated));
    currentRotation += step;
    tempGroup.rotation[axis] = direction * currentRotation;
    if (currentRotation < Math.abs(targetRotation)) {
      requestAnimationFrame(rotationAnimateLoop);
    } else {
      // 4. Detach cubies back to rubiksCube and reset tempGroup
      layerCubies.forEach(c => rubiksCube.attach(c));
      scene.remove(tempGroup);
      updateCubiePositions(axis, layer, direction, rubiksCube);
    }
  }
  rotationAnimateLoop();
}

// Update cubie positions after rotation
function updateCubiePositions(axis, layer, direction, cubies) {
  // Update the userData of each cubie to reflect the new position
  console.log("Updating cubie positions");
  console.log(cubies.children.map((cubie) => cubie.userData));

  cubies.children.forEach((cubie) => {
    const pos = cubie.userData;
    if (pos[axis] === layer) {
      let { x, y, z } = pos;
      switch (axis) {
        case "x": // Rotate around X-axis (left/right layers)
          [y, z] = direction === 1 ? [-z, y] : [z, -y];
          break;
        case "y": // Rotate around Y-axis (top/bottom layers)
          [x, z] = direction === 1 ? [z, -x] : [-z, x];
          break;
        case "z": // Rotate around Z-axis (front/back layers)
          [x, y] = direction === 1 ? [-y, x] : [y, -x];
          break;
      }
      cubie.userData = { x, y, z };
    }
  });

  console.log("Cubie positions updated");
  console.log(cubies.children.map((cubie) => cubie.userData));
}
