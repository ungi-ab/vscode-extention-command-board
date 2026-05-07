import * as vscode from 'vscode';
import { onConfigChanged, openSettings } from './config';
import { Runner } from './runner';
import { CommandItem, WorkspaceItem } from './treeItems';
import { WorkspaceTreeProvider } from './treeProvider';

export function activate(context: vscode.ExtensionContext): void {
  const runner = new Runner();
  const provider = new WorkspaceTreeProvider(runner);

  const treeView = vscode.window.createTreeView('claudeCodeManager.view', {
    treeDataProvider: provider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    runner,
    treeView,
    onConfigChanged(() => provider.refresh()),

    vscode.commands.registerCommand(
      'claudeCodeManager.runCommand',
      (item?: CommandItem) => {
        if (!item) return;
        return runner.runCommand(item.workspace, item.commandConfig);
      },
    ),

    vscode.commands.registerCommand(
      'claudeCodeManager.stopCommand',
      (item?: CommandItem) => {
        if (!item) return;
        runner.stopCommand(item.workspace, item.commandConfig);
      },
    ),

    vscode.commands.registerCommand('claudeCodeManager.refresh', () => provider.refresh()),

    vscode.commands.registerCommand('claudeCodeManager.openSettings', () => openSettings()),

    vscode.commands.registerCommand(
      'claudeCodeManager.openWorkspaceFolder',
      (item?: WorkspaceItem) => {
        if (!item) return;
        return vscode.commands.executeCommand(
          'revealFileInOS',
          vscode.Uri.file(item.workspace.resolvedPath),
        );
      },
    ),
  );
}

export function deactivate(): void {
  // no-op: registered disposables are released via context.subscriptions
}
