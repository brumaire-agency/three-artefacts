import { type Camera, Clock, Color, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import { type WorldConfiguration } from './world-configuration';
import { type ArtefactFactory } from './artefact-factory';
import { type SeededObject3d } from '~/types/seeded-object3d';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
  private artefacts: SeededObject3d[] = [];

  /**
   * The world camera.
   */
  public camera: Camera;

  /**
   * The world camera controls.
   */
  public controls: OrbitControls;

  /**
   * The world clock.
   */
  public clock: Clock;

  /**
   * The world renderer.
   */
  private renderer: WebGLRenderer;

  /**
   * The world scene.
   */
  public scene: Scene;

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
    // get the movement configuration
    const { amplitude, amplitudeNoise, inactivity, inactivityNoise, speed, speedNoise } =
      this.configuration.artefact.movement;
    const { xSlope, zSlope } = this.configuration.artefact.distribution;
    // update the artefact heights
    this.artefacts.forEach((artefact) => {
      // set the artefact y position
      artefact.position.y =
        this.computeArtefactY(
          elapsedTime,
          artefact.seed,
          speed + (0.5 - artefact.seed) * speedNoise,
          Math.round(inactivity + (0.5 - artefact.seed) * inactivityNoise),
          amplitude + (0.5 - artefact.seed) * amplitudeNoise
        ) -
        artefact.position.z * zSlope -
        artefact.position.x * xSlope;
    });
    // rerender the scene
    this.renderer.render(this.scene, this.camera);
    // reapply the animation next frame
    window.requestAnimationFrame(() => {
      this.animate();
    });
  }

  private computeArtefactY(
    time: number,
    seed: number = 0.36,
    speed: number = 0.2,
    inactivity: number = 2,
    amplitude: number = 1
  ): number {
    // the sin period (the sin function is 2*PI periodic)
    const sinPeriod = Math.PI * 2;
    // the time expressed according to the sin period length
    const sinTime = (time * speed + seed * 2) * sinPeriod;
    // compute the number of the current half period
    const halfPeriodIndex = Math.floor((time * speed - 0.25 + seed * 2) * 2);
    // compute the last active half period
    const lastActiveHalfPeriodIndex = halfPeriodIndex - (halfPeriodIndex % (inactivity * 2 + 1));
    // the artefact should move if it is in an active period
    const shouldMove = halfPeriodIndex > 0 && halfPeriodIndex === lastActiveHalfPeriodIndex;
    // get the idle position, which depends on the previous movement
    const idlePosition = lastActiveHalfPeriodIndex % 2 ? amplitude : -amplitude;
    // return an updated position if the artefact should move
    return shouldMove ? Math.sin(sinTime) * amplitude : idlePosition;
  }

  /*
  |--------------------------------------------------------------------------
  | Setup functions
  |--------------------------------------------------------------------------
  |
  | The following functions are "setup functions". These functions mutate the
  | world - the main side effect is adding elements to the scene.
  |
  | The goal of setup functions is to encapsulate some setup logic, such as
  | adding elements to the scene by functionality (e.g. a light configuration).
  |
  | As they define global elements at the world initialization, they should be
  | invoked in the world constructor.
  |
  */

  /**
   * Sets up the artefact distribution.
   *
   * An artefact is spawned for every cell of the "x" by "z" distribution grid, positioned and added to the scene.
   * The method is public to allow external actors (e.g. the debugger) to "re-draw" the artefacts on demand.
   */
  public setupArtefactDistribution(): void {
    // remove any previous artefacts
    this.artefacts.forEach((artefact) => this.scene.remove(artefact));
    // redefine the artefacts list
    this.artefacts = [];
    // extract required parameters from the configuration
    const { width, depth } = this.configuration.artefact.shape;
    const { columns, rows, xGap, zGap, xSlippage, zSlippage } = this.configuration.artefact.distribution;
    // the grid initial coordinates
    const initialX = (-width * rows) / 2 + width / 2; // removing half of the artefact width allows to inline the artifact with the grid
    const initialY = 0; // Y is updated in the animate() function to move the artefacts up and down
    const initialZ = (-depth * columns) / 2 + depth / 2; // removing half of the artifact width allows to inline the artifact with the grid
    // generate an artefact grid of "x" rows by "z" columns (not y because y is height, and we want a depth grid)
    for (let x = 0; x < rows; x++) {
      for (let z = 0; z < columns; z++) {
        // create an artefact for the current cell
        const artefact = this.artefactFactory.createArtefact(
          initialX + x * (width + xGap) + xSlippage * z,
          initialY,
          initialZ + z * (depth + zGap) + zSlippage * x
        );
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
    // define the camera and add it to the scene
    const { x, y, z } = this.configuration.camera;
    const { height, width } = this.configuration.sizes;
    this.camera = new PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);
    // add orbit controls for the camera
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // update the configuration on change
    this.controls.addEventListener('change', () => Object.assign(this.configuration.camera, this.camera.position));
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
