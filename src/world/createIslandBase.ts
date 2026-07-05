import * as THREE from 'three';

export interface IslandBase {
  group: THREE.Group;
}

export function createIslandBase(): IslandBase {
  const group = new THREE.Group();
  group.name = 'FloatingEggyIsland';
  group.userData.kind = 'island';

  const side = new THREE.Mesh(
    new THREE.CylinderGeometry(4.7, 3.05, 1.28, 80),
    new THREE.MeshStandardMaterial({ color: 0xd9a35f, roughness: 0.88 }),
  );
  side.name = 'IslandCliff';
  side.position.y = -0.12;
  side.castShadow = true;
  side.receiveShadow = true;
  group.add(side);

  const grass = new THREE.Mesh(
    new THREE.CylinderGeometry(4.72, 4.72, 0.2, 80),
    new THREE.MeshStandardMaterial({ color: 0x4fc36f, roughness: 0.82 }),
  );
  grass.name = 'IslandGrassTop';
  grass.position.y = 0.62;
  grass.castShadow = true;
  grass.receiveShadow = true;
  group.add(grass);

  const beach = new THREE.Mesh(
    new THREE.TorusGeometry(4.04, 0.16, 12, 96),
    new THREE.MeshStandardMaterial({ color: 0xffd98b, roughness: 0.86 }),
  );
  beach.name = 'IslandBeachRing';
  beach.rotation.x = Math.PI / 2;
  beach.position.y = 0.75;
  beach.receiveShadow = true;
  group.add(beach);

  const stones = createStoneRing();
  group.add(stones);

  return { group };
}

function createStoneRing(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'StoneRing';
  group.userData.kind = 'island-detail';
  const material = new THREE.MeshStandardMaterial({ color: 0x8e8c83, roughness: 0.9 });

  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * Math.PI * 2;
    const radius = 4.28 + Math.sin(i * 1.7) * 0.08;
    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 + (i % 3) * 0.025), material);
    stone.name = 'ShoreStone';
    stone.position.set(Math.cos(angle) * radius, 0.72, Math.sin(angle) * radius);
    stone.rotation.set(Math.sin(i) * 0.4, angle, Math.cos(i) * 0.5);
    stone.castShadow = true;
    group.add(stone);
  }

  return group;
}
