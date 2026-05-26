import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { run } from '../../utils/shell.js';

export async function extractFrames(
  videoPath: string,
  outputDir: string,
  fps = 1,
  range?: { startSec: number; endSec: number }
): Promise<string> {
  await mkdir(outputDir, { recursive: true });
  const pattern = join(outputDir, 'frame_%06d.jpg');
  const args = ['-y'];
  if (range) {
    args.push('-ss', String(range.startSec), '-to', String(range.endSec));
  }
  args.push('-i', videoPath, '-vf', `fps=${fps}`, '-q:v', '3', pattern);
  await run('ffmpeg', args);
  return pattern;
}
