import { DoubleSide, LineBasicMaterial, MeshPhongMaterial } from 'three';

/**
 * The WorldConfiguration class.
 *
 * This class centralizes every parameter of the world.
 */
export class WorldConfiguration {
  /**
   * The artefact configuration.
   *
   * These settings control the artefact shape and distribution.
   */
  public artefact = {
    distribution: {
      columns: 20,
      rows: 10,
      xGap: 0,
      zGap: 0,
      xSlippage: 0.3,
      zSlippage: 0.26,
      xSlope: -0.05,
      zSlope: 0.12,
    },
    shape: {
      width: 2,
      height: 2,
      depth: 1,
      radialSegments: 16,
    },
    materials: {
      color: 0x156289,
      texture: new MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: true }),
      vertices: new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, visible: false }),
    },
    movement: {
      inactivity: 2,
      inactivityNoise: 2,
      amplitude: 0,
      amplitudeNoise: 1,
      speed: 0.2,
      speedNoise: 0.5,
    },
  };

  /**
   * The camera configuration.
   *
   * These settings control the camera placement.
   */
  public camera = {
    x: -3,
    y: 6,
    z: 7,
  };

  /**
   * The movement configuration.
   *
   * These settings control how the artefacts are displaced in the world.
   */
  public movement = {
    amplitude: 0.3,
    noise: 0,
    speed: 1,
  };

  /**
   * The sizes configuration.
   *
   * These settings control the size of the canvas.
   */
  public sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /**
   * The world configuration.
   *
   * These settings control general parameters of the world.
   */
  public world = {
    background: 0x444444,
    grid: true,
  };
}
