import { basename, join } from 'node:path';
import { mkdir, readdir } from 'node:fs/promises';
import { probeVideo } from './video-metadata.js';
import { extractFrames } from './frame-extractor.js';
import { detectScenes } from './scene-detector.js';
import { analyzeBeatVision } from './vision-analyzer.js';
import { analyzeAudioSfx } from './audio-sfx-analyzer.js';
import type { VideoAnalysis } from '../../types/domain.js';
import { writeJson, writeText } from '../../utils/fs.js';

export async function analyzeVideo(params: {
  videoPath: string;
  outputDir: string;
  sfxDir: string;
}) {
  const { videoPath, outputDir, sfxDir } = params;
  await mkdir(outputDir, { recursive: true });

  const metadata = await probeVideo(videoPath);
  const scenes = await detectScenes(videoPath);

  const beats = [];
  for (let i = 0; i < scenes.length; i += 1) {
    const scene = scenes[i];
    const beatDir = join(outputDir, 'frames', `beat_${String(i + 1).padStart(4, '0')}`);
    await extractFrames(videoPath, beatDir, 1, { startSec: scene.start, endSec: scene.end });
    const frameFiles = (await readdir(beatDir)).slice(0, 5).map((f) => join(beatDir, f));
    const vision = await analyzeBeatVision(i + 1, scene.start, scene.end, frameFiles);

    beats.push({
      beat_id: `beat_${String(i + 1).padStart(4, '0')}`,
      start_time: scene.start,
      end_time: scene.end,
      duration: scene.duration,
      visual_summary: vision.visual_summary,
      likely_asset_type: vision.likely_asset_type,
      camera_movement: vision.camera_movement,
      text_overlays: vision.text_overlays,
      title_cards: vision.title_cards,
      lower_thirds: vision.lower_thirds,
      transition_in: vision.transition_in,
      transition_out: vision.transition_out,
      likely_sfx: [],
      music_mood_intensity: { mood: vision.music_mood, intensity: vision.music_intensity },
      emotional_purpose: vision.emotional_purpose
    });
  }

  const sfxMatches = await analyzeAudioSfx(videoPath, sfxDir);

  const averageBeatDuration = beats.length ? beats.reduce((sum, b) => sum + b.duration, 0) / beats.length : 0;
  const analysis: VideoAnalysis = {
    video_path: videoPath,
    global: {
      ...metadata,
      average_visual_change_frequency: averageBeatDuration > 0 ? 1 / averageBeatDuration : 0,
      average_beat_duration: averageBeatDuration,
      total_visual_changes: Math.max(0, beats.length - 1),
      intro_editing_pattern: beats.slice(0, 5).map((b) => b.visual_summary).join(' | '),
      ending_editing_pattern: beats.slice(-5).map((b) => b.visual_summary).join(' | '),
      overall_editing_mood: 'derived_from_beats'
    },
    beats,
    visual_style_rules: {
      pacing_style: 'derived_from_scene_durations',
      text_placement: 'detected_by_vision_module'
    },
    transitions: beats.map((b) => ({ at: b.start_time, transition_in: b.transition_in, transition_out: b.transition_out })),
    sfx_matches: sfxMatches,
    music_analysis: { method: 'vision+mood heuristics per beat' },
    motion_graphics: beats.filter((b) => b.likely_asset_type === 'motion_graphic').map((b) => ({ beat_id: b.beat_id, at: b.start_time }))
  };

  await writeJson(join(outputDir, 'video_analysis.json'), analysis);
  await writeJson(join(outputDir, 'detected_assets.json'), {
    transitions: analysis.transitions,
    sfx_matches: analysis.sfx_matches,
    motion_graphics: analysis.motion_graphics
  });
  await writeJson(join(outputDir, 'asset_usage_report.json'), {
    used_sfx: analysis.sfx_matches,
    used_transitions: analysis.transitions,
    music: analysis.music_analysis
  });
  await writeText(
    join(outputDir, 'style_summary.md'),
    `# Style Summary for ${basename(videoPath)}\n\nAverage beat duration: ${averageBeatDuration.toFixed(2)}s\nTotal beats: ${beats.length}\n`
  );

  return analysis;
}
