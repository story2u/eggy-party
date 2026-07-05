import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createEggyIslandScene } from '../world/createEggyIslandScene';

export class EggyIslandApp {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly island = createEggyIslandScene();
  private animationFrame = 0;
  private disposed = false;
  private startTime = performance.now();
  private lastTime = this.startTime;

  constructor(private readonly container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    this.renderer.domElement.dataset.scene = 'eggy-island';
    this.renderer.setClearColor(0x8ed7ff, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.camera = new THREE.PerspectiveCamera(44, 1, 0.1, 140);
    this.camera.position.set(7.5, 4.8, 7.5);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.16;
    this.controls.minDistance = 6.2;
    this.controls.maxDistance = 17;
    this.controls.minPolarAngle = Math.PI * 0.2;
    this.controls.maxPolarAngle = Math.PI * 0.5;
    this.controls.target.copy(this.island.cameraTarget);

    this.container.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  start(): void {
    this.disposed = false;
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.renderer.setAnimationLoop(this.render);
  }

  dispose(): void {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.replaceChildren();
  }

  private readonly resize = (): void => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    const aspect = width / height;
    const isPortrait = aspect < 0.8;

    this.camera.aspect = aspect;
    this.camera.fov = isPortrait ? 53 : 44;
    this.camera.position.set(isPortrait ? 9.8 : 7.5, isPortrait ? 7.1 : 4.8, isPortrait ? 16.2 : 7.5);
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
  };

  private readonly render = (): void => {
    if (this.disposed) {
      return;
    }

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.05);
    const elapsed = (now - this.startTime) / 1000;
    this.lastTime = now;

    this.island.update(delta, elapsed);
    this.controls.update();
    this.renderer.render(this.island.scene, this.camera);
  };
}
