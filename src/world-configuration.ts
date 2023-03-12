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
      polygons: 100,
    },
    materials: {
      color: 0x1e222b,
      aoMapIntensity: 1,
      displacementScale: 0,
      roughness: 1.4,
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

  public light = {
    coordinates: {
      x: 2.3,
      y: 4.7,
      z: 2,
    },
    distance: 10,
    intensity: 3,
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
    grid: false,
  };
}
