import { askOpenRouter } from '../../utils/openrouter.js';
import { buildVisionBeatPrompt } from '../../prompts/vision-beat-prompt.js';

export async function analyzeBeatVision(sceneIndex: number, start: number, end: number, framePaths: string[]) {
  const content = buildVisionBeatPrompt({ sceneIndex, start, end, framePaths });
  const response = await askOpenRouter([
    { role: 'system', content: 'You are a strict video editing analyst. Respond with valid JSON only.' },
    { role: 'user', content }
  ]);
  return JSON.parse(response);
}
