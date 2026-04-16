import clubClient from '../../services/clubClient'

export const getGovernanceTemplatesApi  = ()           => clubClient.get('/api/v1/governance/templates')
export const getGovernanceConfigApi     = (scopeId)    => clubClient.get(`/api/v1/governance/configs/${scopeId}`)
export const getGovernanceHistoryApi    = (scopeId)    => clubClient.get(`/api/v1/governance/configs/${scopeId}/history`)
export const createGovernanceConfigApi  = (data)       => clubClient.post('/api/v1/governance/configs', data)
export const updateGovernanceConfigApi  = (scopeId, data) => clubClient.put(`/api/v1/governance/configs/${scopeId}`, data)
export const getOrgTreeApi              = ()           => clubClient.get('/api/v1/organizations/tree')
export const createOrgUnitApi           = (data)       => clubClient.post('/api/v1/organizations', data)
export const updateOrgUnitApi           = (id, data)   => clubClient.patch(`/api/v1/organizations/${id}`, data)