"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Container, Typography, Box, Grid, CircularProgress } from "@mui/material"
import { Event as EventIcon } from "@mui/icons-material"
import axios from "axios"
import { useSnackbar } from "../contexts/SnackbarContext"
import EventCard from "../components/EventCard"

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

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { showSnackbar } = useSnackbar()

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events")
      setEvents(response.data)
    } catch (error: any) {
      showSnackbar("Failed to load events", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
            Discover Events
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find and join exciting events happening around you
          </Typography>
        </Box>

        {events.length === 0 ? (
          <Box textAlign="center" sx={{ py: 8 }}>
            <EventIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              No events found
            </Typography>
            <Typography color="text.secondary">Be the first to create an event!</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event.event_id}>
                <EventCard event={event} onEventChange={fetchEvents} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  )
}

export default Events
