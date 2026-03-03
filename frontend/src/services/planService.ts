import api from './api'

export const planService = {
  create: (data: { title: string; goal: string; user_background?: string; total_duration_days?: number; difficulty_level?: string }) =>
    api.post('/plans', data),
  list: (params?: { status?: string; page?: number }) =>
    api.get('/plans', { params }),
  get: (id: number) => api.get(`/plans/${id}`),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/plans/${id}`, data),
  delete: (id: number) => api.delete(`/plans/${id}`),
  start: (id: number) => api.post(`/plans/${id}/start`),
  pause: (id: number) => api.post(`/plans/${id}/pause`),
  complete: (id: number) => api.post(`/plans/${id}/complete`),
  generateAnalysis: (plan_id: number) => api.post('/analysis/generate', { plan_id }),
  getAnalysis: (plan_id: number) => api.get(`/analysis/plan/${plan_id}`),
  confirmAnalysis: (id: number) => api.post(`/analysis/${id}/confirm`),
  generateStages: (plan_id: number) => api.post('/stages/generate', { plan_id }),
  getStages: (plan_id: number) => api.get(`/stages/plan/${plan_id}`),
  confirmAllStages: (plan_id: number) => api.post('/stages/confirm-all', { plan_id }),
  recommendResources: (stage_id: number) => api.post('/resources/recommend', { stage_id }),
  getResources: (stage_id: number) => api.get(`/resources/stage/${stage_id}`),
  confirmAllResources: (stage_id: number) => api.post('/resources/confirm-all', { stage_id }),
  confirmAllResourcesPlan: (plan_id: number) => api.post('/resources/confirm-all-plan', { plan_id }),
  generateMethods: (plan_id: number) => api.post('/methods/generate', { plan_id }),
  getMethods: (plan_id: number) => api.get(`/methods/plan/${plan_id}`),
  confirmAllMethods: (plan_id: number) => api.post('/methods/confirm-all', { plan_id }),
  recordProgress: (data: Record<string, unknown>) => api.post('/progress/record', data),
  getProgress: (plan_id: number) => api.get(`/progress/plan/${plan_id}`),
  getStats: (plan_id: number) => api.get(`/progress/plan/${plan_id}/stats`),
  checkIn: (data: Record<string, unknown>) => api.post('/progress/check-in', data),
  getCheckIns: (plan_id: number) => api.get(`/progress/plan/${plan_id}/check-ins`),
}
