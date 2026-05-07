import * as vscode from 'vscode';
import { loadWorkspaces } from './config';
import { Runner } from './runner';
import { CommandItem, Item, WorkspaceItem } from './treeItems';

export class WorkspaceTreeProvider implements vscode.TreeDataProvider<Item> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<Item | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private readonly runner: Runner) {
    runner.onStateChanged(() => this.refresh());
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Item): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Item): vscode.ProviderResult<Item[]> {
    if (!element) {
      return loadWorkspaces().map((ws) => new WorkspaceItem(ws));
    }

    if (element.kind === 'workspace') {
      return element.workspace.commands.map(
        (cmd) =>
          new CommandItem(
            element.workspace,
            cmd,
            this.runner.isRunning(element.workspace, cmd),
          ),
      );
    }

    return [];
  }
}
