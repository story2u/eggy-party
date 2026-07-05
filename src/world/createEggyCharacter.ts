import * as THREE from 'three';
import { applyShadows, createIslandMaterials } from './materials';

interface EggyOptions {
  name: string;
  color: number;
  position: THREE.Vector3;
  scale?: number;
  accessory?: 'backpack' | 'visor' | 'belt';
  accentColor?: number;
}

export function createEggyCharacter({
  name,
  color,
  position,
  scale = 1,
  accessory = 'belt',
  accentColor = 0xffffff,
}: EggyOptions): THREE.Group {
  const materials = createIslandMaterials();
  const group = new THREE.Group();
  group.name = name;
  group.userData.kind = 'eggy-character';
  group.position.copy(position);
  group.scale.setScalar(scale);

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.38,
    metalness: 0.02,
  });
  const accent = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.42, metalness: 0.02 });

  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.48, 40, 32), bodyMaterial);
  shell.name = 'EggyBody';
  shell.scale.set(0.86, 1.16, 0.82);
  group.add(shell);

  addFace(group, materials);
  addLimbs(group, materials);
  addAccessory(group, accessory, accent, materials);

  applyShadows(group);
  return group;
}

function addFace(group: THREE.Group, materials: ReturnType<typeof createIslandMaterials>): void {
  const faceMaterial = materials.statueWhite;
  const pupilMaterial = materials.darkFace;
  for (const x of [-0.17, 0.17]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.082, 18, 12), faceMaterial);
    eye.name = 'EggyEye';
    eye.position.set(x, 0.14, 0.39);
    eye.scale.z = 0.35;
    group.add(eye);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), pupilMaterial);
    pupil.name = 'EggyPupil';
    pupil.position.set(x + 0.014, 0.13, 0.425);
    pupil.scale.z = 0.28;
    group.add(pupil);
  }

  for (const x of [-0.31, 0.31]) {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), materials.blush);
    cheek.name = 'EggyCheek';
    cheek.position.set(x, -0.05, 0.38);
    cheek.scale.set(1.25, 0.72, 0.22);
    group.add(cheek);
  }
}

function addLimbs(group: THREE.Group, materials: ReturnType<typeof createIslandMaterials>): void {
  for (const side of [-1, 1] as const) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.28, 6, 12), materials.statueWhite);
    arm.name = 'EggyArm';
    arm.position.set(side * 0.43, -0.04, 0.1);
    arm.rotation.z = side * -0.56;
    group.add(arm);

    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 12), materials.statueWhite);
    foot.name = 'EggyFoot';
    foot.position.set(side * 0.23, -0.52, 0.1);
    foot.scale.set(1.2, 0.42, 0.78);
    group.add(foot);
  }
}

function addAccessory(
  group: THREE.Group,
  accessory: EggyOptions['accessory'],
  accent: THREE.Material,
  materials: ReturnType<typeof createIslandMaterials>,
): void {
  if (accessory === 'backpack') {
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.4, 0.16), accent);
    pack.name = 'EggyBackpack';
    pack.position.set(0, -0.02, -0.42);
    group.add(pack);
    return;
  }

  if (accessory === 'visor') {
    const visor = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.025, 8, 36, Math.PI), materials.glass);
    visor.name = 'EggyVisor';
    visor.position.set(0, 0.24, 0.41);
    visor.rotation.z = Math.PI;
    group.add(visor);
    return;
  }

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.025, 8, 36), accent);
  belt.name = 'EggyBelt';
  belt.position.y = -0.2;
  belt.rotation.x = Math.PI / 2;
  group.add(belt);
}
