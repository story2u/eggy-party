import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { createEggyIslandScene } from '../../src/world/createEggyIslandScene';

function collectByKind(root: THREE.Object3D, kind: string): THREE.Object3D[] {
  const matches: THREE.Object3D[] = [];
  root.traverse((object) => {
    if (object.userData.kind === kind) {
      matches.push(object);
    }
  });
  return matches;
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

describe('Eggy Island scene', () => {
  it('builds a named 3D island scene with a camera target', () => {
    const island = createEggyIslandScene();

    expect(island.scene.name).toBe('EggyIslandScene');
    expect(island.cameraTarget.y).toBeGreaterThan(0);
    expect(collectByKind(island.scene, 'island')).toHaveLength(1);
    expect(collectByKind(island.scene, 'water')).toHaveLength(1);
  });

  it('contains eggy characters as first-class scene objects', () => {
    const island = createEggyIslandScene();

    const eggies = collectByKind(island.scene, 'eggy-character');

    expect(eggies).toHaveLength(3);
    expect(eggies.map((eggy) => eggy.name)).toEqual(['EggyCaptain', 'EggyScout', 'EggyRacer']);
  });

  it('contains the landmark anchors for an Eggy Island lobby', () => {
    const island = createEggyIslandScene();

    const landmarks = collectByKind(island.scene, 'landmark');
    const landmarkNames = landmarks.map((landmark) => landmark.name);

    expect(landmarkNames).toContain('CentralEggyStatue');
    expect(landmarkNames).toContain('FerrisWheel');
    expect(landmarkNames).toContain('RocketHub');
    expect(landmarks.length).toBeGreaterThanOrEqual(3);
  });

  it('adds plaza details and multiple glow pickups for future gameplay hooks', () => {
    const island = createEggyIslandScene();

    expect(collectByKind(island.scene, 'plaza-detail').length).toBeGreaterThanOrEqual(1);
    expect(collectByName(island.scene, 'GlowPickup').length).toBeGreaterThanOrEqual(3);
  });

  it('animates the island without replacing scene objects', () => {
    const island = createEggyIslandScene();
    const eggy = collectByKind(island.scene, 'eggy-character')[0];
    const ferrisWheel = collectByName(island.scene, 'FerrisWheel')[0];
    const ferrisWheelRing = collectByName(island.scene, 'FerrisWheelRotatingWheel')[0];
    const glowPickup = collectByName(island.scene, 'GlowPickup')[0];
    const initialY = eggy.position.y;
    const initialWheelRotation = ferrisWheelRing.rotation.z;
    const initialGlowScale = glowPickup.scale.x;

    island.update(1 / 60, 1.25);

    expect(eggy.position.y).not.toBe(initialY);
    expect(collectByKind(island.scene, 'eggy-character')[0]).toBe(eggy);
    expect(ferrisWheelRing.rotation.z).not.toBe(initialWheelRotation);
    expect(glowPickup.scale.x).not.toBe(initialGlowScale);
    expect(collectByName(island.scene, 'FerrisWheel')[0]).toBe(ferrisWheel);
    expect(collectByName(island.scene, 'FerrisWheelRotatingWheel')[0]).toBe(ferrisWheelRing);
    expect(collectByName(island.scene, 'GlowPickup')[0]).toBe(glowPickup);
  });
});
