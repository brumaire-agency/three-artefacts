import { type Camera } from 'three';
import { type WorldConfiguration } from '~/world-configuration';

export class CustomControls {
  public enabled = true;

  /**
   * The control scaling
   */
  public scaling: number = 1.2;

  /**
   * The cursor x coordinate
   */
  public x: number;

  /**
   * The cursor y coordinate
   */
  public y: number;

  /**
   * The class constructor.
   */
  constructor(
    private readonly camera: Camera,
    private readonly configuration: WorldConfiguration,
    private readonly canvas: HTMLCanvasElement
  ) {
    window.addEventListener('mousemove', this.listener);
  }

  /**
   * The window mouse event listener callback function.
   *
   * It is registered as a callback, so it can be removed later on.
   */
  listener = (event: MouseEvent): void => {
    this.x = (event.clientX / this.canvas.width - 0.5) * this.scaling;
    this.y = -(event.clientY / this.canvas.height - 0.5) * this.scaling;

    this.camera.position.x = this.configuration.camera.x + this.x;
    this.camera.position.y = this.configuration.camera.y + this.y;
    this.camera.lookAt(0, 0, 0);
  };
}
