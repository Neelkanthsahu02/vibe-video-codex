import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function run(cmd: string, args: string[]): Promise<string> {
  const { stdout, stderr } = await execFileAsync(cmd, args, { maxBuffer: 1024 * 1024 * 20 });
  if (stderr && stderr.trim().length > 0) {
    return `${stdout}\n${stderr}`;
  }
  return stdout;
}
