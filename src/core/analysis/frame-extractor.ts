import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { run } from '../../utils/shell.js';

export async function extractFrames(videoPath: string, outputDir: string, fps = 1): Promise<string> {
  await mkdir(outputDir, { recursive: true });
  const pattern = join(outputDir, 'frame_%06d.jpg');
  await run('ffmpeg', ['-y', '-i', videoPath, '-vf', `fps=${fps}`, pattern]);
  return pattern;
}
