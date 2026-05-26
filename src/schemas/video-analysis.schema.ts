import { z } from 'zod';

export const videoAnalysisSchema = z.object({
  video_path: z.string(),
  global: z.object({
    duration: z.number(),
    resolution: z.object({ width: z.number(), height: z.number() }),
    fps: z.number(),
    average_visual_change_frequency: z.number(),
    average_beat_duration: z.number(),
    total_visual_changes: z.number(),
    intro_editing_pattern: z.string(),
    ending_editing_pattern: z.string(),
    overall_editing_mood: z.string()
  }),
  beats: z.array(z.any()),
  visual_style_rules: z.record(z.unknown()),
  transitions: z.array(z.record(z.unknown())),
  sfx_matches: z.array(z.record(z.unknown())),
  music_analysis: z.record(z.unknown()),
  motion_graphics: z.array(z.record(z.unknown()))
});

export type VideoAnalysisSchema = z.infer<typeof videoAnalysisSchema>;
