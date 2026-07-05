import * as THREE from 'three';
import { createCentralEggyStatue } from './createCentralEggyStatue';
import { createEggyCharacter } from './createEggyCharacter';
import { createFerrisWheel } from './createFerrisWheel';
import { createIslandBase } from './createIslandBase';
import { createPalmTree } from './createPalmTree';
import { createPlazaDetails } from './createPlazaDetails';
import { createRocketHub } from './createRocketHub';
import { createIslandMaterials } from './materials';

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
  const materials = createIslandMaterials();
  const scene = new THREE.Scene();
  scene.name = 'EggyIslandScene';
  scene.background = new THREE.Color(0x8ed7ff);
  scene.fog = new THREE.Fog(0x8ed7ff, 24, 56);
  scene.add(createSkyDome());
  addLighting(scene);

  const root = new THREE.Group();
  root.name = 'EggyIslandRoot';
  scene.add(root);

  const island = createIslandBase();
  root.add(island.group);

  const water = createWater(materials);
  root.add(water);

  const centralStatue = createCentralEggyStatue();
  root.add(centralStatue);

  const ferrisWheel = createFerrisWheel();
  root.add(ferrisWheel.group);

  const rocketHub = createRocketHub();
  root.add(rocketHub);

  const plazaDetails = createPlazaDetails();
  root.add(plazaDetails);

  const eggies = [
    createEggyCharacter({
      name: 'EggyCaptain',
      color: 0xffcf4d,
      position: new THREE.Vector3(-1.72, 1.02, 1.2),
      scale: 0.62,
      accessory: 'belt',
      accentColor: 0x49d7ff,
    }),
    createEggyCharacter({
      name: 'EggyScout',
      color: 0xff7aa8,
      position: new THREE.Vector3(1.55, 1.0, 1.35),
      scale: 0.56,
      accessory: 'backpack',
      accentColor: 0xffd65a,
    }),
    createEggyCharacter({
      name: 'EggyRacer',
      color: 0x65c7ff,
      position: new THREE.Vector3(2.15, 1.0, -0.18),
      scale: 0.52,
      accessory: 'visor',
    }),
  ];
  eggies.forEach((eggy) => root.add(eggy));

  const trees = [
    createPalmTree(-4.0, 0.92, 1.9, 0.82),
    createPalmTree(4.2, 0.92, 2.25, 0.72),
    createPalmTree(-2.9, 0.92, -2.95, 0.66),
    createPalmTree(2.7, 0.92, 3.3, 0.58),
  ];
  trees.forEach((tree) => root.add(tree));

  const clouds = createCloudRing();
  root.add(clouds);

  const floaters: FloatingObject[] = [
    ...eggies.map((object, index) => ({
      object,
      baseY: object.position.y,
      amplitude: 0.045,
      speed: 1.35,
      phase: index * 1.4,
    })),
    { object: clouds, baseY: clouds.position.y, amplitude: 0.09, speed: 0.38, phase: 0.3 },
  ];

  const glowPickups = collectByName(root, 'GlowPickup');
  const rocketLights = collectByName(root, 'RocketGlowArrow');
  const waveRings = collectByName(water, 'LagoonWaveRing');
  const cameraTarget = new THREE.Vector3(0, 1.08, 0);

  return {
    scene,
    cameraTarget,
    update: (delta: number, elapsed: number) => {
      water.rotation.y += delta * 0.025;
      for (const [index, ring] of waveRings.entries()) {
        ring.rotation.z += delta * (0.08 + index * 0.025);
        const pulse = 1 + Math.sin(elapsed * 0.8 + index) * 0.018;
        ring.scale.setScalar(pulse);
      }

      ferrisWheel.wheel.rotation.z += delta * 0.28;
      for (const cabin of ferrisWheel.cabins) {
        cabin.rotation.z = -ferrisWheel.wheel.rotation.z;
      }

      for (const floater of floaters) {
        floater.object.position.y = floater.baseY + Math.sin(elapsed * floater.speed + floater.phase) * floater.amplitude;
      }

      for (const eggy of eggies) {
        eggy.rotation.y += delta * 0.18;
      }

      for (const pickup of glowPickups) {
        const phase = Number(pickup.userData.phase ?? 0);
        const baseY = Number(pickup.userData.baseY ?? pickup.position.y);
        const scale = 1 + Math.sin(elapsed * 2.4 + phase) * 0.16;
        pickup.position.y = baseY + Math.sin(elapsed * 1.9 + phase) * 0.06;
        pickup.scale.setScalar(scale);
      }

      for (const light of rocketLights) {
        const material = light instanceof THREE.Mesh ? light.material : undefined;
        if (material instanceof THREE.MeshStandardMaterial) {
          const phase = Number(light.userData.phase ?? 0);
          material.emissiveIntensity = 0.65 + Math.sin(elapsed * 3.2 + phase) * 0.35;
        }
      }

      clouds.rotation.y += delta * 0.022;
    },
  };
}

function addLighting(scene: THREE.Scene): void {
  const sky = new THREE.HemisphereLight(0xffffff, 0x85b673, 2.05);
  sky.name = 'IslandSkyLight';
  scene.add(sky);

  const sun = new THREE.DirectionalLight(0xfff2ce, 3.35);
  sun.name = 'IslandSunLight';
  sun.position.set(5, 8, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 32;
  sun.shadow.camera.left = -9;
  sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 9;
  sun.shadow.camera.bottom = -9;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x9bd7ff, 1.2);
  fill.name = 'IslandFillLight';
  fill.position.set(-5, 4, -6);
  scene.add(fill);
}

function createSkyDome(): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(60, 32, 16);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x75c8ff) },
      bottomColor: { value: new THREE.Color(0xcff8ff) },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        gl_FragColor = vec4(mix(bottomColor, topColor, smoothstep(0.18, 0.95, h)), 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'GradientSkyDome';
  return mesh;
}

function createWater(materials: ReturnType<typeof createIslandMaterials>): THREE.Group {
  const group = new THREE.Group();
  group.name = 'LagoonWater';
  group.userData.kind = 'water';
  group.position.y = -0.84;

  const base = new THREE.Mesh(
    new THREE.CircleGeometry(26, 128),
    new THREE.MeshStandardMaterial({
      color: 0x27a7df,
      roughness: 0.42,
      metalness: 0.04,
      transparent: true,
      opacity: 0.84,
    }),
  );
  base.name = 'LagoonWaterDisk';
  base.rotation.x = -Math.PI / 2;
  base.receiveShadow = true;
  group.add(base);

  for (const radius of [7.1, 10.4, 14.2, 18.4]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.015, 8, 128), materials.glass.clone());
    ring.name = 'LagoonWaveRing';
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;
    group.add(ring);
  }

  return group;
}

function createCloudRing(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CloudRing';
  group.userData.kind = 'sky-prop';
  group.position.y = 5.75;

  const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92 });
  for (let i = 0; i < 8; i += 1) {
    const cloud = new THREE.Group();
    cloud.name = 'CloudCluster';
    const angle = (i / 8) * Math.PI * 2;
    cloud.position.set(Math.cos(angle) * 13.5, Math.sin(i) * 0.28, Math.sin(angle) * 13.5);
    cloud.rotation.y = -angle;

    for (let j = 0; j < 4; j += 1) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.28 + j * 0.03, 16, 12), cloudMaterial);
      puff.name = 'CloudPuff';
      puff.position.set(j * 0.36 - 0.54, Math.sin(j) * 0.08, Math.cos(j) * 0.08);
      puff.castShadow = true;
      cloud.add(puff);
    }
    group.add(cloud);
  }

  return group;
}

function collectByName(root: THREE.Object3D, name: string): THREE.Object3D[] {
  const matches: THREE.Object3D[] = [];
  root.traverse((object) => {
    if (object.name === name) {
      matches.push(object);
    }
  });
  return matches;
}
