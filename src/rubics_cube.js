import * as THREE from "three";

import {
  createCamera,
  createRenderer,
  createLights,
  createControls,
} from "./three-js-helper.js";

import {
  createRubiksCube,
  setupKeyboardControls,
} from "./rubiks-cube-helper.js";

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
  black: 0x000000,
};
const cubeSize = 1;
const gap = 0.05;

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const controls = createControls(camera, renderer);
const rubiksCube = createRubiksCube(cubeSize, gap, colors);

scene.add(createLights());
scene.add(rubiksCube);

document.body.appendChild(renderer.domElement);
setupKeyboardControls(rubiksCube, scene);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
