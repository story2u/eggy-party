import * as THREE from 'three';

interface EggyOptions {
  name: string;
  color: number;
  position: THREE.Vector3;
  scale?: number;
}

export function createEggyCharacter({ name, color, position, scale = 1 }: EggyOptions): THREE.Group {
  const group = new THREE.Group();
  group.name = name;
  group.userData.kind = 'eggy-character';
  group.position.copy(position);
  group.scale.setScalar(scale);

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.42,
    metalness: 0.02,
  });
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.48, 40, 32), bodyMaterial);
  shell.name = 'EggyBody';
  shell.scale.set(0.86, 1.16, 0.82);
  shell.castShadow = true;
  shell.receiveShadow = true;
  group.add(shell);

  const faceMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x222438, roughness: 0.35 });
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

  const blushMaterial = new THREE.MeshStandardMaterial({ color: 0xff8f9b, roughness: 0.55 });
  for (const x of [-0.31, 0.31]) {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), blushMaterial);
    cheek.name = 'EggyCheek';
    cheek.position.set(x, -0.05, 0.38);
    cheek.scale.set(1.25, 0.72, 0.22);
    group.add(cheek);
  }

  const footMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f0dc, roughness: 0.65 });
  for (const x of [-0.23, 0.23]) {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 12), footMaterial);
    foot.name = 'EggyFoot';
    foot.position.set(x, -0.52, 0.1);
    foot.scale.set(1.2, 0.42, 0.78);
    foot.castShadow = true;
    group.add(foot);
  }

  return group;
}
