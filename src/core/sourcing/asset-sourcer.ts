import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { readJson, writeJson } from '../../utils/fs.js';
import { braveImageSearch } from './brave-search.js';
import { searchYoutube, downloadYoutubeClip } from './youtube-search.js';

export async function sourceAssetsForProject(projectRoot: string) {
  const scenePlanPath = join(projectRoot, 'plan', 'scene_plan.json');
  const scenePlan = await readJson<any>(scenePlanPath);

  const base = join(projectRoot, 'assets', 'candidates');
  const imagesDir = join(base, 'images');
  const clipsDir = join(base, 'clips');
  await mkdir(imagesDir, { recursive: true });
  await mkdir(clipsDir, { recursive: true });

  const output: any[] = [];
  for (const scene of scenePlan.scenes) {
    const imageQueries: string[] = scene.image_search_queries ?? [];
    const clipQueries: string[] = scene.youtube_clip_search_queries ?? [];

    const imageCandidates = (await Promise.all(imageQueries.map((q) => braveImageSearch(q, 5)))).flat();
    const clipCandidates = (await Promise.all(clipQueries.map((q) => searchYoutube(q, 3)))).flat();

    const downloaded: string[] = [];
    for (const clip of clipCandidates.slice(0, 2)) {
      const path = await downloadYoutubeClip(clip.id, clipsDir);
      downloaded.push(path);
    }

    output.push({
      scene_id: scene.scene_id,
      image_candidates: imageCandidates,
      youtube_candidates: clipCandidates,
      downloaded_clips: downloaded
    });
  }

  const outPath = join(projectRoot, 'assets', 'candidates', 'asset_candidates.json');
  await writeJson(outPath, { scenes: output });
  return outPath;
}
