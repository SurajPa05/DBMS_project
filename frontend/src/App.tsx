import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { AuthProvider } from "./contexts/AuthContext"
import { SnackbarProvider } from "./contexts/SnackbarContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Events from "./pages/Events"
import CreateEvent from "./pages/CreateEvent"
import MyEvents from "./pages/MyEvents"
import ProtectedRoute from "./components/ProtectedRoute"

// Create a modern, clean theme with soft colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1", // Soft indigo
      light: "#a5b4fc",
      dark: "#4338ca",
    },
    secondary: {
      main: "#f59e0b", // Warm amber accent
      light: "#fbbf24",
      dark: "#d97706",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <SnackbarProvider>
            <Router>
              <div className="App">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/events" element={<Events />} />
                  <Route
                    path="/create-event"
                    element={
                      <ProtectedRoute>
                        <CreateEvent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-events"
                    element={
                      <ProtectedRoute>
                        <MyEvents />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </Router>
          </SnackbarProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
