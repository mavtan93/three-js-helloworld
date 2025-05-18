import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


import { createCamera } from './three-js-helper.js';
import { createRenderer } from './three-js-helper.js';
import { createLights } from './three-js-helper.js';

import { createRubiksCube } from './rubiks-cube-helper.js';

function createScene() {
    return new THREE.Scene();
}

// Main function to set up the scene
// and start the animation loop
const colors = {
    white: 0xffffff,
    yellow: 0xffff00,
    red: 0xff0000,
    orange: 0xff8800,
    blue: 0x0000ff,
    green: 0x00ff00,
    black: 0x000000
};
const cubeSize = 1;
const gap = 0.05;

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
document.body.appendChild(renderer.domElement);

scene.add(createLights());
const rubiksCube = createRubiksCube(cubeSize, gap, colors);
scene.add(rubiksCube);



        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

// Layer rotation logic
let isRotating = false;
const rotationSpeed = Math.PI / 20; // 9 degrees per frame

function rotateLayer(axis, layer, direction, cubies) {
    console.log(`Rotating ${axis} layer ${layer} in direction ${direction}`);
    if (isRotating) return;
    isRotating = true;

    const targetRotation = Math.PI / 2 * direction; // 90 degrees
    let currentRotation = 0;

    const rotationLoop = () => {
        if (currentRotation >= Math.abs(targetRotation)) {
            isRotating = false;
            updateCubiePositions(axis, layer, direction, cubies);
            return;
        }

        const step = Math.min(rotationSpeed, Math.abs(targetRotation - currentRotation));
        currentRotation += step;

        cubies.children.forEach(cubie => {
            const pos = cubie.userData;
            if (pos[axis] === layer) {
                switch (axis) {
                    case 'x': cubie.rotation.y += direction * step; break;
                    case 'y': cubie.rotation.x += direction * step; break;
                    case 'z': cubie.rotation.z += direction * step; break;
                }
            }
        });

        requestAnimationFrame(rotationLoop);
    };

    rotationLoop();
}

// Update cubie positions after rotation
function updateCubiePositions(axis, layer, direction, cubies) {
    // Update the userData of each cubie to reflect the new position
    console.log('Updating cubie positions');
    console.log(cubies.children.map(cubie => cubie.userData));
    
    cubies.children.forEach(cubie => {
        const pos = cubie.userData;
        if (pos[axis] === layer) {
            let { x, y, z } = pos;
            switch (axis) {
                case 'x': // Rotate around X-axis (left/right layers)
                    [y, z] = direction === 1 ? [-z, y] : [z, -y];
                    break;
                case 'y': // Rotate around Y-axis (top/bottom layers)
                    [x, z] = direction === 1 ? [z, -x] : [-z, x];
                    break;
                case 'z': // Rotate around Z-axis (front/back layers)
                    [x, y] = direction === 1 ? [-y, x] : [y, -x];
                    break;
            }
            cubie.userData = { x, y, z };
        }
    });

    console.log('Cubie positions updated');
    console.log(cubies.children.map(cubie => cubie.userData));
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (isRotating) return;
    switch (e.key) {
        // Front/Back layers (Z-axis)
        case 'f': rotateLayer('z', 1, 1, rubiksCube); break;  // Front layer clockwise
        case 'F': rotateLayer('z', 1, -1, rubiksCube); break; // Front layer counter-clockwise
        case 'b': rotateLayer('z', -1, 1, rubiksCube); break; // Back layer clockwise
        case 'B': rotateLayer('z', -1, -1, rubiksCube); break;

        // Left/Right layers (X-axis)
        case 'l': rotateLayer('x', -1, 1, rubiksCube); break; // Left layer clockwise
        case 'L': rotateLayer('x', -1, -1, rubiksCube); break;
        case 'r': rotateLayer('x', 1, 1, rubiksCube); break;  // Right layer clockwise
        case 'R': rotateLayer('x', 1, -1, rubiksCube); break;

        // Top/Bottom layers (Y-axis)
        case 'u': rotateLayer('y', 1, 1, rubiksCube); break;   // Top layer clockwise
        case 'U': rotateLayer('y', 1, -1, rubiksCube); break;
        case 'd': rotateLayer('y', -1, 1, rubiksCube); break;  // Bottom layer clockwise
        case 'D': rotateLayer('y', -1, -1, rubiksCube); break;
    }
});


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();