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
      rows: 20,
    },
    shape: {
      width: 2,
      height: 2,
      depth: 1,
    },
  };

  /**
   * The camera configuration.
   *
   * These settings control the camera placement.
   */
  public camera = {
    x: -3,
    y: 8,
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
  };
}
