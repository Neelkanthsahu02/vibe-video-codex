import { Command } from 'commander';
import { join } from 'node:path';
import { reviewAssetCandidates } from '../core/review/asset-reviewer.js';

const program = new Command();
program.requiredOption('--project-root <path>');
program.parse();
const opts = program.opts();

const inPath = join(opts.projectRoot, 'assets', 'candidates', 'asset_candidates.json');
const outPath = join(opts.projectRoot, 'assets', 'approved', 'asset_review.json');
const out = await reviewAssetCandidates(inPath, outPath);
console.log(`Asset review saved: ${out}`);
