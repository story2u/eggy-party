import * as THREE from 'three';
import { applyShadows, createIslandMaterials } from './materials';

export function createCentralEggyStatue(): THREE.Group {
  const materials = createIslandMaterials();
  const group = new THREE.Group();
  group.name = 'CentralEggyStatue';
  group.userData.kind = 'landmark';
  group.position.set(0, 0.98, 0);

  const base = new THREE.Group();
  base.name = 'StatuePedestal';
  base.add(cylinder('PedestalLowerTier', 1.18, 1.34, 0.28, materials.plazaStone, 0.14));
  base.add(cylinder('PedestalGoldRing', 1.0, 1.04, 0.12, materials.yellowAccent, 0.36));
  base.add(cylinder('PedestalUpperTier', 0.78, 0.86, 0.26, materials.statueWhite, 0.56));
  group.add(base);

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 36), materials.statueYellow);
  body.name = 'StatueEggyBody';
  body.scale.set(0.88, 1.18, 0.82);
  body.position.y = 1.46;
  group.add(body);

  const shellCap = new THREE.Mesh(new THREE.SphereGeometry(0.73, 48, 20, 0, Math.PI * 2, 0, Math.PI * 0.45), materials.statueWhite);
  shellCap.name = 'StatueWhiteShellCap';
  shellCap.scale.set(0.9, 1.12, 0.83);
  shellCap.position.y = 1.65;
  group.add(shellCap);

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.045, 10, 64), materials.orangeAccent);
  belt.name = 'StatueOrangeBelt';
  belt.rotation.x = Math.PI / 2;
  belt.position.y = 1.18;
  group.add(belt);

  addFace(group, materials);
  addArmsAndFeet(group, materials);
  addGlowPickups(group, materials);

  applyShadows(group);
  return group;
}

function cylinder(
  name: string,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  material: THREE.Material,
  y: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 72), material);
  mesh.name = name;
  mesh.position.y = y;
  return mesh;
}

function addFace(group: THREE.Group, materials: ReturnType<typeof createIslandMaterials>): void {
  const eyeWhite = materials.statueWhite;
  const starMaterial = new THREE.MeshStandardMaterial({
    color: 0x42d9ff,
    roughness: 0.32,
    emissive: new THREE.Color(0x169bd8),
    emissiveIntensity: 0.35,
  });

  for (const x of [-0.24, 0.24]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 14), eyeWhite);
    eye.name = 'StatueEyeWhite';
    eye.position.set(x, 1.58, 0.58);
    eye.scale.z = 0.3;
    group.add(eye);

    const star = createStarMesh(starMaterial);
    star.name = 'StatueStarEye';
    star.position.set(x, 1.58, 0.615);
    star.scale.setScalar(0.105);
    group.add(star);
  }

  for (const x of [-0.43, 0.43]) {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 12), materials.blush);
    cheek.name = 'StatueCheek';
    cheek.position.set(x, 1.42, 0.55);
    cheek.scale.set(1.2, 0.72, 0.22);
    group.add(cheek);
  }

  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.012, 8, 28, Math.PI), materials.darkFace);
  mouth.name = 'StatueSmile';
  mouth.position.set(0, 1.36, 0.61);
  mouth.rotation.z = Math.PI;
  group.add(mouth);
}

function addArmsAndFeet(group: THREE.Group, materials: ReturnType<typeof createIslandMaterials>): void {
  for (const side of [-1, 1] as const) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.44, 8, 16), materials.statueWhite);
    arm.name = 'StatueArm';
    arm.position.set(side * 0.65, 1.3, 0.08);
    arm.rotation.z = side * -0.72;
    group.add(arm);

    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 12), materials.statueWhite);
    foot.name = 'StatueFoot';
    foot.position.set(side * 0.28, 0.86, 0.28);
    foot.scale.set(1.25, 0.42, 0.82);
    group.add(foot);
  }

  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.038, 10, 48), materials.glass);
  scarf.name = 'StatueGlassScarf';
  scarf.rotation.x = Math.PI / 2;
  scarf.position.y = 1.02;
  group.add(scarf);
}

function addGlowPickups(group: THREE.Group, materials: ReturnType<typeof createIslandMaterials>): void {
  for (let i = 0; i < 3; i += 1) {
    const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const pickup = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), materials.emissiveGlow.clone());
    pickup.name = 'GlowPickup';
    pickup.userData.kind = 'pickup';
    pickup.userData.baseY = 0.74;
    pickup.userData.phase = i * 1.7;
    pickup.position.set(Math.cos(angle) * 1.45, 0.74, Math.sin(angle) * 1.45);
    group.add(pickup);
  }
}

function createStarMesh(material: THREE.Material): THREE.Mesh {
  const shape = new THREE.Shape();
  const points = 10;
  for (let i = 0; i <= points; i += 1) {
    const angle = (i / points) * Math.PI * 2 + Math.PI / 2;
    const radius = i % 2 === 0 ? 1 : 0.45;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.04,
    bevelEnabled: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = -Math.PI / 2;
  return mesh;
}
