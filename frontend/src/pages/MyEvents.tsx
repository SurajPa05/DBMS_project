"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ExitToApp as ExitIcon,
} from "@mui/icons-material"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { useSnackbar } from "../contexts/SnackbarContext"
import dayjs from "dayjs"

interface Event {
  event_id: number
  title: string
  description: string
  location: string
  event_date: string
  creator_name: string
  registered_at?: string
}

const MyEvents: React.FC = () => {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [createdEvents, setCreatedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const { user } = useAuth()
  const { showSnackbar } = useSnackbar()

  const fetchMyEvents = async () => {
    try {
      // Fetch registered events
      const registeredResponse = await axios.get("/api/user/events")
      setRegisteredEvents(registeredResponse.data)

      // Fetch all events and filter by created_by
      const allEventsResponse = await axios.get("/api/events")
      const myCreatedEvents = allEventsResponse.data.filter(
        (event: Event & { created_by: number }) => event.created_by === user?.user_id,
      )
      setCreatedEvents(myCreatedEvents)
    } catch (error: any) {
      showSnackbar("Failed to load your events", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyEvents()
    }
  }, [user])

  const handleUnregister = async (eventId: number) => {
    try {
      await axios.delete(`/api/events/${eventId}/unregister`)
      showSnackbar("Successfully unregistered from event", "success")
      fetchMyEvents()
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to unregister", "error")
    }
  }

  const EventCard: React.FC<{ event: Event; showUnregister?: boolean }> = ({ event, showUnregister = false }) => (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, lineHeight: 1.3 }}>
          {event.title}
        </Typography>

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
          {event.registered_at && (
            <Typography variant="body2" color="text.secondary">
              Registered on {dayjs(event.registered_at).format("MMM DD, YYYY")}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {dayjs(event.event_date).isAfter(dayjs()) ? (
            <Chip label="Upcoming" size="small" color="success" />
          ) : (
            <Chip label="Past Event" size="small" color="default" />
          )}
        </Box>
      </CardContent>

      {showUnregister && dayjs(event.event_date).isAfter(dayjs()) && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => handleUnregister(event.event_id)}
            startIcon={<ExitIcon />}
          >
            Unregister
          </Button>
        </CardActions>
      )}
    </Card>
  )

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
            My Events
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your registered and created events
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label={`Registered Events (${registeredEvents.length})`} />
            <Tab label={`Created Events (${createdEvents.length})`} />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <>
            {registeredEvents.length === 0 ? (
              <Box textAlign="center" sx={{ py: 8 }}>
                <EventIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                  No registered events
                </Typography>
                <Typography color="text.secondary">Browse events to find something interesting!</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {registeredEvents.map((event) => (
                  <Grid item xs={12} md={6} lg={4} key={event.event_id}>
                    <EventCard event={event} showUnregister={true} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {tabValue === 1 && (
          <>
            {createdEvents.length === 0 ? (
              <Box textAlign="center" sx={{ py: 8 }}>
                <EventIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                  No created events
                </Typography>
                <Typography color="text.secondary">Create your first event to get started!</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {createdEvents.map((event) => (
                  <Grid item xs={12} md={6} lg={4} key={event.event_id}>
                    <EventCard event={event} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Container>
  )
}

export default MyEvents
