export interface SharedNote {
  id: string;
  x: number;
  y: number;
  color: string;
  content: string;
  author: string;
  authorId: string;
  updatedAt: number;
}

export interface SharedToggles {
  darkModeDefault: boolean;
  streamActive: boolean;
  gridSnap: boolean;
  readOnlyMode: boolean;
}

export interface SharedState {
  counter: number;
  editorText: string;
  editorActiveUser: string | null;
  notes: SharedNote[];
  toggles: SharedToggles;
}

export interface FlyingReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  username: string;
  timestamp: number;
}
