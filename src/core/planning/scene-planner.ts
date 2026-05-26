import { writeJson } from '../../utils/fs.js';
import type { ChannelStyleProfile } from '../../types/domain.js';

export async function buildScenePlan(params: {
  script: string;
  voiceoverDurationSec: number;
  profile: ChannelStyleProfile;
  outputPath: string;
}) {
  const lines = params.script.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const beatDuration = Math.max(2, params.profile.average_beat_duration || 4);
  const scenes = lines.map((line, i) => {
    const start = i * beatDuration;
    const end = Math.min(params.voiceoverDurationSec, start + beatDuration);
    return {
      scene_id: `scene_${String(i + 1).padStart(3, '0')}`,
      start_time: start,
      end_time: end,
      narration_text: line,
      beat_summary: line.slice(0, 160),
      emotional_tone: 'derived_from_text',
      script_function: i === 0 ? 'intro' : 'context',
      visual_goal: 'Match style profile pacing and emotional intent',
      asset_type_needed: ['celebrity_photo', 'headline_screenshot'],
      image_search_queries: [],
      youtube_clip_search_queries: [],
      headline_search_queries: [],
      suggested_visual_layout: 'single_focus_with_blur_bg',
      camera_motion: 'slow_zoom_in',
      overlay_text: '',
      lower_third_text: '',
      title_card_text: '',
      motion_graphic_instruction: '',
      transition_in: 'style_profile_default',
      transition_out: 'style_profile_default',
      sfx_suggestion: 'style_profile_default',
      music_mood: params.profile.editing_mood,
      editing_notes: params.profile.pacing_rules.join(' '),
      style_library_rule_used: 'average_beat_duration + pacing_rules'
    };
  });

  await writeJson(params.outputPath, { scenes });
  return scenes;
}
