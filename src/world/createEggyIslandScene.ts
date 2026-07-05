import * as THREE from 'three';
import { createEggyCharacter } from './createEggyCharacter';
import { createIslandBase } from './createIslandBase';
import { createPalmTree } from './createPalmTree';

export interface EggyIslandScene {
  scene: THREE.Scene;
  cameraTarget: THREE.Vector3;
  update: (delta: number, elapsed: number) => void;
}

interface FloatingObject {
  object: THREE.Object3D;
  baseY: number;
  amplitude: number;
  speed: number;
  phase: number;
}

export function createEggyIslandScene(): EggyIslandScene {
  const scene = new THREE.Scene();
  scene.name = 'EggyIslandScene';
  scene.background = new THREE.Color(0x8ed7ff);
  scene.fog = new THREE.Fog(0x8ed7ff, 22, 46);
  addLighting(scene);

  const root = new THREE.Group();
  root.name = 'EggyIslandRoot';
  scene.add(root);

  const island = createIslandBase();
  root.add(island.group);

  const water = createWater();
  root.add(water);

  const plaza = createPlazaRing();
  root.add(plaza);

  const eggies = [
    createEggyCharacter({ name: 'EggyCaptain', color: 0xffcf4d, position: new THREE.Vector3(-1.2, 0.62, 0.55) }),
    createEggyCharacter({ name: 'EggyScout', color: 0xff7aa8, position: new THREE.Vector3(1.18, 0.55, -0.72), scale: 0.82 }),
    createEggyCharacter({ name: 'EggyRacer', color: 0x65c7ff, position: new THREE.Vector3(0.85, 0.5, 1.45), scale: 0.72 }),
  ];
  eggies.forEach((eggy) => root.add(eggy));

  const trees = [
    createPalmTree(-3.1, 0.52, -1.6, 0.9),
    createPalmTree(3.0, 0.52, 1.2, 0.78),
    createPalmTree(-2.0, 0.52, 2.35, 0.68),
  ];
  trees.forEach((tree) => root.add(tree));

  const clouds = createCloudRing();
  root.add(clouds);

  const dock = createDock();
  root.add(dock);

  const arch = createWelcomeArch();
  root.add(arch);

  const floaters: FloatingObject[] = [
    ...eggies.map((object, index) => ({
      object,
      baseY: object.position.y,
      amplitude: 0.08,
      speed: 1.6,
      phase: index * 1.4,
    })),
    { object: clouds, baseY: clouds.position.y, amplitude: 0.12, speed: 0.45, phase: 0.3 },
  ];

  const cameraTarget = new THREE.Vector3(0, 0.6, 0);

  return {
    scene,
    cameraTarget,
    update: (delta: number, elapsed: number) => {
      root.rotation.y += delta * 0.04;
      water.rotation.z -= delta * 0.03;
      plaza.rotation.y += delta * 0.12;
      arch.rotation.y = Math.sin(elapsed * 0.45) * 0.025;

      for (const floater of floaters) {
        floater.object.position.y = floater.baseY + Math.sin(elapsed * floater.speed + floater.phase) * floater.amplitude;
      }

      for (const eggy of eggies) {
        eggy.rotation.y += delta * 0.45;
      }

      clouds.rotation.y += delta * 0.035;
    },
  };
}

function addLighting(scene: THREE.Scene): void {
  const sky = new THREE.HemisphereLight(0xffffff, 0x75a878, 2.2);
  sky.name = 'IslandSkyLight';
  scene.add(sky);

  const sun = new THREE.DirectionalLight(0xfff2ce, 3.6);
  sun.name = 'IslandSunLight';
  sun.position.set(5, 8, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 30;
  sun.shadow.camera.left = -9;
  sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 9;
  sun.shadow.camera.bottom = -9;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x9bd7ff, 1.15);
  fill.name = 'IslandFillLight';
  fill.position.set(-5, 4, -6);
  scene.add(fill);
}

function createWater(): THREE.Mesh {
  const geometry = new THREE.CircleGeometry(22, 128);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2f9ed8,
    roughness: 0.52,
    metalness: 0.05,
    transparent: true,
    opacity: 0.86,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'LagoonWater';
  mesh.userData.kind = 'water';
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.82;
  mesh.receiveShadow = true;
  return mesh;
}

function createPlazaRing(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PlazaRing';
  group.userData.kind = 'island-detail';

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.62, 0.055, 10, 80),
    new THREE.MeshStandardMaterial({ color: 0xfff1b8, roughness: 0.7 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.57;
  ring.receiveShadow = true;
  group.add(ring);

  const pads = [
    [0, 0.08, 0xff6b7a],
    [Math.PI * 0.5, 0.08, 0x71d674],
    [Math.PI, 0.08, 0xffd166],
    [Math.PI * 1.5, 0.08, 0x60b8ff],
  ] as const;

  for (const [angle, height, color] of pads) {
    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.38, height, 32),
      new THREE.MeshStandardMaterial({ color, roughness: 0.45 }),
    );
    pad.name = 'BouncePad';
    pad.userData.kind = 'play-prop';
    pad.position.set(Math.cos(angle) * 1.6, 0.63, Math.sin(angle) * 1.6);
    pad.castShadow = true;
    pad.receiveShadow = true;
    group.add(pad);
  }

  return group;
}

function createCloudRing(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CloudRing';
  group.userData.kind = 'sky-prop';
  group.position.y = 5.4;

  const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
  for (let i = 0; i < 7; i += 1) {
    const cloud = new THREE.Group();
    cloud.name = 'CloudCluster';
    const angle = (i / 7) * Math.PI * 2;
    cloud.position.set(Math.cos(angle) * 12.5, Math.sin(i) * 0.28, Math.sin(angle) * 12.5);
    cloud.rotation.y = -angle;

    for (let j = 0; j < 4; j += 1) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.28 + j * 0.03, 16, 12), cloudMaterial);
      puff.position.set(j * 0.36 - 0.54, Math.sin(j) * 0.08, Math.cos(j) * 0.08);
      puff.castShadow = true;
      cloud.add(puff);
    }
    group.add(cloud);
  }

  return group;
}

function createDock(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'MiniDock';
  group.userData.kind = 'island-detail';

  const wood = new THREE.MeshStandardMaterial({ color: 0xa46a3b, roughness: 0.78 });
  for (let i = 0; i < 5; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 1.45), wood);
    plank.position.set(-0.32 + i * 0.16, 0.38, -4.15);
    plank.castShadow = true;
    plank.receiveShadow = true;
    group.add(plank);
  }

  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x7a4b2b, roughness: 0.82 });
  for (const x of [-0.56, 0.56]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.55, 12), railMaterial);
    post.position.set(x, 0.66, -3.7);
    post.castShadow = true;
    group.add(post);
  }

  return group;
}

function createWelcomeArch(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EggyGate';
  group.userData.kind = 'landmark';
  group.position.set(0, 0.72, -2.28);

  const material = new THREE.MeshStandardMaterial({ color: 0xff8f5a, roughness: 0.52 });
  const postGeometry = new THREE.CylinderGeometry(0.08, 0.1, 1.25, 18);
  for (const x of [-0.68, 0.68]) {
    const post = new THREE.Mesh(postGeometry, material);
    post.position.set(x, 0.44, 0);
    post.castShadow = true;
    group.add(post);
  }

  const top = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.075, 12, 48, Math.PI), material);
  top.rotation.z = Math.PI;
  top.position.y = 1.08;
  top.castShadow = true;
  group.add(top);

  return group;
}
