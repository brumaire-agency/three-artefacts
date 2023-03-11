import {
  BoxGeometry,
  type BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
} from 'three';
// @ts-expect-error there is no type definition for the BufferGeometryUtils file
import { mergeBufferGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import seedrandom from 'seedrandom';
import { type SeededObject3d } from '~/types/seeded-object3d';

/**
 * The ArtefactFactory class.
 *
 * This class expose pure, static function that create artefact geometries
 */
export class ArtefactFactory {
  /**
   * The class constructor.
   */
  // public constructor(private readonly configuration: WorldConfiguration) {}

  /**
   * Creates an artefact base geometry.
   *
   * The base geometry should be re-used for every generated artefact mesh, and disposed when the user requests a
   * geometry change.
   */
  public createArtefactBaseGeometry(width: number, height: number, depth: number): BufferGeometry {
    // derive some geometry dimensions
    const cylinderRadius = depth / 2;
    const boxWidth = width - cylinderRadius * 2;
    const cylinderTranslation = boxWidth / 2;
    // the artifact is compounded of a central box and two half-cylinders on left and right sides
    const box = new BoxGeometry(boxWidth, height, depth);
    const leftCylinder = new CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      height,
      256,
      height,
      false,
      Math.PI,
      Math.PI
    );
    const rightCylinder = new CylinderGeometry(cylinderRadius, cylinderRadius, height, 256, height, false, 0, Math.PI);
    leftCylinder.translate(-cylinderTranslation, 0, 0);
    rightCylinder.translate(cylinderTranslation, 0, 0);

    return mergeBufferGeometries([leftCylinder, box, rightCylinder]);
  }

  /**
   * Creates an artefact.
   */
  public createArtefact(x: number, y: number, z: number): SeededObject3d {
    const geometry = this.createArtefactBaseGeometry(2, 2, 1);
    // the mesh is a group of the actual mesh, as well as some line segments to show the artifact vertices in dev
    const mesh = new Group();
    mesh.add(
      new Mesh(
        geometry,
        new MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: true })
      )
    );
    mesh.add(
      new LineSegments(
        geometry,
        new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, visible: false })
      )
    );
    // set the mesh position
    mesh.position.set(x, y, z);
    // compute the artefact seed - the seed is always the same for a given {x,y,z} set
    const seed = seedrandom(`${x}-${y}-${z}`)();
    // return the seeded artefact
    return Object.assign(mesh, { seed });
  }
}
