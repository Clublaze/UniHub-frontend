import useAuthStore from '../store/authStore'

const env = {
  authUrl:      import.meta.env.VITE_AUTH_API_URL    || 'http://localhost:8001',
  clubUrl:      import.meta.env.VITE_CLUB_API_URL    || 'http://localhost:8002',
  profileUrl:   import.meta.env.VITE_PROFILE_API_URL || 'http://localhost:8003',
  universityId: import.meta.env.VITE_UNIVERSITY_ID || '',
}

export function getUniversityId() {
  // Zustand allows getState() outside React components — safe to call in API files
  const fromStore = useAuthStore.getState().user?.universityId
  return fromStore || env.universityId
}

export default env