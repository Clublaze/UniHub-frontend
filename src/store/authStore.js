import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  roles: [],
  isLoadingAuth: true,
  isLoadingRoles: false,

  setAccessToken: (token) => set({ accessToken: token }),

  setUser: (user) => set({ user }),

  setRoles: (roles) => set({ roles }),

  setLoadingAuth: (val) => set({ isLoadingAuth: val }),

  logout: () => set({ accessToken: null, user: null, roles: [] }),

  // ── Helper functions — use these everywhere, never raw role checks ──

  hasRole: (role) => {
    const { roles } = get()
    return roles.some(r => r.canonicalRole === role && r.status === 'ACTIVE')
  },

  hasRoleInScope: (role, scopeId) => {
    const { roles } = get()
    return roles.some(
      r => r.canonicalRole === role && r.scopeId === scopeId && r.status === 'ACTIVE'
    )
  },

  isAdmin: () => {
    const { user } = get()
    return ['UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(user?.userType ?? '')
  },

  isApprover: () => {
    const { hasRole } = get()
    return ['SECRETARY', 'VICE_PRESIDENT', 'PRESIDENT', 'FACULTY_ADVISOR', 'HOD', 'DEAN']
      .some(r => hasRole(r))
  },

  isFacultyApprover: () => {
    const { hasRole } = get()
    return ['FACULTY_ADVISOR', 'HOD', 'DEAN'].some(r => hasRole(r))
  },

  getLeadClubs: () => {
    const { roles } = get()
    return roles.filter(r => r.canonicalRole === 'CLUB_LEAD' && r.status === 'ACTIVE')
  },

  getClubsWhere: (role) => {
    const { roles } = get()
    return roles.filter(r => r.canonicalRole === role && r.status === 'ACTIVE')
  },

  getManagedClubs: () => {
    const { roles } = get()
    return roles.filter(
      r => ['CLUB_LEAD', 'CO_LEAD'].includes(r.canonicalRole) && r.status === 'ACTIVE'
    )
  },
}))

export default useAuthStore