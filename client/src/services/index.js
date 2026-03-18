import api from './api';

// ─── Auth ─────────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  me:       ()     => api.get('/auth/me'),
  refresh:  ()     => api.post('/auth/refresh'),
};

// ─── User / Profile / Settings ────────────────────────────────
export const userService = {
  getProfile:     ()       => api.get('/user/profile'),
  updateProfile:  (data)   => api.patch('/user/profile', data),
  updateSettings: (data)   => api.patch('/user/settings', { settings: data }),
  changePassword: (data)   => api.patch('/user/change-password', data),
  deleteAccount:  (data)   => api.delete('/user/account', { data }),
};

// ─── Resume ───────────────────────────────────────────────────
export const resumeService = {
  analyze:  (data)    => api.post('/resume/analyze', data),
  chat:     (id, msg) => api.post(`/resume/${id}/chat`, { message: msg }),
  getAll:   ()        => api.get('/resume'),
  getOne:   (id)      => api.get(`/resume/${id}`),
};

// ─── Interview ────────────────────────────────────────────────
export const interviewService = {
  start:      (data)    => api.post('/interview/start', data),
  message:    (id, msg) => api.post(`/interview/${id}/message`, { message: msg }),
  end:        (id)      => api.post(`/interview/${id}/end`),
  getAll:     ()        => api.get('/interview'),
  getOne:     (id)      => api.get(`/interview/${id}`),
};

// ─── Code Review ──────────────────────────────────────────────
export const codeReviewService = {
  review: (data)       => api.post('/code-review', data),
  chat:   (id, msg)    => api.post(`/code-review/${id}/chat`, { message: msg }),
  getAll: ()           => api.get('/code-review'),
};

// ─── Learning Path ────────────────────────────────────────────
export const learningPathService = {
  generate:   (data)              => api.post('/learning-path/generate', data),
  getAll:     ()                  => api.get('/learning-path'),
  updateModule: (pathId, moduleId, data) =>
    api.patch(`/learning-path/${pathId}/module/${moduleId}`, data),
};

// ─── Bug Fix ──────────────────────────────────────────────────
export const bugFixService = {
  diagnose:  (data)    => api.post('/bug-fix', data),
  message:   (id, msg) => api.post(`/bug-fix/${id}/message`, { message: msg }),
  getAll:    ()        => api.get('/bug-fix'),
};
