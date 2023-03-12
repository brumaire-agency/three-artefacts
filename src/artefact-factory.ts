import {
  BoxGeometry,
  BufferAttribute,
  type BufferGeometry,
  CylinderGeometry,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
} from 'three';
// @ts-expect-error there is no type definition for the BufferGeometryUtils file
import { mergeBufferGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import seedrandom from 'seedrandom';
import { type SeededObject3d } from '~/types/seeded-object3d';
import { type WorldConfiguration } from '~/world-configuration';
import ambient from './assets/ambient.jpeg';
import normal from './assets/normal.jpeg';
import roughness from './assets/roughness.jpeg';

/**
 * The ArtefactFactory class.
 *
 * This class expose pure, static function that create artefact geometries
 */
export class ArtefactFactory {
  /**
   * The texture loader.
   */
  private readonly textureLoader = new TextureLoader();

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
    const { width, height, depth, polygons } = this.configuration.artefact.shape;
    // derive some geometry dimensions
    const cylinderRadius = depth / 2;
    const boxWidth = width - cylinderRadius * 2;
    const cylinderTranslation = boxWidth / 2;
    // the artifact is compounded of a central box and two half-cylinders on left and right sides
    const box = new BoxGeometry(boxWidth, height, depth, polygons / 18, polygons / 6, 100);
    const leftCylinder = new CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      height,
      polygons / 9,
      height,
      false,
      Math.PI,
      Math.PI
    );
    const rightCylinder = new CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      height,
      polygons / 9,
      height,
      false,
      0,
      Math.PI
    );
    leftCylinder.translate(-cylinderTranslation, 0, 0);
    rightCylinder.translate(cylinderTranslation, 0, 0);

    const geometry = mergeBufferGeometries([leftCylinder, box, rightCylinder]);
    // set the uv2 for the ambient occlusion
    geometry.setAttribute('uv2', new BufferAttribute(geometry.attributes.uv.array, 2));
    return geometry;
  }

  /**
   * Creates a material for the artefact.
   */
  public createArtefactMaterial(): MeshStandardMaterial {
    return new MeshStandardMaterial({
      color: this.configuration.artefact.materials.color,
      aoMap: this.textureLoader.load(ambient),
      aoMapIntensity: this.configuration.artefact.materials.aoMapIntensity,
      normalMap: this.textureLoader.load(normal),
      roughnessMap: this.textureLoader.load(roughness),
      roughness: this.configuration.artefact.materials.roughness,
    });
  }

  /**
   * Creates an artefact5
   */
  public createArtefact(x: number, y: number, z: number): SeededObject3d {
    const geometry = this.createArtefactBaseGeometry();
    // create the mesh
    const material = this.createArtefactMaterial();
    const mesh = new Mesh(geometry, material);
    // set the mesh position
    mesh.position.set(x, y, z);
    // compute the artefact seed - the seed is always the same for a given {x,y,z} set
    const seed = seedrandom(`${x}-${y}-${z}`)();
    // return the seeded artefact

    return Object.assign(mesh, { seed });
  }
}
