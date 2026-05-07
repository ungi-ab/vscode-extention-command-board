import * as fs from 'fs';
import * as vscode from 'vscode';
import { getReuseTerminal } from './config';
import { CommandConfig, ResolvedWorkspaceConfig } from './types';

export class Runner implements vscode.Disposable {
  private readonly terminals = new Map<string, vscode.Terminal>();
  private readonly _onStateChanged = new vscode.EventEmitter<void>();
  readonly onStateChanged = this._onStateChanged.event;
  private readonly disposables: vscode.Disposable[] = [];

  constructor() {
    this.disposables.push(
      vscode.window.onDidCloseTerminal((closed) => {
        for (const [key, term] of this.terminals) {
          if (term === closed) {
            this.terminals.delete(key);
            this._onStateChanged.fire();
          }
        }
      }),
    );
  }

  isRunning(workspace: ResolvedWorkspaceConfig, command: CommandConfig): boolean {
    return this.terminals.has(makeKey(workspace, command));
  }

  async runCommand(
    workspace: ResolvedWorkspaceConfig,
    command: CommandConfig,
    options: { forceNew?: boolean } = {},
  ): Promise<void> {
    if (!fs.existsSync(workspace.resolvedPath)) {
      vscode.window.showErrorMessage(
        `[Command Board] パスが存在しません: ${workspace.resolvedPath}`,
      );
      return;
    }

    const key = makeKey(workspace, command);
    const existing = this.terminals.get(key);

    if (existing && !options.forceNew && getReuseTerminal()) {
      existing.show(false);
      return;
    }

    if (existing) {
      existing.dispose();
      this.terminals.delete(key);
    }

    const terminal = vscode.window.createTerminal({
      name: `${workspace.name}: ${command.label}`,
      cwd: workspace.resolvedPath,
      env: command.env,
      iconPath: new vscode.ThemeIcon('play'),
    });

    this.terminals.set(key, terminal);
    terminal.show(false);
    terminal.sendText(command.command, true);
    this._onStateChanged.fire();
  }

  stopCommand(workspace: ResolvedWorkspaceConfig, command: CommandConfig): void {
    const key = makeKey(workspace, command);
    const terminal = this.terminals.get(key);
    if (!terminal) return;
    terminal.dispose();
    this.terminals.delete(key);
    this._onStateChanged.fire();
  }

  restartCommand(workspace: ResolvedWorkspaceConfig, command: CommandConfig): void {
    const key = makeKey(workspace, command);
    const existing = this.terminals.get(key);
    if (existing) {
      existing.dispose();
      this.terminals.delete(key);
    }
    void this.runCommand(workspace, command, { forceNew: true });
  }

  dispose(): void {
    for (const term of this.terminals.values()) {
      term.dispose();
    }
    this.terminals.clear();
    this._onStateChanged.dispose();
    for (const d of this.disposables) {
      d.dispose();
    }
  }
}

function makeKey(workspace: ResolvedWorkspaceConfig, command: CommandConfig): string {
  return `${workspace.name}::${command.label}`;
}
