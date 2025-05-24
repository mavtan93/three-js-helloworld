import * as THREE from "three";

// Layer rotation logic
// TODO: this lock is not working properly
let isRotating = false;

// TODO:create a constructor for rubicks cube and scene

export function createCubie(x, y, z, cubeSize, gap, colors) {
  const cubie = new THREE.Group();
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const materials = [
    new THREE.MeshBasicMaterial({ color: colors.black }), // -X
    new THREE.MeshBasicMaterial({ color: colors.black }), // +X
    new THREE.MeshBasicMaterial({ color: colors.black }), // -Y
    new THREE.MeshBasicMaterial({ color: colors.black }), // +Y
    new THREE.MeshBasicMaterial({ color: colors.black }), // -Z
    new THREE.MeshBasicMaterial({ color: colors.black }), // +Z
  ];
  if (x === 1) {
    materials[0] = new THREE.MeshBasicMaterial({ color: colors.orange });
  }
  if (x === -1) {
    materials[1] = new THREE.MeshBasicMaterial({ color: colors.red });
  }
  if (y === 1) {
    materials[2] = new THREE.MeshBasicMaterial({ color: colors.yellow });
  }
  if (y === -1) {
    materials[3] = new THREE.MeshBasicMaterial({ color: colors.white });
  }
  if (z === 1) {
    materials[4] = new THREE.MeshBasicMaterial({ color: colors.blue });
  }
  if (z === -1) {
    materials[5] = new THREE.MeshBasicMaterial({ color: colors.green });
  }

  const mesh = new THREE.Mesh(geometry, materials);
  cubie.add(mesh);
  cubie.position.set(
    x * (cubeSize + gap),
    y * (cubeSize + gap),
    z * (cubeSize + gap),
  );
  cubie.userData = { x, y, z }; // Store original grid position

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

// Keyboard controls
export function setupKeyboardControls(rubiksCube, scene) {
  document.addEventListener("keydown", (e) => {
    if (isRotating) return;
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
  });
}

export function rotateLayer(axis, layer, direction, rubiksCube, scene) {
  const rotationSpeed = Math.PI / 20; // 9 degrees per frame
  console.log(`Rotating ${axis} layer ${layer} in direction ${direction}`);
  if (isRotating) return;
  isRotating = true;

  // 1. Collect cubies in the layer
  const layerCubies = rubiksCube.children.filter(
    (cubie) => cubie.userData[axis] === layer,
  );

  // 2. Create a temporary group and add cubies
  const tempGroup = new THREE.Group();
  layerCubies.forEach((cubie) => {
    // Convert to world position, attach to tempGroup
    tempGroup.attach(cubie);
  });
  scene.add(tempGroup);

  // 3. Animate rotation of tempGroup
  let currentRotation = 0;

  // TODO: should change this to more meaningful constant name
  // e.g. clockwise, counterclockwise
  const targetRotation = (Math.PI / 2) * direction;
  function rotationLoop() {
    const step = Math.min(
      rotationSpeed,
      Math.abs(targetRotation - currentRotation),
    );
    currentRotation += step;
    tempGroup.rotation[axis] = direction * currentRotation;
    if (currentRotation < Math.abs(targetRotation)) {
      requestAnimationFrame(rotationLoop);
    } else {
      // 4. Detach cubies back to rubiksCube and reset tempGroup
      layerCubies.forEach((cubie) => {
        rubiksCube.attach(cubie);
      });
      scene.remove(tempGroup);
      updateCubiePositions(axis, layer, direction, rubiksCube);
    }
  }
  rotationLoop();
  isRotating = false;
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
