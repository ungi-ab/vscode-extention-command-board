import * as vscode from 'vscode';
import { onConfigChanged, openSettings } from './config';
import { Runner } from './runner';
import { CommandItem, WorkspaceItem } from './treeItems';
import { WorkspaceTreeProvider } from './treeProvider';

export function activate(context: vscode.ExtensionContext): void {
  const runner = new Runner();
  const provider = new WorkspaceTreeProvider(runner);

  const treeView = vscode.window.createTreeView('commandBoard.view', {
    treeDataProvider: provider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    runner,
    treeView,
    onConfigChanged(() => provider.refresh()),

    vscode.commands.registerCommand(
      'commandBoard.runCommand',
      (item?: CommandItem) => {
        if (!item) return;
        return runner.runCommand(item.workspace, item.commandConfig);
      },
    ),

    vscode.commands.registerCommand(
      'commandBoard.stopCommand',
      (item?: CommandItem) => {
        if (!item) return;
        runner.stopCommand(item.workspace, item.commandConfig);
      },
    ),

    vscode.commands.registerCommand(
      'commandBoard.restartCommand',
      (item?: CommandItem) => {
        if (!item) return;
        runner.restartCommand(item.workspace, item.commandConfig);
      },
    ),

    vscode.commands.registerCommand('commandBoard.refresh', () => provider.refresh()),

    vscode.commands.registerCommand('commandBoard.openSettings', () => openSettings()),

    vscode.commands.registerCommand(
      'commandBoard.openWorkspaceFolder',
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
