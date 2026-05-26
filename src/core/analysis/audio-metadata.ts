import { run } from '../../utils/shell.js';

export async function probeAudioDuration(audioPath: string): Promise<number> {
  const raw = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    audioPath
  ]);
  return Number(raw.trim());
}
