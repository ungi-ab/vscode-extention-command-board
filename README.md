# Claude Code Manager (VSCode Extension)

複数の Git worktree / リポジトリで `pnpm dev` などのコマンドを、サイドバーのボタン1つで実行できる VSCode 拡張機能。
ワークツリーへ `cd` 移動する手間なく、適切な作業ディレクトリで統合ターミナルが起動します。

## 特徴

- 左側アクティビティバーに専用アイコンを追加
- ワークツリーごとに登録したコマンドをツリー表示
- 行頭の ▶︎ アイコンクリックで該当ディレクトリに統合ターミナルを開いて実行
- 実行中は ⏹ アイコンで停止
- 既に開いているターミナルがあれば再フォーカス（連打安全）

## インストール（開発時）

```bash
pnpm install
pnpm run compile
```

`F5` を押すと「Extension Development Host」が立ち上がります。

## 設定方法

`settings.json`（User または Workspace）に以下を追加します。

```jsonc
{
  "claudeCodeManager.workspaces": [
    {
      "name": "frontend",
      "path": "/absolute/path/to/frontend",
      "commands": [
        { "label": "dev",   "command": "pnpm dev" },
        { "label": "build", "command": "pnpm build" }
      ]
    },
    {
      "name": "backend (feature/x)",
      "path": "${env:HOME}/github/backend-worktrees/feature-x",
      "commands": [
        { "label": "dev", "command": "pnpm dev" }
      ]
    }
  ]
}
```

利用可能な変数:

- `${workspaceFolder}` … 現在開いている1つ目のワークスペースフォルダ
- `${env:VAR}` … 環境変数
- `${userHome}` … `$HOME`

## 公開コマンド

| Command ID | 用途 |
| --- | --- |
| `claudeCodeManager.runCommand` | コマンドを実行 |
| `claudeCodeManager.stopCommand` | 実行中ターミナルを破棄 |
| `claudeCodeManager.refresh` | TreeView 再描画 |
| `claudeCodeManager.openSettings` | settings.json を開く |
| `claudeCodeManager.openWorkspaceFolder` | OS のファイラで該当パスを開く |

## VSIX パッケージング

```bash
pnpm run package    # claude-code-manager-x.y.z.vsix が生成される
```

VSCode の Extensions ビュー > `…` メニュー > `Install from VSIX...` で取り込めます。
