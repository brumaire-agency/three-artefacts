import { WorldConfiguration } from './world-configuration';
import { World } from './world';
import { ArtefactFactory } from './artefact-factory';

export function drawWorldOnCanvas(canvas: HTMLCanvasElement): World {
  const configuration = new WorldConfiguration();
  const artefactFactory = new ArtefactFactory(configuration);
  return new World(artefactFactory, configuration, canvas);
}
