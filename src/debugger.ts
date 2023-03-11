import GUI from 'lil-gui';
import { type WorldConfiguration } from '~/world-configuration';
import { type World } from '~/world';

/**
 * The Debugger class.
 */
export class Debugger {
  /**
   * The debugger gui.
   */
  private readonly gui = new GUI();

  /**
   * The debugger gui folders.
   */
  private readonly folders: Record<string, GUI> = {};

  /**
   * The class constructor.
   */
  constructor(private readonly configuration: WorldConfiguration, private readonly world: World) {
    this.setupArtefactDebugging();
    this.setupCameraDebugging();
  }

  /**
   * Sets up the artefact debugging.
   */
  private setupArtefactDebugging(): void {
    // create the debugging folder
    const folder = this.gui.addFolder('Artefacts');
    this.folders.artefacts = folder;
    // add the artefacts parameters to the debugger
    folder.add(this.configuration.artefact.distribution, 'rows').min(1);
    folder.add(this.configuration.artefact.distribution, 'columns').min(1);
    folder.add(this.configuration.artefact.shape, 'width').name('artefact width').min(1);
    folder.add(this.configuration.artefact.shape, 'height').name('artefact height').min(1);
    folder.add(this.configuration.artefact.shape, 'depth').name('artefact depth').min(1);
    folder.add(this.configuration.artefact.shape, 'radialSegments').name('cylinder vertices').min(0);
    folder.add(this.configuration.artefact.materials.vertices, 'visible').name('show vertices');
    folder.addColor(this.configuration.artefact.materials.texture, 'color').name('texture color');
    // any change to the artefact requires the distribution to be redrawn
    folder.onChange(() => { this.world.setupArtefactDistribution(); });
  }

  /**
   * Sets up the camera debugging.
   */
  private setupCameraDebugging(): void {
    // create the debugging folder
    const folder = this.gui.addFolder('Camera');
    this.folders.camera = folder;
    // add the camera parameters to the debugger
    folder.add(this.configuration.camera, 'x').listen();
    folder.add(this.configuration.camera, 'y').listen();
    folder.add(this.configuration.camera, 'z').listen();
    folder.add(this.world.controls, 'enabled').name('controls enabled');
    // any change to the camera requires its update
    folder.onChange(() => {
      const { x, y, z } = this.configuration.camera;
      this.world.camera.position.set(x, y, z);
      this.world.camera.lookAt(0, 0, 0);
    });
  }
}
