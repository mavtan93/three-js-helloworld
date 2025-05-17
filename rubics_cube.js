import * as THREE from 'three';

function createScene() {
    return new THREE.Scene();
}

function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    return camera;
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
}

function createLights() {
    const group = new THREE.Group();
    group.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1);
    group.add(dirLight);
    return group;
}

function createCubie(x, y, z, cubeSize, gap, colors) {
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const materials = [
        new THREE.MeshBasicMaterial({ color: colors.black }), // -X
        new THREE.MeshBasicMaterial({ color: colors.black }), // +X
        new THREE.MeshBasicMaterial({ color: colors.black }), // -Y
        new THREE.MeshBasicMaterial({ color: colors.black }), // +Y
        new THREE.MeshBasicMaterial({ color: colors.black }), // -Z
        new THREE.MeshBasicMaterial({ color: colors.black }), // +Z
    ];
    if (x === 1) materials[0] = new THREE.MeshBasicMaterial({ color: colors.orange });
    if (x === -1) materials[1] = new THREE.MeshBasicMaterial({ color: colors.red });
    if (y === 1) materials[2] = new THREE.MeshBasicMaterial({ color: colors.yellow });
    if (y === -1) materials[3] = new THREE.MeshBasicMaterial({ color: colors.white });
    if (z === 1) materials[4] = new THREE.MeshBasicMaterial({ color: colors.blue });
    if (z === -1) materials[5] = new THREE.MeshBasicMaterial({ color: colors.green });

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set(x * (cubeSize + gap), y * (cubeSize + gap), z * (cubeSize + gap));
    return mesh;
}

function createRubiksCube(cubeSize, gap, colors) {
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