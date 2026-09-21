export interface Tag {
  tagID: number;
  tagName: string;
  color?: string;
}

export interface TagRequest {
  tagName: string;
  color?: string;
}