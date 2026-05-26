export function buildVisionBeatPrompt(input: { sceneIndex: number; start: number; end: number; framePaths: string[] }) {
  return `Analyze beat ${input.sceneIndex} from ${input.start}s to ${input.end}s.\nFrames:\n${input.framePaths.join('\n')}\nReturn JSON keys: visual_summary, likely_asset_type, camera_movement (array), text_overlays (array), title_cards (array), lower_thirds (array), transition_in, transition_out, emotional_purpose, music_mood, music_intensity.`;
}
