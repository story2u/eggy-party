import * as THREE from 'three';
import { applyShadows, createIslandMaterials } from './materials';

export function createRocketHub(): THREE.Group {
  const materials = createIslandMaterials();
  const group = new THREE.Group();
  group.name = 'RocketHub';
  group.userData.kind = 'landmark';
  group.position.set(3.28, 0.94, -1.72);
  group.rotation.y = -0.32;

  const platform = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 1.02, 0.18, 48), materials.plazaStone);
  platform.name = 'RocketLaunchPlatform';
  platform.position.y = 0.08;
  group.add(platform);

  const rocket = new THREE.Group();
  rocket.name = 'RocketTowerBody';
  rocket.position.y = 0.26;
  group.add(rocket);

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 1.38, 16, 32), materials.buildingWhite);
  body.name = 'RocketWhiteHull';
  body.position.y = 0.92;
  rocket.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.52, 32), materials.buildingOrange);
  nose.name = 'RocketOrangeNose';
  nose.position.y = 1.88;
  rocket.add(nose);

  for (const angle of [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.2), materials.buildingOrange);
    fin.name = 'RocketFin';
    fin.position.set(Math.cos(angle) * 0.3, 0.42, Math.sin(angle) * 0.3);
    fin.rotation.y = -angle;
    rocket.add(fin);
  }

  const window = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), materials.glass);
  window.name = 'RocketGlassWindow';
  window.position.set(0, 1.22, 0.26);
  window.scale.z = 0.22;
  rocket.add(window);

  for (let i = 0; i < 4; i += 1) {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.025), materials.emissiveGlow.clone());
    light.name = 'RocketGlowArrow';
    light.userData.kind = 'rocket-light';
    light.userData.phase = i * 0.45;
    light.position.set(-0.31, 0.58 + i * 0.23, 0.05);
    rocket.add(light);
  }

  const rail = createRocketRail(materials);
  group.add(rail);

  for (const [x, z] of [
    [-0.72, 0.58],
    [0.78, 0.44],
    [0.66, -0.58],
  ] as const) {
    const device = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.34, 18), materials.metalRail);
    device.name = 'RocketSupportDevice';
    device.position.set(x, 0.28, z);
    group.add(device);
  }

  applyShadows(group);
  return group;
}

function createRocketRail(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'RocketMetalRail';
  group.userData.kind = 'rail';

  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.38, 8), materials.metalRail);
    post.name = 'RocketRailPost';
    post.position.set(Math.cos(angle) * 1.08, 0.34, Math.sin(angle) * 1.08);
    group.add(post);
  }

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.018, 8, 64), materials.metalRail);
  ring.name = 'RocketRailRing';
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.52;
  group.add(ring);

  return group;
}
