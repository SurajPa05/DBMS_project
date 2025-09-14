"use client"

import type React from "react"
import { Container, Typography, Box, Button, Grid, Card, CardContent } from "@mui/material"
import { Event as EventIcon, People as PeopleIcon, Add as AddIcon } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Home: React.FC = () => {
  const { user } = useAuth()

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              mb: 3,
              background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to EventHub
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
            Discover, create, and manage amazing events. Connect with your community and never miss out on exciting
            opportunities.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button component={Link} to="/events" variant="contained" size="large" startIcon={<EventIcon />}>
              Browse Events
            </Button>
            {user ? (
              <Button component={Link} to="/create-event" variant="outlined" size="large" startIcon={<AddIcon />}>
                Create Event
              </Button>
            ) : (
              <Button component={Link} to="/register" variant="outlined" size="large">
                Get Started
              </Button>
            )}
          </Box>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
              <CardContent>
                <EventIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Discover Events
                </Typography>
                <Typography color="text.secondary">
                  Find exciting events happening in your area. From conferences to workshops, discover opportunities to
                  learn and grow.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
              <CardContent>
                <AddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Create Events
                </Typography>
                <Typography color="text.secondary">
                  Organize your own events with ease. Set up registration, manage attendees, and create memorable
                  experiences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
              <CardContent>
                <PeopleIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Connect & Network
                </Typography>
                <Typography color="text.secondary">
                  Meet like-minded people and build meaningful connections. Join communities and expand your
                  professional network.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Home
