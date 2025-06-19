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

// An axis object to visualize the 3 axes in a simple way.
// The X axis is red. The Y axis is green. The Z axis is blue.
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// The XY plane is defined by the equation z = 0, which is a horizontal plane
const XYplane = new THREE.Plane( new THREE.Vector3( 0, 0, -5 ), 3 );
const XYplanehelper = new THREE.PlaneHelper( XYplane, 5, 0x0000ff );
scene.add( XYplanehelper );

// The XZ plane is defined by the equation y = 0, which is a horizontal plane
const XZplane = new THREE.Plane( new THREE.Vector3( 0, -5, 0 ), 3 );
const XZplanehelper = new THREE.PlaneHelper( XZplane, 5, 0xffff00 );
scene.add( XZplanehelper );

// The YZ plane is defined by the equation x = 0, which is a vertical plane
const YZplane = new THREE.Plane( new THREE.Vector3( -5, 0, 0 ), 3 );
const YZplanehelper = new THREE.PlaneHelper( YZplane, 5, 0xff0000 );
scene.add( YZplanehelper );

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
