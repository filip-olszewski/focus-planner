import type { Tag } from '../types';

// Helper to grab the token from local storage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch('/api/v1/tags', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
};

export const createTag = async (value: string): Promise<Tag> => {
  const response = await fetch('/api/v1/tags', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ value }),
  });
  if (!response.ok) throw new Error('Failed to create tag');
  return response.json();
};

export const deleteTag = async (id: string): Promise<void> => {
  const response = await fetch(`/api/v1/tags/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete tag');
};