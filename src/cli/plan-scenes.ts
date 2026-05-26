import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { readJson } from '../utils/fs.js';
import { buildScenePlan } from '../core/planning/scene-planner.js';
import { probeAudioDuration } from '../core/analysis/audio-metadata.js';

const program = new Command();
program.requiredOption('--script <path>').requiredOption('--voiceover <path>').requiredOption('--profile <path>').requiredOption('--out <path>');
program.parse();
const opts = program.opts();

const script = await readFile(opts.script, 'utf-8');
const profile = await readJson<any>(opts.profile);
const voiceoverDurationSec = await probeAudioDuration(opts.voiceover);

await buildScenePlan({ script, voiceoverDurationSec, profile, outputPath: opts.out });
console.log(`Scene plan generated: ${opts.out}`);
