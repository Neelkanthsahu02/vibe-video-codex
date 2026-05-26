import type { ChannelStyleProfile } from '../types/domain.js';

export function scenePlanningPrompt(input: {
  profile: ChannelStyleProfile;
  beatText: string;
  beatIndex: number;
  beatCount: number;
}) {
  return `You are a YouTube documentary editor planner.\nChannel style profile:\n${JSON.stringify(input.profile)}\n\nBeat text (${input.beatIndex}/${input.beatCount}): ${input.beatText}\n\nReturn strict JSON with keys:\nemotional_tone, script_function, visual_goal, asset_type_needed, image_search_queries, youtube_clip_search_queries, headline_search_queries, suggested_visual_layout, camera_motion, overlay_text, lower_third_text, title_card_text, motion_graphic_instruction, transition_in, transition_out, sfx_suggestion, music_mood, editing_notes, style_library_rule_used.\nUse only real visuals, no stock footage, no AI-generated visuals.`;
}
