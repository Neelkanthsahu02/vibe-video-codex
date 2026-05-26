import { Command } from 'commander';
import { buildRemotionTimeline } from '../core/timeline/remotion-timeline-builder.js';

const program = new Command();
program
  .requiredOption('--scene-plan <path>')
  .requiredOption('--approved-assets <path>')
  .requiredOption('--out <path>')
  .option('--voiceover <path>')
  .option('--music-library <path>');
program.parse();
const opts = program.opts();

await buildRemotionTimeline({
  scenePlanPath: opts.scenePlan,
  approvedAssetsPath: opts.approvedAssets,
  outputPath: opts.out,
  voiceoverPath: opts.voiceover,
  musicLibraryPath: opts.musicLibrary
});
console.log(`Timeline spec generated: ${opts.out}`);
