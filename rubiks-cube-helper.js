import * as THREE from 'three';

export function createCubie(x, y, z, cubeSize, gap, colors) {
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