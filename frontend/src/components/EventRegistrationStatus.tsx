"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button, Chip, CircularProgress } from "@mui/material"
import { Event as EventIcon, ExitToApp as ExitIcon, Check as CheckIcon } from "@mui/icons-material"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { useSnackbar } from "../contexts/SnackbarContext"

interface EventRegistrationStatusProps {
  eventId: number
  onRegistrationChange?: () => void
  disabled?: boolean
}

const EventRegistrationStatus: React.FC<EventRegistrationStatusProps> = ({
  eventId,
  onRegistrationChange,
  disabled = false,
}) => {
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const { user } = useAuth()
  const { showSnackbar } = useSnackbar()

  const checkRegistrationStatus = async () => {
    if (!user) {
      setCheckingStatus(false)
      return
    }

    try {
      const response = await axios.get("/api/user/events")
      const userEvents = response.data
      const isUserRegistered = userEvents.some((event: any) => event.event_id === eventId)
      setIsRegistered(isUserRegistered)
    } catch (error) {
      console.error("Failed to check registration status:", error)
    } finally {
      setCheckingStatus(false)
    }
  }

  useEffect(() => {
    checkRegistrationStatus()
  }, [eventId, user])

  const handleRegister = async () => {
    if (!user) {
      showSnackbar("Please login to register for events", "warning")
      return
    }

    setLoading(true)
    try {
      await axios.post(`/api/events/${eventId}/register`)
      setIsRegistered(true)
      showSnackbar("Successfully registered for event!", "success")
      onRegistrationChange?.()
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to register for event", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleUnregister = async () => {
    setLoading(true)
    try {
      await axios.delete(`/api/events/${eventId}/unregister`)
      setIsRegistered(false)
      showSnackbar("Successfully unregistered from event", "success")
      onRegistrationChange?.()
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to unregister", "error")
    } finally {
      setLoading(false)
    }
  }

  if (checkingStatus) {
    return <CircularProgress size={20} />
  }

  if (!user) {
    return (
      <Button variant="outlined" disabled fullWidth>
        Login to Register
      </Button>
    )
  }

  if (disabled) {
    return (
      <Button variant="outlined" disabled fullWidth>
        Event Ended
      </Button>
    )
  }

  if (isRegistered) {
    return (
      <>
        <Chip icon={<CheckIcon />} label="Registered" color="success" size="small" sx={{ mb: 1, width: "100%" }} />
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleUnregister}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <ExitIcon />}
        >
          {loading ? "Unregistering..." : "Unregister"}
        </Button>
      </>
    )
  }

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={handleRegister}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={16} /> : <EventIcon />}
    >
      {loading ? "Registering..." : "Register"}
    </Button>
  )
}

export default EventRegistrationStatus
