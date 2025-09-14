"use client"

import type React from "react"
import { useState } from "react"
import { Container, Paper, TextField, Button, Typography, Box, CircularProgress } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useSnackbar } from "../contexts/SnackbarContext"
import dayjs, { type Dayjs } from "dayjs"

const CreateEvent: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  })
  const [eventDate, setEventDate] = useState<Dayjs | null>(dayjs().add(1, "day"))
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventDate) {
      showSnackbar("Please select an event date", "error")
      return
    }

    if (eventDate.isBefore(dayjs())) {
      showSnackbar("Event date cannot be in the past", "error")
      return
    }

    setLoading(true)

    try {
      await axios.post("/api/events", {
        ...formData,
        event_date: eventDate.toISOString(),
      })
      showSnackbar("Event created successfully!", "success")
      navigate("/events")
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to create event", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Box textAlign="center" sx={{ mb: 4 }}>
            <AddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              Create New Event
            </Typography>
            <Typography color="text.secondary">Fill in the details to create your event</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              variant="outlined"
              placeholder="Enter a catchy title for your event"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{ mb: 3 }}
              variant="outlined"
              placeholder="Describe what your event is about, what attendees can expect..."
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              sx={{ mb: 3 }}
              variant="outlined"
              placeholder="Where will your event take place?"
            />

            <DateTimePicker
              label="Event Date & Time"
              value={eventDate}
              onChange={setEventDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  sx: { mb: 4 },
                },
              }}
              minDateTime={dayjs()}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5 }}
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {loading ? "Creating Event..." : "Create Event"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default CreateEvent
