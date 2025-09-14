export interface User {
  user_id: number
  name: string
  email: string
  role: "admin" | "participant"
}

export interface Event {
  event_id: number
  title: string
  description: string
  location: string
  event_date: string
  created_by: number
  creator_name: string
  registration_count: number
  created_at: string
}

export interface Registration {
  reg_id: number
  user_id: number
  event_id: number
  registered_at: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  status?: number
}
