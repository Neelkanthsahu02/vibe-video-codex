import { writeJson } from '../../utils/fs.js';
import { askOpenRouter } from '../../utils/openrouter.js';
import { scenePlanningPrompt } from '../../prompts/scene-planning-prompt.js';
import type { ChannelStyleProfile } from '../../types/domain.js';

type ScriptFunction =
  | 'intro'
  | 'context'
  | 'setup'
  | 'betrayal'
  | 'scandal'
  | 'reveal'
  | 'emotional_reflection'
  | 'timeline_explanation'
  | 'public_reaction'
  | 'ending';

interface ScenePlanItem {
  scene_id: string;
  start_time: number;
  end_time: number;
  narration_text: string;
  beat_summary: string;
  emotional_tone: string;
  script_function: ScriptFunction;
  visual_goal: string;
  asset_type_needed: string[];
  image_search_queries: string[];
  youtube_clip_search_queries: string[];
  headline_search_queries: string[];
  suggested_visual_layout: string;
  camera_motion: string;
  overlay_text: string;
  lower_third_text: string;
  title_card_text: string;
  motion_graphic_instruction: string;
  transition_in: string;
  transition_out: string;
  sfx_suggestion: string;
  music_mood: string;
  editing_notes: string;
  style_library_rule_used: string;
}

function splitScriptIntoBeats(script: string): string[] {
  return script
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function allocateTimings(beats: string[], totalDuration: number): Array<{ start: number; end: number }> {
  const wordCounts = beats.map((b) => b.split(/\s+/).length);
  const totalWords = wordCounts.reduce((a, b) => a + b, 0) || 1;
  let cursor = 0;
  return beats.map((_, i) => {
    const dur = (wordCounts[i] / totalWords) * totalDuration;
    const start = cursor;
    const end = i === beats.length - 1 ? totalDuration : Math.min(totalDuration, cursor + dur);
    cursor = end;
    return { start, end };
  });
}

function heuristicPlan(beatText: string, profile: ChannelStyleProfile, index: number, count: number): Omit<ScenePlanItem, 'scene_id' | 'start_time' | 'end_time' | 'narration_text'> {
  const lower = beatText.toLowerCase();
  const isEnding = index === count - 1;
  const scriptFunction: ScriptFunction = isEnding
    ? 'ending'
    : /reveal|truth|finally|exposed/.test(lower)
      ? 'reveal'
      : /scandal|controversy|affair|lawsuit/.test(lower)
        ? 'scandal'
        : /timeline|years|before|after|then/.test(lower)
          ? 'timeline_explanation'
          : index === 0
            ? 'intro'
            : 'context';

  return {
    beat_summary: beatText.slice(0, 180),
    emotional_tone: /sad|heartbreak|cry|emotional/.test(lower) ? 'emotional' : 'dramatic',
    script_function: scriptFunction,
    visual_goal: 'Support narration with source-accurate visuals and style-profile pacing.',
    asset_type_needed: ['celebrity_photo', 'headline_screenshot', 'interview_clip'],
    image_search_queries: [`${beatText} celebrity`, `${beatText} event photo`],
    youtube_clip_search_queries: [`${beatText} interview`, `${beatText} red carpet`],
    headline_search_queries: [`${beatText} news headline`],
    suggested_visual_layout: 'single_focus_with_blurred_fill',
    camera_motion: 'slow_zoom_in',
    overlay_text: '',
    lower_third_text: '',
    title_card_text: scriptFunction === 'reveal' ? 'REVEAL' : '',
    motion_graphic_instruction:
      scriptFunction === 'timeline_explanation' ? 'Build timeline card with dated nodes and relationship connectors.' : '',
    transition_in: profile.transition_rules[0] ?? 'hard_cut',
    transition_out: profile.transition_rules[0] ?? 'hard_cut',
    sfx_suggestion: profile.sfx_rules[0] ?? 'light_whoosh',
    music_mood: profile.editing_mood,
    editing_notes: profile.pacing_rules.join(' '),
    style_library_rule_used: 'pacing_rules + transition_rules + music_rules'
  };
}

async function modelPlan(beatText: string, profile: ChannelStyleProfile, index: number, count: number) {
  const content = scenePlanningPrompt({ profile, beatText, beatIndex: index + 1, beatCount: count });
  const response = await askOpenRouter([
    { role: 'system', content: 'Return strict JSON only. No markdown.' },
    { role: 'user', content }
  ]);
  return JSON.parse(response);
}

export async function buildScenePlan(params: {
  script: string;
  voiceoverDurationSec: number;
  profile: ChannelStyleProfile;
  outputPath: string;
}) {
  const beats = splitScriptIntoBeats(params.script);
  const times = allocateTimings(beats, params.voiceoverDurationSec);

  const scenes: ScenePlanItem[] = [];
  for (let i = 0; i < beats.length; i += 1) {
    const beatText = beats[i];
    let plan: any;
    try {
      plan = await modelPlan(beatText, params.profile, i, beats.length);
    } catch {
      plan = heuristicPlan(beatText, params.profile, i, beats.length);
    }

    scenes.push({
      scene_id: `scene_${String(i + 1).padStart(3, '0')}`,
      start_time: times[i].start,
      end_time: times[i].end,
      narration_text: beatText,
      ...plan
    });
  }

  await writeJson(params.outputPath, { scenes });
  return scenes;
}
