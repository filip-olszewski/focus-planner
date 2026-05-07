const API_URL = '/api/v1/auth';

export const loginUser = async (credentials: Record<string, string>) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) throw new Error('Invalid credentials');
  return response.json(); 
};

export const registerUser = async (userData: Record<string, string>) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
};