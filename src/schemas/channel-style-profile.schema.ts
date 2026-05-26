import { z } from 'zod';

export const channelStyleProfileSchema = z.object({
  channel_name: z.string(),
  niche: z.string(),
  editing_mood: z.string(),
  average_visual_change_seconds: z.number(),
  average_beat_duration: z.number(),
  asset_ratio_rules: z.record(z.number()),
  pacing_rules: z.array(z.string()),
  intro_rules: z.array(z.string()),
  ending_rules: z.array(z.string()),
  image_treatment_rules: z.array(z.string()),
  clip_treatment_rules: z.array(z.string()),
  headline_screenshot_rules: z.array(z.string()),
  title_card_rules: z.array(z.string()),
  lower_third_rules: z.array(z.string()),
  transition_rules: z.array(z.string()),
  sfx_rules: z.array(z.string()),
  music_rules: z.array(z.string()),
  motion_graphic_rules: z.array(z.string()),
  emotional_editing_rules: z.array(z.string()),
  do_rules: z.array(z.string()),
  avoid_rules: z.array(z.string()),
  examples_from_reference_videos: z.array(z.object({ video_path: z.string(), note: z.string() })),
  confidence_score: z.number()
});
