import { run } from '../../utils/shell.js';

export async function renderWithRemotion(entryFile: string, compositionId: string, outputFile: string) {
  await run('npx', ['remotion', 'render', entryFile, compositionId, outputFile]);
}
