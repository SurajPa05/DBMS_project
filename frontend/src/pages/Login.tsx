"use client"

import type React from "react"
import { useState } from "react"
import { Container, Paper, TextField, Button, Typography, Box, Link as MuiLink, CircularProgress } from "@mui/material"
import { Login as LoginIcon } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useSnackbar } from "../contexts/SnackbarContext"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      showSnackbar("Login successful!", "success")
      navigate("/events")
    } catch (error: any) {
      showSnackbar(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Box textAlign="center" sx={{ mb: 4 }}>
            <LoginIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              Welcome Back
            </Typography>
            <Typography color="text.secondary">Sign in to your account to continue</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 4 }}
              variant="outlined"
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mb: 3, py: 1.5 }}>
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </form>

          <Box textAlign="center">
            <Typography color="text.secondary">
              Don't have an account?{" "}
              <MuiLink component={Link} to="/register" sx={{ fontWeight: 500 }}>
                Sign up here
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
