import * as THREE from 'three';

export interface IslandMaterials {
  grass: THREE.MeshStandardMaterial;
  darkGrass: THREE.MeshStandardMaterial;
  plazaStone: THREE.MeshStandardMaterial;
  plazaLine: THREE.MeshStandardMaterial;
  road: THREE.MeshStandardMaterial;
  roadMarking: THREE.MeshStandardMaterial;
  yellowAccent: THREE.MeshStandardMaterial;
  orangeAccent: THREE.MeshStandardMaterial;
  metalRail: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  emissiveGlow: THREE.MeshStandardMaterial;
  statueWhite: THREE.MeshStandardMaterial;
  statueYellow: THREE.MeshStandardMaterial;
  blush: THREE.MeshStandardMaterial;
  darkFace: THREE.MeshStandardMaterial;
  buildingWhite: THREE.MeshStandardMaterial;
  buildingOrange: THREE.MeshStandardMaterial;
  foliage: THREE.MeshStandardMaterial;
  trunk: THREE.MeshStandardMaterial;
  stoneEdge: THREE.MeshStandardMaterial;
  cliff: THREE.MeshStandardMaterial;
}

export function createIslandMaterials(): IslandMaterials {
  return {
    grass: standard(0x55e878, 0.58),
    darkGrass: standard(0x25b957, 0.68),
    plazaStone: standard(0xd9deea, 0.54, 0.02),
    plazaLine: standard(0xffffff, 0.45),
    road: standard(0x506170, 0.66, 0.02),
    roadMarking: standard(0xfff2a8, 0.5),
    yellowAccent: standard(0xffd65a, 0.45, 0.02),
    orangeAccent: standard(0xff8b3f, 0.48, 0.03),
    metalRail: standard(0xd8e4ee, 0.38, 0.22),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x85e7ff,
      roughness: 0.18,
      metalness: 0.02,
      transmission: 0.12,
      transparent: true,
      opacity: 0.72,
    }),
    emissiveGlow: new THREE.MeshStandardMaterial({
      color: 0x6ef7ff,
      roughness: 0.36,
      metalness: 0.03,
      emissive: new THREE.Color(0x29dfff),
      emissiveIntensity: 1.35,
    }),
    statueWhite: standard(0xfffbef, 0.42),
    statueYellow: standard(0xffce3e, 0.36, 0.02),
    blush: standard(0xff8ca0, 0.5),
    darkFace: standard(0x202338, 0.42),
    buildingWhite: standard(0xf9f8ed, 0.44, 0.03),
    buildingOrange: standard(0xff8846, 0.42, 0.04),
    foliage: standard(0x2fc764, 0.64),
    trunk: standard(0x9c6636, 0.72),
    stoneEdge: standard(0x9ca0a2, 0.72, 0.02),
    cliff: standard(0xc58f55, 0.78),
  };
}

export function applyShadows(object: THREE.Object3D): THREE.Object3D {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return object;
}

function standard(color: number, roughness: number, metalness = 0): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
  });
}
