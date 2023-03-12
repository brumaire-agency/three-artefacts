import GUI from 'lil-gui';
import { type WorldConfiguration } from '~/world-configuration';
import { type World } from '~/world';
import { GridHelper } from 'three';

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
    this.setupArtefactDistributionDebugging();
    this.setupArtefactMovementDebugging();
    this.setupLightDebugging();
    this.setupCameraDebugging();
    this.setupWorldDebugging();

    Object.values(this.folders).map((folder) => folder.close());
    this.gui.close();
  }

  /**
   * Sets up the artefact debugging.
   */
  private setupArtefactDebugging(): void {
    // create the debugging folder
    const folder = this.gui.addFolder('Artefact');
    this.folders.artefacts = folder;
    // add the artefacts parameters to the debugger
    folder.add(this.configuration.artefact.shape, 'width').name('artefact width').min(1);
    folder.add(this.configuration.artefact.shape, 'height').name('artefact height').min(1);
    folder.add(this.configuration.artefact.shape, 'depth').name('artefact depth').min(1);
    folder.add(this.configuration.artefact.shape, 'polygons').name('polygons').min(18);
    folder.addColor(this.configuration.artefact.materials, 'color').name('texture color');
    folder.add(this.configuration.artefact.materials, 'aoMapIntensity').min(0).max(10).step(0.1);
    folder.add(this.configuration.artefact.materials, 'roughness').min(0).max(3).step(0.1);
    folder.add(this.configuration.artefact.materials, 'normal').name('normal map');
    // any change to the artefact requires the distribution to be redrawn
    folder.onChange(() => {
      this.world.setupArtefactDistribution();
    });
  }

  /**
   * Sets up the artefact distribution debugging.
   */
  private setupArtefactDistributionDebugging(): void {
    // create the debugging folder
    const folder = this.gui.addFolder('Artefact Distribution');
    this.folders.artefactDistribution = folder;
    // add the artefact distribution parameters to the debugger
    folder.add(this.configuration.artefact.distribution, 'rows').min(1);
    folder.add(this.configuration.artefact.distribution, 'columns').min(1);
    folder.add(this.configuration.artefact.distribution, 'xGap').step(0.01);
    folder.add(this.configuration.artefact.distribution, 'zGap').step(0.01);
    folder.add(this.configuration.artefact.distribution, 'xSlippage').min(-1).max(1).step(0.01);
    folder.add(this.configuration.artefact.distribution, 'zSlippage').min(-1).max(1).step(0.01);
    folder.add(this.configuration.artefact.distribution, 'xSlope').min(-1).max(1).step(0.01);
    folder.add(this.configuration.artefact.distribution, 'zSlope').min(-1).max(1).step(0.01);
    // any change to the artefact requires the distribution to be redrawn
    folder.onChange(() => {
      this.world.setupArtefactDistribution();
    });
  }

  /**
   * Sets up the movement debugging.
   */
  private setupArtefactMovementDebugging(): void {
    // create the debugging folder
    const folder = this.gui.addFolder('Artefact Movement');
    this.folders.artefactMovement = folder;
    // add the movement parameters to the debugger
    folder.add(this.configuration.artefact.movement, 'amplitude').step(0.1);
    folder.add(this.configuration.artefact.movement, 'amplitudeNoise').name('amplitude noise').step(0.1);
    folder.add(this.configuration.artefact.movement, 'speed').step(0.01);
    folder.add(this.configuration.artefact.movement, 'speedNoise').name('speed noise').step(0.01);
    folder.add(this.configuration.artefact.movement, 'inactivity').min(0);
    folder.add(this.configuration.artefact.movement, 'inactivityNoise').min(0);
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

  private setupLightDebugging(): void {
    // create the debugging folder
    const folder = this.gui.addFolder('Lights');
    this.folders.lights = folder;
    // add the lights parameters to the debugger
    folder.add(this.world.light.position, 'x').min(-20).max(20);
    folder.add(this.world.light.position, 'y').min(-20).max(20);
    folder.add(this.world.light.position, 'z').min(-20).max(20);
    folder.add(this.world.light, 'intensity').min(-20).max(20);
    folder.add(this.world.light, 'distance').min(-20).max(20);
  }

  /**
   * Sets up the world debugging.
   * @private
   */
  private setupWorldDebugging(): void {
    // create the debugging folder
    const folder = this.gui.addFolder('World');
    this.folders.world = folder;
    // adds a grid
    const grid = new GridHelper(1000, 1000, 0xbbbbbb, 0xbbbbbb);
    grid.visible = this.configuration.world.grid;
    this.world.scene.add(grid);
    folder.add(grid, 'visible').name('show grid');
  }
}
