import { format } from 'date-fns';
import type { Task } from '../types';

// Helper to grab the token from local storage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const mapToFrontendTask = (dto: any): Task => {
  const dateObj = new Date(dto.dueDate);
  const hasTime = format(dateObj, 'HH:mm') !== '00:00'; 
  
  return {
    id: dto.id,
    name: dto.name,
    datetime: dateObj.toISOString(), 
    hasTime: hasTime,
    tags: dto.tags || [], 
    severity: dto.severity,
    isCompleted: dto.isCompleted
  };
};

export const fetchTasks = async (startDate: string, endDate: string, tags: string[] = []): Promise<Task[]> => {
  let url = `/api/v1/tasks?startDate=${startDate}&endDate=${endDate}`;
  
  if (tags.length > 0) {
    url += `&tags=${tags.join(',')}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch tasks');
  const data = await response.json();
  return data.map(mapToFrontendTask);
};

export const fetchUpcomingTasks = async (limit: number = 10): Promise<Task[]> => {
  const response = await fetch(`/api/v1/tasks/upcoming?limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch upcoming tasks');
  const data = await response.json();
  return data.map(mapToFrontendTask);
};

export const createTask = async (taskData: any): Promise<string> => {
  const response = await fetch('/api/v1/tasks', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.text(); 
};

export const updateTask = async ({ id, data }: { id: string, data: any }): Promise<Task> => {
  const response = await fetch(`/api/v1/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update task');
  const updatedTask = await response.json();
  return mapToFrontendTask(updatedTask);
};

export const toggleTaskComplete = async ({ id, isCurrentlyCompleted }: { id: string, isCurrentlyCompleted: boolean }): Promise<Task> => {
  const endpoint = isCurrentlyCompleted ? 'uncomplete' : 'complete';
  const response = await fetch(`/api/v1/tasks/${id}/${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error(`Failed to ${endpoint} task`);
  const updatedTask = await response.json();
  return mapToFrontendTask(updatedTask);
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`/api/v1/tasks/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete task');
};