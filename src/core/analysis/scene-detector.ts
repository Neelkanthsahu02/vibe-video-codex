import { run } from '../../utils/shell.js';

export interface SceneCut {
  start: number;
  end: number;
  duration: number;
}

export async function detectScenes(videoPath: string): Promise<SceneCut[]> {
  const raw = await run('python3', ['python/scene_detect.py', '--video', videoPath]);
  return JSON.parse(raw) as SceneCut[];
}
