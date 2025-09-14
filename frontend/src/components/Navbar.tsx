"use client"

import React from "react"
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material"
import { Event as EventIcon, AccountCircle, Add as AddIcon } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    handleClose()
  }

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
      <Toolbar>
        <EventIcon sx={{ mr: 2, color: "primary.main" }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "text.primary",
            fontWeight: 700,
          }}
        >
          EventHub
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button component={Link} to="/events" sx={{ color: "text.primary" }}>
            Events
          </Button>

          {user ? (
            <>
              <Button component={Link} to="/create-event" startIcon={<AddIcon />} variant="contained" size="small">
                Create Event
              </Button>
              <IconButton size="large" onClick={handleMenu} color="inherit" sx={{ color: "text.primary" }}>
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    navigate("/my-events")
                    handleClose()
                  }}
                >
                  My Events
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: "text.primary" }}>
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained" size="small">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
