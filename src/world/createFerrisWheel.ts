import * as THREE from 'three';
import { applyShadows, createIslandMaterials } from './materials';

export interface FerrisWheelRig {
  group: THREE.Group;
  wheel: THREE.Group;
  cabins: THREE.Group[];
}

export function createFerrisWheel(): FerrisWheelRig {
  const materials = createIslandMaterials();
  const group = new THREE.Group();
  group.name = 'FerrisWheel';
  group.userData.kind = 'landmark';
  group.position.set(-4.1, 1.02, -2.1);
  group.rotation.y = Math.PI * 0.18;
  group.scale.setScalar(0.92);

  const wheel = new THREE.Group();
  wheel.name = 'FerrisWheelRotatingWheel';
  wheel.userData.kind = 'animated-wheel';
  wheel.position.y = 1.95;
  group.add(wheel);

  for (const [radius, color] of [
    [1.18, 0xffd65a],
    [0.95, 0xff77a8],
    [0.72, 0x62d7ff],
  ] as const) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.026, 10, 96),
      new THREE.MeshStandardMaterial({ color, roughness: 0.44, metalness: 0.04 }),
    );
    ring.name = 'FerrisWheelColorRing';
    wheel.add(ring);
  }

  const spokeMaterial = materials.metalRail;
  for (let i = 0; i < 12; i += 1) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.95, 0.035), spokeMaterial);
    spoke.name = 'FerrisWheelSpoke';
    spoke.rotation.z = (i / 12) * Math.PI;
    wheel.add(spoke);
  }

  const cabins: THREE.Group[] = [];
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const cabin = createCabin(i, materials);
    cabin.position.set(Math.cos(angle) * 1.18, Math.sin(angle) * 1.18, 0);
    cabin.userData.baseAngle = angle;
    wheel.add(cabin);
    cabins.push(cabin);
  }

  const supportMaterial = materials.metalRail;
  for (const side of [-1, 1] as const) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 2.25, 12), supportMaterial);
    leg.name = 'FerrisWheelSupport';
    leg.position.set(side * 0.44, 0.9, -0.04);
    leg.rotation.z = side * -0.28;
    group.add(leg);
  }

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.18, 0.62), materials.plazaStone);
  base.name = 'FerrisWheelBase';
  base.position.y = -0.08;
  group.add(base);

  applyShadows(group);
  return { group, wheel, cabins };
}

function createCabin(index: number, materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const cabin = new THREE.Group();
  cabin.name = 'FerrisWheelCabin';
  cabin.userData.kind = 'ride-cabin';

  const colors = [0xff7aa8, 0x65c7ff, 0xffd65a, 0x62d982] as const;
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.18, 0.2),
    new THREE.MeshStandardMaterial({ color: colors[index % colors.length], roughness: 0.46 }),
  );
  body.name = 'CabinBody';
  body.position.y = -0.08;
  cabin.add(body);

  const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8), materials.metalRail);
  hanger.name = 'CabinHanger';
  hanger.position.y = 0.08;
  cabin.add(hanger);

  return cabin;
}
