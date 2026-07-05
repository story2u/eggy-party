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

  it('animates the island without replacing scene objects', () => {
    const island = createEggyIslandScene();
    const eggy = collectByKind(island.scene, 'eggy-character')[0];
    const initialY = eggy.position.y;

    island.update(1 / 60, 1.25);

    expect(eggy.position.y).not.toBe(initialY);
    expect(collectByKind(island.scene, 'eggy-character')[0]).toBe(eggy);
  });
});
