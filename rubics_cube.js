import * as THREE from 'three';

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

function animate() {
    requestAnimationFrame(animate);
    rubiksCube.rotation.x += 0.01;
    rubiksCube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();