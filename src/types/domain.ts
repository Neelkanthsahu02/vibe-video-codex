export type AssetType =
  | 'celebrity_photo'
  | 'event_photo'
  | 'interview_clip'
  | 'paparazzi_clip'
  | 'headline_screenshot'
  | 'social_media_screenshot'
  | 'animated_background'
  | 'title_card'
  | 'lower_third'
  | 'motion_graphic'
  | 'mixed_layout';

export type CameraMovement =
  | 'slow_zoom_in'
  | 'slow_zoom_out'
  | 'pan_left'
  | 'pan_right'
  | 'push_in'
  | 'static'
  | 'blurred_background_fill'
  | 'split_screen'
  | 'framed_image';

export interface BeatAnalysis {
  beat_id: string;
  start_time: number;
  end_time: number;
  duration: number;
  visual_summary: string;
  likely_asset_type: AssetType;
  camera_movement: CameraMovement[];
  text_overlays: string[];
  title_cards: string[];
  lower_thirds: string[];
  transition_in: string;
  transition_out: string;
  likely_sfx: Array<{ name: string; confidence: number; reason: string }>;
  music_mood_intensity: { mood: string; intensity: number };
  emotional_purpose: string;
}

export interface VideoAnalysis {
  video_path: string;
  global: {
    duration: number;
    resolution: { width: number; height: number };
    fps: number;
    average_visual_change_frequency: number;
    average_beat_duration: number;
    total_visual_changes: number;
    intro_editing_pattern: string;
    ending_editing_pattern: string;
    overall_editing_mood: string;
  };
  beats: BeatAnalysis[];
  visual_style_rules: Record<string, unknown>;
  transitions: Array<Record<string, unknown>>;
  sfx_matches: Array<Record<string, unknown>>;
  music_analysis: Record<string, unknown>;
  motion_graphics: Array<Record<string, unknown>>;
}

export interface ChannelStyleProfile {
  channel_name: string;
  niche: string;
  editing_mood: string;
  average_visual_change_seconds: number;
  average_beat_duration: number;
  asset_ratio_rules: Record<string, number>;
  pacing_rules: string[];
  intro_rules: string[];
  ending_rules: string[];
  image_treatment_rules: string[];
  clip_treatment_rules: string[];
  headline_screenshot_rules: string[];
  title_card_rules: string[];
  lower_third_rules: string[];
  transition_rules: string[];
  sfx_rules: string[];
  music_rules: string[];
  motion_graphic_rules: string[];
  emotional_editing_rules: string[];
  do_rules: string[];
  avoid_rules: string[];
  examples_from_reference_videos: Array<{ video_path: string; note: string }>;
  confidence_score: number;
}
