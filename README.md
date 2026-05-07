# Command Board

複数の Git worktree / リポジトリで `pnpm dev` などのコマンドを、サイドバーのボタン1つで実行できる VSCode / Cursor 拡張機能です。
ターミナルを開いて `cd` する手間なく、各ワークツリーで Claude Code や開発サーバーを並行起動できます。

## 特徴

- 左サイドバーにワークスペース専用ビューを追加
- ワークツリーごとに登録したコマンドをツリー表示
- ▶︎ アイコンで該当ディレクトリに統合ターミナルを開いて実行
- 🔄 アイコンでターミナルを破棄して再起動
- ⏹ アイコンで実行中ターミナルを停止
- 同じコマンドを再実行すると既存ターミナルを再フォーカス（連打安全）
- フォルダアイコンからワークツリーを Finder で開ける
- Workspace Trust 対応（信頼済みワークスペースのみで動作）

## 必要環境

- VSCode `1.85.0` 以上 / Cursor 最新版
- Node.js + pnpm（ビルド時のみ）

## インストール

### 方法1: GitHub Releases からインストール（推奨）

[Releases ページ](https://github.com/ungi-ab/vscode-extention-command-board/releases) から最新の `vscode-extention-command-board-x.y.z.vsix` をダウンロード。

ワンライナーで最新版を取得＆インストール:

```bash
# Cursor の場合
curl -L -o cb.vsix \
  https://github.com/ungi-ab/vscode-extention-command-board/releases/latest/download/vscode-extention-command-board-0.0.1.vsix
cursor --install-extension cb.vsix

# VSCode の場合
curl -L -o cb.vsix \
  https://github.com/ungi-ab/vscode-extention-command-board/releases/latest/download/vscode-extention-command-board-0.0.1.vsix
code --install-extension cb.vsix
```

または `Cmd + Shift + P` → `Extensions: Install from VSIX...` から選択。

### 方法2: ソースからビルド

```bash
pnpm install
pnpm run package    # vscode-extention-command-board-x.y.z.vsix が生成される
cursor --install-extension vscode-extention-command-board-0.0.1.vsix
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
| `commandBoard.restartCommand` | 実行中ターミナルを破棄して再起動 |
| `commandBoard.refresh` | TreeView を再描画 |
| `commandBoard.openSettings` | `settings.json` を開く |
| `commandBoard.openWorkspaceFolder` | OS のファイラで該当パスを開く |

## アンインストール / 更新

- **アンインストール**: 拡張機能ビューから「Command Board」を選んで `Uninstall`
- **更新（利用者）**: 新しい [Release](https://github.com/ungi-ab/vscode-extention-command-board/releases) の `.vsix` を `--install-extension` で上書きインストール
- **更新（開発者）**:
  1. `package.json` の `version` を上げる
  2. コミット & push
  3. `pnpm run package` で VSIX 生成
  4. `gh release create vX.Y.Z vscode-extention-command-board-X.Y.Z.vsix --title "vX.Y.Z" --notes "..."` でリリース公開

## ライセンス

MIT
