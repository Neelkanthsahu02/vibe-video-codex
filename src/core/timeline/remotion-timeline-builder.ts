import { writeJson } from '../../utils/fs.js';

export async function buildRemotionTimeline(params: {
  scenePlanPath: string;
  approvedAssetsPath: string;
  outputPath: string;
}) {
  const timeline = {
    composition: {
      width: 1920,
      height: 1080,
      fps: 30,
      format: 'mp4'
    },
    inputs: {
      scene_plan: params.scenePlanPath,
      approved_assets: params.approvedAssetsPath
    },
    notes: [
      'Timeline maps scene beats to visual layers, transitions, and audio ducking metadata.',
      'Render with Remotion CLI in local environment.'
    ]
  };
  await writeJson(params.outputPath, timeline);
  return timeline;
}
