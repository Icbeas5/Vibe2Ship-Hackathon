import { auth } from './firebase.js';

export const getAuthHeaders = async () => {
  // Check BOTH the hardcoded environment AND your manual localStorage button override
  const isDemo = 
    import.meta.env.VITE_USE_DEMO_MODE === 'true' || 
    localStorage.getItem('nova_local_demo_override') === 'true';

  if (isDemo) {
    return { 'Authorization': 'Bearer demo-token-nova-system-override' };
  }
  
  try {
    if (auth && auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      return { 'Authorization': `Bearer ${token}` };
    }
  } catch (e) {
    console.warn("Auth token extraction error, pulling system baseline", e);
  }
  
  return { 'Authorization': 'Bearer guest-unauthenticated' };
};

// ... keep the rest of your BASE_URL and apiClient definitions exactly the same!

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  async get(endpoint: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (!res.ok) throw new Error(`API GET Failure: ${res.statusText}`);
    return res.json();
  },
  
  async post(endpoint: string, data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`API POST Failure: ${res.statusText}`);
    return res.json();
  },

  async patch(endpoint: string, data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`API PATCH Failure: ${res.statusText}`);
    return res.json();
  },

  async delete(endpoint: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { ...headers }
    });
    if (!res.ok) throw new Error(`API DELETE Failure: ${res.statusText}`);
    return res.json();
  }
};