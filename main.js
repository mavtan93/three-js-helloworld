import * as THREE from 'three';

const scene = new THREE.Scene();

// there are different cameras in three.s, this is using PerspectiveCamera
// which is a camera that mimics the way the human eye sees
// the first parameter is the field of view, the second is the aspect ratio
// the third and fourth parameters are the near and far clipping planes
// the near clipping plane is the closest distance to the camera that will be rendered
// the far clipping plane is the farthest distance to the camera that will be rendered
// the default values are 75, window.innerWidth / window.innerHeight, 0.1, 1000
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );

}