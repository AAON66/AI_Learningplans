import api from './api'

export const authService = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  changePassword: (old_password: string, new_password: string) =>
    api.post('/auth/change-password', { old_password, new_password }),
  setSecurityQA: (question: string, answer: string) =>
    api.post('/auth/set-security-qa', { question, answer }),
  getSecurityQuestion: (email: string) =>
    api.get('/auth/security-question', { params: { email } }),
  forgotPassword: (email: string, security_answer: string, new_password: string) =>
    api.post('/auth/forgot-password', { email, security_answer, new_password }),
}
