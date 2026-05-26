import { z } from 'zod';

export const scenePlanSchema = z.object({
  scenes: z.array(
    z.object({
      scene_id: z.string(),
      start_time: z.number(),
      end_time: z.number(),
      narration_text: z.string(),
      beat_summary: z.string(),
      emotional_tone: z.string(),
      script_function: z.enum([
        'intro',
        'context',
        'setup',
        'betrayal',
        'scandal',
        'reveal',
        'emotional_reflection',
        'timeline_explanation',
        'public_reaction',
        'ending'
      ]),
      visual_goal: z.string(),
      asset_type_needed: z.array(z.string()),
      image_search_queries: z.array(z.string()),
      youtube_clip_search_queries: z.array(z.string()),
      headline_search_queries: z.array(z.string()),
      suggested_visual_layout: z.string(),
      camera_motion: z.string(),
      overlay_text: z.string(),
      lower_third_text: z.string(),
      title_card_text: z.string(),
      motion_graphic_instruction: z.string(),
      transition_in: z.string(),
      transition_out: z.string(),
      sfx_suggestion: z.string(),
      music_mood: z.string(),
      editing_notes: z.string(),
      style_library_rule_used: z.string()
    })
  )
});
