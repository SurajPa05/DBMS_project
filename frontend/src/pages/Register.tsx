"use client"

import type React from "react"
import { useState } from "react"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { PersonAdd as PersonAddIcon } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useSnackbar } from "../contexts/SnackbarContext"

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "participant",
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
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

    if (formData.password !== formData.confirmPassword) {
      showSnackbar("Passwords do not match", "error")
      return
    }

    if (formData.password.length < 6) {
      showSnackbar("Password must be at least 6 characters long", "error")
      return
    }

    setLoading(true)

    try {
      await register(formData.name, formData.email, formData.password, formData.role)
      showSnackbar("Registration successful! Welcome to EventHub!", "success")
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
            <PersonAddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              Join EventHub
            </Typography>
            <Typography color="text.secondary">Create your account to start managing events</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="participant">Participant</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              variant="outlined"
              helperText="Password must be at least 6 characters long"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 4 }}
              variant="outlined"
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mb: 3, py: 1.5 }}>
              {loading ? <CircularProgress size={24} /> : "Create Account"}
            </Button>
          </form>

          <Box textAlign="center">
            <Typography color="text.secondary">
              Already have an account?{" "}
              <MuiLink component={Link} to="/login" sx={{ fontWeight: 500 }}>
                Sign in here
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register
