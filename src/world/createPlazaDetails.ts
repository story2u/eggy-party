import * as THREE from 'three';
import { applyShadows, createIslandMaterials } from './materials';

export function createPlazaDetails(): THREE.Group {
  const materials = createIslandMaterials();
  const group = new THREE.Group();
  group.name = 'PlazaDetails';
  group.userData.kind = 'plaza-detail';

  group.add(createCrosswalks(materials));
  group.add(createGuardRails(materials));
  group.add(createLampPosts(materials));
  group.add(createTrafficCones(materials));
  group.add(createDecorCrates(materials));
  group.add(createPlanters(materials));
  group.add(createGlowPickups(materials));

  applyShadows(group);
  return group;
}

function createCrosswalks(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'RoadCrosswalks';

  for (const angle of [Math.PI * 0.25, Math.PI * 1.25]) {
    const crosswalk = new THREE.Group();
    crosswalk.name = 'Crosswalk';
    crosswalk.rotation.y = angle;
    crosswalk.position.set(Math.cos(angle) * 4.56, 0.95, Math.sin(angle) * 4.56);

    for (let i = -2; i <= 2; i += 1) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.018, 0.62), materials.roadMarking);
      stripe.name = 'CrosswalkStripe';
      stripe.position.x = i * 0.16;
      crosswalk.add(stripe);
    }
    group.add(crosswalk);
  }

  return group;
}

function createGuardRails(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'YellowGuardRails';

  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI * 0.85 + i * 0.18;
    const rail = new THREE.Group();
    rail.name = 'GuardRailSegment';
    rail.userData.kind = 'rail';
    rail.position.set(Math.cos(angle) * 5.25, 1.04, Math.sin(angle) * 5.25);
    rail.rotation.y = -angle + Math.PI / 2;

    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.055, 0.055), materials.yellowAccent);
    bar.name = 'GuardRailBar';
    rail.add(bar);
    for (const x of [-0.16, 0.16]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.28, 8), materials.orangeAccent);
      post.name = 'GuardRailPost';
      post.position.set(x, -0.14, 0);
      rail.add(post);
    }
    group.add(rail);
  }

  return group;
}

function createLampPosts(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'LobbyLampPosts';

  for (const angle of [0.72, 2.42, 3.95, 5.46]) {
    const lamp = new THREE.Group();
    lamp.name = 'LampPost';
    lamp.userData.kind = 'light-prop';
    lamp.position.set(Math.cos(angle) * 3.34, 0.94, Math.sin(angle) * 3.34);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.82, 12), materials.metalRail);
    pole.name = 'LampPole';
    pole.position.y = 0.38;
    lamp.add(pole);

    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 12), materials.emissiveGlow.clone());
    orb.name = 'LampGlow';
    orb.position.y = 0.86;
    lamp.add(orb);
    group.add(lamp);
  }

  return group;
}

function createTrafficCones(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'TrafficConeCluster';

  for (const [x, z] of [
    [-3.25, 1.15],
    [-3.55, 1.42],
    [2.92, 2.08],
    [3.24, 2.33],
  ] as const) {
    const cone = new THREE.Group();
    cone.name = 'TrafficCone';
    cone.userData.kind = 'safety-prop';
    cone.position.set(x, 0.96, z);

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 18), materials.orangeAccent);
    body.name = 'ConeBody';
    body.position.y = 0.14;
    cone.add(body);

    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 6, 18), materials.statueWhite);
    stripe.name = 'ConeWhiteStripe';
    stripe.rotation.x = Math.PI / 2;
    stripe.position.y = 0.15;
    cone.add(stripe);

    group.add(cone);
  }

  return group;
}

function createDecorCrates(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'DecorCrates';

  for (const [x, z, color] of [
    [2.2, 2.72, materials.yellowAccent],
    [2.52, 2.55, materials.glass],
    [-2.4, -2.72, materials.orangeAccent],
  ] as const) {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.28), color);
    crate.name = 'DecorBox';
    crate.userData.kind = 'decor-prop';
    crate.position.set(x, 1.05, z);
    crate.rotation.y = x;
    group.add(crate);
  }

  return group;
}

function createPlanters(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PlanterBeds';
  group.userData.kind = 'foliage';

  for (const [x, z] of [
    [-3.1, -0.9],
    [3.0, 1.05],
    [1.85, -2.45],
  ] as const) {
    const planter = new THREE.Group();
    planter.name = 'FlowerPlanter';
    planter.position.set(x, 0.98, z);

    const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.14, 24), materials.plazaStone);
    tub.name = 'PlanterTub';
    planter.add(tub);

    for (let i = 0; i < 5; i += 1) {
      const shrub = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 8), materials.foliage);
      shrub.name = 'PlanterShrub';
      const angle = (i / 5) * Math.PI * 2;
      shrub.position.set(Math.cos(angle) * 0.18, 0.14, Math.sin(angle) * 0.18);
      planter.add(shrub);
    }

    group.add(planter);
  }

  return group;
}

function createGlowPickups(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PlazaGlowPickups';

  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2 + 0.22;
    const pickup = new THREE.Mesh(new THREE.IcosahedronGeometry(0.105), materials.emissiveGlow.clone());
    pickup.name = 'GlowPickup';
    pickup.userData.kind = 'pickup';
    pickup.userData.baseY = 1.16;
    pickup.userData.phase = i * 0.9;
    pickup.position.set(Math.cos(angle) * 2.74, 1.16, Math.sin(angle) * 2.74);
    group.add(pickup);
  }

  return group;
}
