"use client"

import { useState, useEffect } from "react"
import { eventsAPI } from "../services/api"
import { useSnackbar } from "../contexts/SnackbarContext"
import type { Event } from "../types"

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showSnackbar } = useSnackbar()

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventsAPI.getAll()
      setEvents(response.data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load events"
      setError(errorMessage)
      showSnackbar(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: {
    title: string
    description: string
    location: string
    event_date: string
  }) => {
    try {
      await eventsAPI.create(eventData)
      showSnackbar("Event created successfully!", "success")
      await fetchEvents() // Refresh events list
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create event"
      showSnackbar(errorMessage, "error")
      return false
    }
  }

  const deleteEvent = async (eventId: number) => {
    try {
      await eventsAPI.delete(eventId)
      showSnackbar("Event deleted successfully", "success")
      await fetchEvents() // Refresh events list
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete event"
      showSnackbar(errorMessage, "error")
      return false
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    deleteEvent,
  }
}

export const useUserEvents = () => {
  const [userEvents, setUserEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showSnackbar } = useSnackbar()

  const fetchUserEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventsAPI.getUserEvents()
      setUserEvents(response.data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load your events"
      setError(errorMessage)
      showSnackbar(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const registerForEvent = async (eventId: number) => {
    try {
      await eventsAPI.register(eventId)
      showSnackbar("Successfully registered for event!", "success")
      await fetchUserEvents() // Refresh user events
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to register for event"
      showSnackbar(errorMessage, "error")
      return false
    }
  }

  const unregisterFromEvent = async (eventId: number) => {
    try {
      await eventsAPI.unregister(eventId)
      showSnackbar("Successfully unregistered from event", "success")
      await fetchUserEvents() // Refresh user events
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to unregister"
      showSnackbar(errorMessage, "error")
      return false
    }
  }

  useEffect(() => {
    fetchUserEvents()
  }, [])

  return {
    userEvents,
    loading,
    error,
    fetchUserEvents,
    registerForEvent,
    unregisterFromEvent,
  }
}
