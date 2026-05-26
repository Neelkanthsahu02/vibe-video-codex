import { run } from '../../utils/shell.js';

export async function probeVideo(videoPath: string) {
  const raw = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration:stream=width,height,r_frame_rate',
    '-of',
    'json',
    videoPath
  ]);
  const data = JSON.parse(raw);
  const stream = data.streams[0];
  const [num, den] = String(stream.r_frame_rate).split('/').map(Number);
  const fps = den ? num / den : Number(stream.r_frame_rate);
  return {
    duration: Number(data.format.duration),
    resolution: { width: stream.width, height: stream.height },
    fps
  };
}
