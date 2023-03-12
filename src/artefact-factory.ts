import { BoxGeometry, type BufferGeometry, CylinderGeometry, Group, LineSegments, Mesh } from 'three';
// @ts-expect-error there is no type definition for the BufferGeometryUtils file
import { mergeBufferGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import seedrandom from 'seedrandom';
import { type SeededObject3d } from '~/types/seeded-object3d';
import { type WorldConfiguration } from '~/world-configuration';

/**
 * The ArtefactFactory class.
 *
 * This class expose pure, static function that create artefact geometries
 */
export class ArtefactFactory {
  /**
   * The class constructor.
   */
  public constructor(private readonly configuration: WorldConfiguration) {}

  /**
   * Creates an artefact base geometry.
   *
   * The base geometry should be re-used for every generated artefact mesh, and disposed when the user requests a
   * geometry change.
   */
  public createArtefactBaseGeometry(): BufferGeometry {
    const { width, height, depth, radialSegments } = this.configuration.artefact.shape;
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
      radialSegments,
      height,
      false,
      Math.PI,
      Math.PI
    );
    const rightCylinder = new CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      height,
      radialSegments,
      height,
      false,
      0,
      Math.PI
    );
    leftCylinder.translate(-cylinderTranslation, 0, 0);
    rightCylinder.translate(cylinderTranslation, 0, 0);

    return mergeBufferGeometries([leftCylinder, box, rightCylinder]);
  }

  /**
   * Creates an artefact5
   */
  public createArtefact(x: number, y: number, z: number): SeededObject3d {
    const geometry = this.createArtefactBaseGeometry();
    // the mesh is a group of the actual mesh, as well as some line segments to show the artifact vertices in dev
    const mesh = new Group();
    mesh.add(new Mesh(geometry, this.configuration.artefact.materials.texture));
    mesh.add(new LineSegments(geometry, this.configuration.artefact.materials.vertices));
    // set the mesh position
    mesh.position.set(x, y, z);
    // compute the artefact seed - the seed is always the same for a given {x,y,z} set
    const seed = seedrandom(`${x}-${y}-${z}`)();
    // return the seeded artefact
    return Object.assign(mesh, { seed });
  }
}
