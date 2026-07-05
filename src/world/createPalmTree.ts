import * as THREE from 'three';

export function createPalmTree(x: number, y: number, z: number, scale = 1): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PalmTree';
  group.userData.kind = 'foliage';
  group.position.set(x, y, z);
  group.scale.setScalar(scale);

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.13, 0.9, 12),
    new THREE.MeshStandardMaterial({ color: 0x9b6a3d, roughness: 0.82 }),
  );
  trunk.name = 'PalmTrunk';
  trunk.position.y = 0.42;
  trunk.rotation.z = 0.12;
  trunk.castShadow = true;
  group.add(trunk);

  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x2f9d58, roughness: 0.7 });
  for (let i = 0; i < 7; i += 1) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.78, 8), leafMaterial);
    leaf.name = 'PalmLeaf';
    const angle = (i / 7) * Math.PI * 2;
    leaf.position.set(Math.cos(angle) * 0.23, 0.96, Math.sin(angle) * 0.23);
    leaf.rotation.set(Math.PI * 0.54, 0, -angle);
    leaf.scale.set(0.7, 1, 0.32);
    leaf.castShadow = true;
    group.add(leaf);
  }

  return group;
}
