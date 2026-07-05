import * as THREE from 'three';
import { applyShadows, createIslandMaterials } from './materials';

export interface IslandBase {
  group: THREE.Group;
}

export function createIslandBase(): IslandBase {
  const materials = createIslandMaterials();
  const group = new THREE.Group();
  group.name = 'FloatingEggyIsland';
  group.userData.kind = 'island';

  const lowerCliff = new THREE.Mesh(
    new THREE.CylinderGeometry(5.95, 4.2, 1.35, 128),
    materials.cliff,
  );
  lowerCliff.name = 'IslandLayeredCliff';
  lowerCliff.position.y = -0.22;
  group.add(lowerCliff);

  const upperLip = new THREE.Mesh(
    new THREE.CylinderGeometry(6.15, 5.92, 0.32, 128),
    materials.darkGrass,
  );
  upperLip.name = 'IslandGreenBeveledRim';
  upperLip.position.y = 0.55;
  group.add(upperLip);

  const road = new THREE.Mesh(new THREE.RingGeometry(3.95, 5.18, 128), materials.road);
  road.name = 'OuterLobbyRoad';
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.73;
  road.userData.kind = 'road';
  group.add(road);

  const grass = new THREE.Mesh(new THREE.RingGeometry(2.28, 3.78, 96), materials.grass);
  grass.name = 'SegmentedGardenBelt';
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = 0.755;
  group.add(grass);

  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(2.28, 2.34, 0.16, 96),
    materials.plazaStone,
  );
  plaza.name = 'CentralStonePlaza';
  plaza.position.y = 0.82;
  group.add(plaza);

  const plazaRings = [0.88, 1.55, 2.22];
  for (const radius of plazaRings) {
    const line = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.014, 8, 96), materials.plazaLine);
    line.name = 'PlazaTileRing';
    line.rotation.x = Math.PI / 2;
    line.position.y = 0.915;
    group.add(line);
  }

  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * Math.PI * 2;
    const separator = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 2.2), materials.plazaLine);
    separator.name = 'PlazaRadialLine';
    separator.position.set(Math.cos(angle) * 1.1, 0.925, Math.sin(angle) * 1.1);
    separator.rotation.y = -angle;
    group.add(separator);
  }

  const curbOuter = new THREE.Mesh(new THREE.TorusGeometry(5.18, 0.055, 10, 128), materials.yellowAccent);
  curbOuter.name = 'OuterYellowCurb';
  curbOuter.rotation.x = Math.PI / 2;
  curbOuter.position.y = 0.82;
  group.add(curbOuter);

  const curbInner = new THREE.Mesh(new THREE.TorusGeometry(3.95, 0.04, 10, 128), materials.yellowAccent);
  curbInner.name = 'InnerYellowCurb';
  curbInner.rotation.x = Math.PI / 2;
  curbInner.position.y = 0.83;
  group.add(curbInner);

  const stair = createFrontSteps(materials);
  group.add(stair);

  const railBases = createRailBases(materials);
  group.add(railBases);

  const gardens = createGardenPatches(materials);
  group.add(gardens);

  const shoreStones = createStoneRing(materials);
  group.add(shoreStones);

  applyShadows(group);
  return { group };
}

function createFrontSteps(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'FrontPlazaSteps';
  group.userData.kind = 'island-detail';

  for (let i = 0; i < 3; i += 1) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.8 + i * 0.34, 0.09, 0.28), materials.plazaStone);
    step.name = 'LobbyStep';
    step.position.set(0, 0.88 - i * 0.08, 3.2 + i * 0.22);
    group.add(step);
  }

  return group;
}

function createRailBases(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'LobbyRailBaseRing';
  group.userData.kind = 'island-detail';

  for (let i = 0; i < 20; i += 1) {
    if (i > 8 && i < 12) {
      continue;
    }
    const angle = (i / 20) * Math.PI * 2;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.16, 12), materials.stoneEdge);
    base.name = 'RailBase';
    base.position.set(Math.cos(angle) * 5.35, 0.9, Math.sin(angle) * 5.35);
    group.add(base);
  }

  return group;
}

function createGardenPatches(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'GardenPatchGroup';
  group.userData.kind = 'foliage';

  for (const [x, z, sx, sz] of [
    [-3.2, -1.1, 1.3, 0.72],
    [3.25, 1.2, 1.2, 0.68],
    [-2.15, 2.1, 0.95, 0.55],
    [2.3, -2.0, 1.05, 0.62],
  ] as const) {
    const patch = new THREE.Mesh(new THREE.CircleGeometry(0.62, 32), materials.darkGrass);
    patch.name = 'GardenPatch';
    patch.position.set(x, 0.94, z);
    patch.rotation.x = -Math.PI / 2;
    patch.scale.set(sx, sz, 1);
    group.add(patch);
  }

  return group;
}

function createStoneRing(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'StoneRing';
  group.userData.kind = 'island-detail';

  for (let i = 0; i < 28; i += 1) {
    const angle = (i / 28) * Math.PI * 2;
    const radius = 5.72 + Math.sin(i * 1.7) * 0.1;
    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.13 + (i % 3) * 0.018), materials.stoneEdge);
    stone.name = 'ShoreStone';
    stone.position.set(Math.cos(angle) * radius, 0.82, Math.sin(angle) * radius);
    stone.rotation.set(Math.sin(i) * 0.4, angle, Math.cos(i) * 0.5);
    group.add(stone);
  }

  return group;
}
