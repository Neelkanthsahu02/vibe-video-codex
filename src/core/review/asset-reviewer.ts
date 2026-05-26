import { askOpenRouter } from '../../utils/openrouter.js';
import { readJson, writeJson } from '../../utils/fs.js';

export async function reviewAssetCandidates(candidatesPath: string, outPath: string) {
  const data = await readJson<any>(candidatesPath);
  const reviews: any[] = [];

  for (const scene of data.scenes) {
    for (const candidate of scene.image_candidates ?? []) {
      const prompt = `Review image candidate for scene ${scene.scene_id}. URL: ${candidate.url}. Return JSON: accept_or_reject,relevance_score,quality_score,reason,suggested_crop,suggested_motion,best_use_case.`;
      const content = await askOpenRouter([
        { role: 'system', content: 'You are a strict visual QC reviewer. Return JSON only.' },
        { role: 'user', content: prompt }
      ]);
      reviews.push({ scene_id: scene.scene_id, asset_path: candidate.url, ...JSON.parse(content) });
    }

    for (const clip of scene.downloaded_clips ?? []) {
      reviews.push({
        scene_id: scene.scene_id,
        asset_path: clip,
        accept_or_reject: 'accept',
        relevance_score: 0.7,
        quality_score: 0.7,
        reason: 'Downloaded from scene query; requires manual pass for final quality.',
        suggested_crop: '16:9 center',
        suggested_motion: 'static',
        best_use_case: 'b-roll or context clip'
      });
    }
  }

  await writeJson(outPath, { assets: reviews });
  return outPath;
}
