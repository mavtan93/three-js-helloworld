import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera position
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Cube size and spacing
const cubeSize = 1;
const gap = 0.05; // Gap between cubies

// Colors for each face (standard Rubik's Cube colors)
const colors = {
    white: 0xffffff,
    yellow: 0xffff00,
    red: 0xff0000,
    orange: 0xff8800,
    blue: 0x0000ff,
    green: 0x00ff00,
    black: 0x000000 // For inner faces
};


// Build the full Rubik's Cube (3x3x3)
for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            const cubie = createCubie(x, y, z);
            scene.add(cubie);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    // roteate the entire cube for demonstration
    scene.rotation.x += 0.01;
    scene.rotation.y += 0.01;
    // controls.update(); // Required for OrbitControls damping
    renderer.render(scene, camera);
}

// Create a single cubie with colored faces
function createCubie(x, y, z) {
    const cubie = new THREE.Group();
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Materials for each face (default: black)
    const materials = [
        new THREE.MeshBasicMaterial({ color: colors.black }), // -X (left)
        new THREE.MeshBasicMaterial({ color: colors.black }), // +X (right)
        new THREE.MeshBasicMaterial({ color: colors.black }), // -Y (bottom)
        new THREE.MeshBasicMaterial({ color: colors.black }), // +Y (top)
        new THREE.MeshBasicMaterial({ color: colors.black }), // -Z (back)
        new THREE.MeshBasicMaterial({ color: colors.black }), // +Z (front)
    ];

    // Color visible faces based on position
    if (x === 1) materials[0] = new THREE.MeshBasicMaterial({ color: colors.orange }); // Left face (orange)
    if (x === -1) materials[1] = new THREE.MeshBasicMaterial({ color: colors.red });     // Right face (red)
    if (y === 1) materials[2] = new THREE.MeshBasicMaterial({ color: colors.yellow });  // Bottom face (yellow)
    if (y === -1) materials[3] = new THREE.MeshBasicMaterial({ color: colors.white });   // Top face (white)
    if (z === 1) materials[4] = new THREE.MeshBasicMaterial({ color: colors.blue });   // Back face (blue)
    if (z === -1) materials[5] = new THREE.MeshBasicMaterial({ color: colors.green });   // Front face (green)

    const mesh = new THREE.Mesh(geometry, materials);
    cubie.add(mesh);
    cubie.position.set(x * (cubeSize + gap), y * (cubeSize + gap), z * (cubeSize + gap));
    return cubie;
}

animate();