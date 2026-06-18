import { useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box, Container, IconButton, Tooltip, Typography, Stack } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { NotificationsPage } from "./pages/NotificationsPage";
import { Log } from "./services/logger";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme_mode");
      return saved === "dark";
    } catch {
      return false;
    }
  });

  // Persist theme choice in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("theme_mode", darkMode ? "dark" : "light");
    } catch (e) {
      console.error(e);
    }
    
    Log(
      "frontend",
      "info",
      "style",
      `Theme changed to: ${darkMode ? "dark" : "light"}`
    );
  }, [darkMode]);

  // Create a curated premium palette for light and dark modes
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#1a73e8",
          },
          secondary: {
            main: darkMode ? "#f48fb1" : "#e91e63",
          },
          background: {
            default: darkMode ? "#0a192f" : "#f8fafc",
            paper: darkMode ? "#112240" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#f8fafc" : "#0f172a",
            secondary: darkMode ? "#94a3b8" : "#475569",
          },
          divider: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
        },
        typography: {
          fontFamily: [
            "Inter",
            "Roboto",
            "system-ui",
            "-apple-system",
            "sans-serif"
          ].join(","),
          h5: {
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.025em"
          },
          body1: {
            fontSize: "0.9375rem"
          },
          caption: {
            fontSize: "0.75rem",
            fontWeight: 500
          }
        },
        shape: {
          borderRadius: 8
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)"
              }
            }
          }
        }
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Top Application Bar */}
      <Box 
        sx={{ 
          borderBottom: "1px solid", 
          borderColor: "divider",
          backgroundColor: "background.paper",
          py: 1.5,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(8px)",
          backgroundOpacity: 0.9
        }}
      >
        <Container maxWidth="md">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={800} color="primary.main">
              CAMPUS METRICS
            </Typography>
            <Tooltip title={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}>
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" size="medium">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Container>
      </Box>

      {/* Main Container */}
      <Container maxWidth="md" sx={{ py: 2 }}>
        <NotificationsPage />
      </Container>
    </ThemeProvider>
  );
}