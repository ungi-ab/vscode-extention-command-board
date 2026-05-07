import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { ResolvedWorkspaceConfig, WorkspaceConfig } from './types';

const SECTION = 'commandBoard';

export function loadWorkspaces(): ResolvedWorkspaceConfig[] {
  const raw = vscode.workspace
    .getConfiguration(SECTION)
    .get<WorkspaceConfig[]>('workspaces', []);

  return raw
    .filter(isValidWorkspaceConfig)
    .map((ws) => ({
      ...ws,
      resolvedPath: resolvePath(ws.path),
    }));
}

export function getReuseTerminal(): boolean {
  return vscode.workspace.getConfiguration(SECTION).get<boolean>('reuseTerminal', true);
}

export function onConfigChanged(listener: () => void): vscode.Disposable {
  return vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration(SECTION)) {
      listener();
    }
  });
}

export function openSettings(): Thenable<void> {
  return vscode.commands.executeCommand(
    'workbench.action.openSettings',
    `@id:${SECTION}.workspaces`,
  ) as Thenable<void>;
}

function isValidWorkspaceConfig(ws: unknown): ws is WorkspaceConfig {
  if (!ws || typeof ws !== 'object') return false;
  const w = ws as Partial<WorkspaceConfig>;
  if (typeof w.name !== 'string' || !w.name) return false;
  if (typeof w.path !== 'string' || !w.path) return false;
  if (!Array.isArray(w.commands)) return false;
  return w.commands.every(
    (c) =>
      c &&
      typeof c === 'object' &&
      typeof c.label === 'string' &&
      typeof c.command === 'string',
  );
}

function resolvePath(input: string): string {
  let result = input;

  result = result.replace(/\$\{workspaceFolder\}/g, () => {
    const folder = vscode.workspace.workspaceFolders?.[0];
    return folder ? folder.uri.fsPath : '';
  });

  result = result.replace(/\$\{userHome\}/g, () => os.homedir());

  result = result.replace(/\$\{env:([^}]+)\}/g, (_, name: string) => {
    return process.env[name] ?? '';
  });

  if (result.startsWith('~')) {
    result = path.join(os.homedir(), result.slice(1));
  }

  return path.normalize(result);
}
