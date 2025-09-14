import axios from "axios"

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000"
axios.defaults.headers.common["Content-Type"] = "application/json"

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// API service functions
export const authAPI = {
  login: (email: string, password: string) => axios.post("/api/login", { email, password }),
  register: (name: string, email: string, password: string, role?: string) =>
    axios.post("/api/register", { name, email, password, role }),
}

export const eventsAPI = {
  getAll: () => axios.get("/api/events"),
  create: (eventData: {
    title: string
    description: string
    location: string
    event_date: string
  }) => axios.post("/api/events", eventData),
  delete: (eventId: number) => axios.delete(`/api/events/${eventId}`),
  register: (eventId: number) => axios.post(`/api/events/${eventId}/register`),
  unregister: (eventId: number) => axios.delete(`/api/events/${eventId}/unregister`),
  getUserEvents: () => axios.get("/api/user/events"),
}

export default axios
