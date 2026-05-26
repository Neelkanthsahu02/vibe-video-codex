import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { readJson } from '../utils/fs.js';
import { buildScenePlan } from '../core/planning/scene-planner.js';

const program = new Command();
program.requiredOption('--script <path>').requiredOption('--voiceover-seconds <number>').requiredOption('--profile <path>').requiredOption('--out <path>');
program.parse();
const opts = program.opts();
const script = await readFile(opts.script, 'utf-8');
const profile = await readJson(opts.profile);
await buildScenePlan({ script, voiceoverDurationSec: Number(opts.voiceoverSeconds), profile, outputPath: opts.out });
console.log(`Scene plan generated: ${opts.out}`);
