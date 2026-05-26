import { readJson, writeJson } from '../../utils/fs.js';

export async function buildRemotionTimeline(params: {
  scenePlanPath: string;
  approvedAssetsPath: string;
  outputPath: string;
  voiceoverPath?: string;
  musicLibraryPath?: string;
}) {
  const scenePlan = await readJson<any>(params.scenePlanPath);
  const reviews = await readJson<any>(params.approvedAssetsPath);
  const approved = (reviews.assets ?? []).filter((a: any) => a.accept_or_reject === 'accept');

  const tracks = scenePlan.scenes.map((scene: any) => {
    const sceneAssets = approved.filter((a: any) => a.scene_id === scene.scene_id).slice(0, 3);
    return {
      scene_id: scene.scene_id,
      from: scene.start_time,
      to: scene.end_time,
      visuals: sceneAssets,
      transition_in: scene.transition_in,
      transition_out: scene.transition_out,
      sfx: scene.sfx_suggestion,
      music_mood: scene.music_mood
    };
  });

  const timeline = {
    composition: { width: 1920, height: 1080, fps: 30, format: 'mp4' },
    voiceover: params.voiceoverPath ?? null,
    music_library: params.musicLibraryPath ?? 'asset-library/music',
    tracks,
    render_notes: ['Use Remotion compositions to map each track to Sequence blocks.', 'Duck background music when voiceover waveform exceeds threshold.']
  };

  await writeJson(params.outputPath, timeline);
  return timeline;
}
