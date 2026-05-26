import type { ChannelStyleProfile, VideoAnalysis } from '../../types/domain.js';
import { writeJson } from '../../utils/fs.js';

export async function buildChannelStyleProfile(params: {
  channelName: string;
  niche: string;
  analyses: VideoAnalysis[];
  outputPath: string;
}): Promise<ChannelStyleProfile> {
  const { channelName, niche, analyses, outputPath } = params;
  const avgBeat = analyses.length
    ? analyses.reduce((s, v) => s + v.global.average_beat_duration, 0) / analyses.length
    : 0;
  const avgChange = analyses.length
    ? analyses.reduce((s, v) => s + v.global.average_visual_change_frequency, 0) / analyses.length
    : 0;

  const profile: ChannelStyleProfile = {
    channel_name: channelName,
    niche,
    editing_mood: 'emotional_gossip_documentary',
    average_visual_change_seconds: avgChange === 0 ? 0 : 1 / avgChange,
    average_beat_duration: avgBeat,
    asset_ratio_rules: {
      celebrity_photo: 0.3,
      headline_screenshot: 0.2,
      interview_clip: 0.2,
      motion_graphic: 0.1,
      mixed_layout: 0.2
    },
    pacing_rules: ['Keep cuts near channel average beat duration.', 'Increase cut frequency at reveal/scandal beats.'],
    intro_rules: ['Fast hook visuals in first 10-20 seconds.'],
    ending_rules: ['Return to emotional recap visuals with calmer pacing.'],
    image_treatment_rules: ['Use Ken Burns slow zoom and blur fill for portrait images.'],
    clip_treatment_rules: ['Prefer short reaction/interview clips under 4 seconds unless timeline explanation.'],
    headline_screenshot_rules: ['Use headline cards during scandal/public reaction beats.'],
    title_card_rules: ['Use title cards at chapter boundaries and reveals.'],
    lower_third_rules: ['Introduce people with consistent lower third template and role/date context.'],
    transition_rules: ['Use matched pack transitions by beat emotion; avoid overusing glitch transitions.'],
    sfx_rules: ['Layer whooshes/impacts on title cards and reveals at detected style timestamps.'],
    music_rules: ['Duck music under narration and increase intensity during reveals.'],
    motion_graphic_rules: ['Use timeline/relationship/money graphics for explanatory segments.'],
    emotional_editing_rules: ['Emotional reflection beats use longer holds, softer transitions, lower music intensity.'],
    do_rules: ['Use only real sourced images/clips relevant to script entities.'],
    avoid_rules: ['No AI-generated visuals unless explicitly approved.', 'No random stock footage.'],
    examples_from_reference_videos: analyses.map((a) => ({ video_path: a.video_path, note: a.global.intro_editing_pattern })),
    confidence_score: Math.min(0.95, 0.5 + analyses.length * 0.08)
  };

  await writeJson(outputPath, profile);
  return profile;
}
