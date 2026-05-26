import { run } from '../../utils/shell.js';
export interface YouTubeSearchResult { id: string; title: string; channel: string; duration?: number }
export async function searchYoutube(query: string, maxResults = 5): Promise<YouTubeSearchResult[]> {
  const raw = await run('yt-dlp', [`ytsearch${maxResults}:${query}`, '--flat-playlist', '--dump-single-json']);
  const data = JSON.parse(raw);
  return (data.entries ?? []).map((e: any) => ({ id: e.id, title: e.title, channel: e.channel ?? '', duration: e.duration }));
}
export async function downloadYoutubeClip(videoId: string, outDir: string): Promise<string> {
  const pattern = `${outDir}/%(id)s.%(ext)s`;
  await run('yt-dlp', ['-o', pattern, '-f', 'mp4/best', `https://www.youtube.com/watch?v=${videoId}`]);
  return `${outDir}/${videoId}.mp4`;
}
