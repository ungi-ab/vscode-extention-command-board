import * as path from 'path';
import * as vscode from 'vscode';
import { CommandConfig, ResolvedWorkspaceConfig } from './types';

export class WorkspaceItem extends vscode.TreeItem {
  readonly kind = 'workspace' as const;

  constructor(public readonly workspace: ResolvedWorkspaceConfig) {
    super(workspace.name, vscode.TreeItemCollapsibleState.Expanded);
    this.iconPath = new vscode.ThemeIcon('repo');
    this.description = shortenPath(workspace.resolvedPath);
    this.tooltip = workspace.resolvedPath;
    this.contextValue = 'workspace';
  }
}

export class CommandItem extends vscode.TreeItem {
  readonly kind = 'command' as const;

  constructor(
    public readonly workspace: ResolvedWorkspaceConfig,
    public readonly commandConfig: CommandConfig,
    public readonly running: boolean,
  ) {
    super(commandConfig.label, vscode.TreeItemCollapsibleState.None);
    this.description = commandConfig.command;
    this.tooltip = `${commandConfig.command}\ncwd: ${workspace.resolvedPath}`;
    this.iconPath = new vscode.ThemeIcon(running ? 'sync~spin' : 'play');
    this.contextValue = running ? 'command-running' : 'command-idle';
    this.command = {
      command: 'commandBoard.runCommand',
      title: 'Run',
      arguments: [this],
    };
  }
}

export type Item = WorkspaceItem | CommandItem;

function shortenPath(fullPath: string): string {
  const parts = fullPath.split(path.sep).filter(Boolean);
  if (parts.length <= 2) return fullPath;
  return `…/${parts.slice(-2).join('/')}`;
}
