export interface CommandConfig {
  label: string;
  command: string;
  env?: Record<string, string>;
}

export interface WorkspaceConfig {
  name: string;
  path: string;
  commands: CommandConfig[];
}

export interface ResolvedWorkspaceConfig extends WorkspaceConfig {
  resolvedPath: string;
}
