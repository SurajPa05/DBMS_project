"use client"

import type React from "react"
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"
import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material"
import { useState } from "react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { useSnackbar } from "../contexts/SnackbarContext"
import EventRegistrationStatus from "./EventRegistrationStatus"
import dayjs from "dayjs"

interface Event {
  event_id: number
  title: string
  description: string
  location: string
  event_date: string
  creator_name: string
  created_by: number
  registration_count: number
}

interface EventCardProps {
  event: Event
  onEventChange?: () => void
  showRegistration?: boolean
}

const EventCard: React.FC<EventCardProps> = ({ event, onEventChange, showRegistration = true }) => {
  const [deleteDialog, setDeleteDialog] = useState(false)
  const { user } = useAuth()
  const { showSnackbar } = useSnackbar()

  const canDeleteEvent = () => {
    return user && (user.role === "admin" || user.user_id === event.created_by)
  }

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`/api/events/${event.event_id}`)
      showSnackbar("Event deleted successfully", "success")
      onEventChange?.()
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to delete event", "error")
    }
    setDeleteDialog(false)
  }

  const isEventEnded = dayjs(event.event_date).isBefore(dayjs())

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3, flex: 1 }}>
              {event.title}
            </Typography>
            {canDeleteEvent() && (
              <IconButton size="small" onClick={() => setDeleteDialog(true)} sx={{ color: "error.main", ml: 1 }}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            {event.description}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {dayjs(event.event_date).format("MMM DD, YYYY at h:mm A")}
              </Typography>
            </Box>
            {event.location && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Organized by {event.creator_name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={`${event.registration_count} registered`} size="small" color="primary" variant="outlined" />
            {isEventEnded ? (
              <Chip label="Past Event" size="small" color="default" />
            ) : (
              <Chip label="Upcoming" size="small" color="success" />
            )}
          </Box>
        </CardContent>

        {showRegistration && (
          <CardActions sx={{ p: 2, pt: 0 }}>
            <Box sx={{ width: "100%" }}>
              <EventRegistrationStatus
                eventId={event.event_id}
                onRegistrationChange={onEventChange}
                disabled={isEventEnded}
              />
            </Box>
          </CardActions>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{event.title}"? This action cannot be undone and will remove all
            registrations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteEvent} color="error" variant="contained">
            Delete Event
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EventCard
