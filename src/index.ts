import { WorldConfiguration } from './world-configuration';
import { World } from './world';
import { ArtefactFactory } from './artefact-factory';
import { Debugger } from './debugger';

export function drawWorldOnCanvas(canvas: HTMLCanvasElement): Debugger {
  const configuration = new WorldConfiguration();
  const artefactFactory = new ArtefactFactory(configuration);
  const world = new World(artefactFactory, configuration, canvas);
  return new Debugger(configuration, world);
}
