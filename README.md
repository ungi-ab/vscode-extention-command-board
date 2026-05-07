# Command Board

複数の Git worktree / リポジトリで `pnpm dev` などのコマンドを、サイドバーのボタン1つで実行できる VSCode / Cursor 拡張機能です。
ターミナルを開いて `cd` する手間なく、各ワークツリーで Claude Code や開発サーバーを並行起動できます。

## 特徴

- 左サイドバーにワークスペース専用ビューを追加
- ワークツリーごとに登録したコマンドをツリー表示
- ▶︎ アイコンで該当ディレクトリに統合ターミナルを開いて実行
- ⏹ アイコンで実行中ターミナルを停止
- 同じコマンドを再実行すると既存ターミナルを再フォーカス（連打安全）
- フォルダアイコンからワークツリーを Finder で開ける

## 必要環境

- VSCode `1.85.0` 以上 / Cursor 最新版
- Node.js + pnpm（ビルド時のみ）

## インストール

### Cursor / VSCode に VSIX を入れる方法

1. リリースから `vscode-extention-command-board-x.y.z.vsix` を取得（または下記の手順で自分でビルド）
2. インストール:

   ```bash
   # Cursor の場合
   cursor --install-extension vscode-extention-command-board-x.y.z.vsix

   # VSCode の場合
   code --install-extension vscode-extention-command-board-x.y.z.vsix
   ```

   または `Cmd + Shift + P` → `Extensions: Install from VSIX...` から選択。

### ソースからビルド

```bash
pnpm install
pnpm run package    # vscode-extention-command-board-x.y.z.vsix が生成される
```

### 開発時（F5デバッグ）

```bash
pnpm install
pnpm run compile
```

`F5` を押すと「Extension Development Host」が起動します。

## 使い方

1. アクティビティバーの **Command Board** アイコンをクリック
2. ビュー右上の歯車アイコンから `settings.json` を開いて `commandBoard.workspaces` を設定
3. ツリーに表示されたコマンドの ▶︎ をクリックすると、ワークツリー内で統合ターミナルが起動

## 設定例

`settings.json` (User または Workspace) に以下を追加します。

```jsonc
{
  "commandBoard.workspaces": [
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
        {
          "label": "dev",
          "command": "pnpm dev",
          "env": { "PORT": "4000" }
        }
      ]
    }
  ],
  "commandBoard.reuseTerminal": true
}
```

### パス指定で使える変数

| 変数 | 内容 |
| --- | --- |
| `${workspaceFolder}` | 現在開いている1つ目のワークスペースフォルダ |
| `${env:VAR}` | 環境変数 `VAR` の値 |
| `${userHome}` | `$HOME` |

### 設定オプション

| キー | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `commandBoard.workspaces` | `array` | `[]` | ワークツリーと実行コマンドの一覧 |
| `commandBoard.reuseTerminal` | `boolean` | `true` | 同じコマンド再実行時に既存ターミナルへフォーカス |

## 公開コマンド

| Command ID | 用途 |
| --- | --- |
| `commandBoard.runCommand` | コマンドを実行 |
| `commandBoard.stopCommand` | 実行中ターミナルを破棄 |
| `commandBoard.refresh` | TreeView を再描画 |
| `commandBoard.openSettings` | `settings.json` を開く |
| `commandBoard.openWorkspaceFolder` | OS のファイラで該当パスを開く |

## アンインストール / 更新

- アンインストール: 拡張機能ビューから「Command Board」を選んで `Uninstall`
- 更新: `package.json` の `version` を上げて再パッケージ → `--install-extension` で上書きインストール

## ライセンス

MIT
