import api from './api'

export const vipService = {
  // 用户端
  getStatus: () => api.get('/vip/status'),
  activate: (card_code: string) => api.post('/vip/activate', { card_code }),

  // 管理员端
  createCards: (duration_days: number, count: number) =>
    api.post('/vip/cards', { duration_days, count }),
  listCards: (params?: { skip?: number; limit?: number; is_used?: boolean }) =>
    api.get('/vip/cards', { params }),
  deleteCard: (id: number) => api.delete(`/vip/cards/${id}`),
}
