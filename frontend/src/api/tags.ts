import type { Tag } from '../types';

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch('/api/v1/tags');
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
};

export const createTag = async (value: string): Promise<Tag> => {
  const response = await fetch('/api/v1/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  if (!response.ok) throw new Error('Failed to create tag');
  return response.json();
};

export const deleteTag = async (id: string): Promise<void> => {
  const response = await fetch(`/api/v1/tags/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete tag');
};