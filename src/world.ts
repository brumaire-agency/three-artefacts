import { type Camera, Clock, Color, type Object3D, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import { type WorldConfiguration } from './world-configuration';
import { type ArtefactFactory } from './artefact-factory';

/**
 * The World class.
 *
 * This class represents the "world" created in 3D by Three.js.
 *
 * This world is an "x" by "z" (horizontal plane) distribution of artefacts (cylinder-like geometries) that move up and
 * down.
 */
export class World {
  /**
   * The world artefacts.
   */
  private artefacts: Object3D[];

  /**
   * The world camera.
   */
  private camera: Camera;

  /**
   * The world clock.
   */
  private clock: Clock;

  /**
   * The world renderer.
   */
  private renderer: WebGLRenderer;

  /**
   * The world scene.
   */
  private scene: Scene;

  /**
   * The world constructor.
   */
  constructor(
    private readonly artefactFactory: ArtefactFactory,
    private readonly configuration: WorldConfiguration,
    private readonly canvas: HTMLCanvasElement
  ) {
    // set up the world base elements
    this.setupScene();
    this.setupRenderer();
    this.setupClock();
    // set up scene-dependent elements
    this.setupCamera();
    this.setupLights();
    this.setupArtefactDistribution();

    // animate the world
    this.animate();
  }

  /**
   * Animates the world.
   */
  private animate(): void {
    // get the elapsed time from the clock
    const elapsedTime = this.clock.getElapsedTime();
    // update the artefact heights
    this.artefacts.forEach((artefact) => {
      artefact.position.y = Math.sin(elapsedTime);
    });
    // rerender the scene
    this.renderer.render(this.scene, this.camera);
    // reapply the animation next frame
    window.requestAnimationFrame(() => { this.animate(); });
  }

  /**
   * Sets up the artefact distribution.
   *
   * An artefact is spawned for every cell of the "x" by "z" distribution grid, positioned and added to the scene.
   */
  private setupArtefactDistribution(): void {
    const { width, depth } = this.configuration.artefact.shape;
    const { columns, rows } = this.configuration.artefact.distribution;
    // the grid initial coordinates
    const initialX = (-width * rows) / 2 + width / 2; // removing half of the artefact width allows to inline the artifact with the grid
    const initialY = 0; // Y is updated in the animate() function to move the artefacts up and down
    const initialZ = (-depth * columns) / 2 + depth / 2; // removing half of the artifact width allows to inline the artifact with the grid
    this.artefacts = [];
    // generate an artefact grid of "x" rows by "z" columns (not y because y is height, and we want a depth grid)
    for (let x = 0; x < rows; x++) {
      for (let z = 0; z < columns; z++) {
        // create an artefact for the current cell
        const artefact = this.artefactFactory.createArtefact();
        // position the artefact on the current cell
        artefact.position.set(initialX + x * width, initialY, initialZ + z * depth);
        // add the artefact to the scene and the artefacts list
        this.scene.add(artefact);
        this.artefacts.push(artefact);
      }
    }
  }

  /**
   * Sets up the camera
   */
  private setupCamera(): void {
    const { x, y, z } = this.configuration.camera;
    const { height, width } = this.configuration.sizes;
    this.camera = new PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(this.camera);
  }

  /**
   * Setups the clock.
   */
  setupClock(): void {
    this.clock = new Clock();
  }

  /**
   * Sets up the lights
   */
  private setupLights(): void {
    const light = new PointLight(0xffffff, 1, 0);
    light.position.set(10, 10, 0);
    light.lookAt(0, 0, 0);
    this.scene.add(light);
  }

  /**
   * Sets up the renderer.
   */
  private setupRenderer(): void {
    const { height, width } = this.configuration.sizes;
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(width, height);
  }

  /**
   * Sets up the scene.
   */
  private setupScene(): void {
    this.scene = new Scene();
    this.scene.background = new Color(this.configuration.world.background);
  }
}
