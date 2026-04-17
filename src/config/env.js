const env = {
  authUrl:    import.meta.env.VITE_AUTH_API_URL    || 'http://localhost:8001',
  clubUrl:    import.meta.env.VITE_CLUB_API_URL    || 'http://localhost:8002',
  profileUrl: import.meta.env.VITE_PROFILE_API_URL || 'http://localhost:8003',
  universityId: import.meta.env.VITE_UNIVERSITY_ID || '',
}

export default env