import { Command } from 'commander';
import { buildRemotionTimeline } from '../core/timeline/remotion-timeline-builder.js';

const program = new Command();
program.requiredOption('--scene-plan <path>').requiredOption('--approved-assets <path>').requiredOption('--out <path>');
program.parse();
const opts = program.opts();

await buildRemotionTimeline({ scenePlanPath: opts.scenePlan, approvedAssetsPath: opts.approvedAssets, outputPath: opts.out });
console.log(`Timeline spec generated: ${opts.out}`);
