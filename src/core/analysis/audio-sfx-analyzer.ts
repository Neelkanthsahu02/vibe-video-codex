import { run } from '../../utils/shell.js';

export async function analyzeAudioSfx(videoPath: string, sfxDir: string) {
  const raw = await run('python3', ['python/audio_sfx_match.py', '--video', videoPath, '--sfx-dir', sfxDir]);
  return JSON.parse(raw);
}
