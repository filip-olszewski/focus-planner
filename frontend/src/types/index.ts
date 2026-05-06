export interface Tag {
  id: string;
  slug: string;
  value: string;
}

export interface Task {
  id?: string;
  name: string;
  datetime: string;
  hasTime: boolean;
  tags: Tag[]; // <-- Replaced 'type: string' with 'tags: Tag[]'
  severity: 1 | 2 | 3 | 5 | 8 | 13 | 21;
  isCompleted: boolean;
}