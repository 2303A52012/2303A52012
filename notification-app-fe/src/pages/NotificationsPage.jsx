import { useState, useEffect } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../services/logger";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem("read_notification_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { notifications, totalPages, loading, error } = useNotifications(page, 10);

  // Sync read state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(readIds));
    } catch (e) {
      console.error("Failed to save read state to localStorage", e);
    }
  }, [readIds]);

  // Log page mount
  useEffect(() => {
    Log("frontend", "info", "page", "Notifications page mounted");
  }, []);

  // Filter fetched notifications on client side
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "All") return true;
    return String(n.Type).toLowerCase() === filter.toLowerCase();
  });

  // Calculate unread count on the current page
  const unreadCount = filteredNotifications.filter((n) => !readIds.includes(n.ID)).length;

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when changing filters
    Log("frontend", "info", "page", `Filter changed to: ${newFilter}`);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    Log("frontend", "info", "page", `Page changed to: ${newPage}`);
  };

  const handleToggleRead = (id) => {
    setReadIds((prev) => {
      const isAlreadyRead = prev.includes(id);
      const nextReadIds = isAlreadyRead ? prev.filter((x) => x !== id) : [...prev, id];
      
      Log(
        "frontend",
        "info",
        "page",
        `Notification ${id} marked as ${isAlreadyRead ? "unread" : "read"}`
      );
      
      return nextReadIds;
    });
  };

  const handleMarkAllRead = () => {
    const visibleUnreadIds = filteredNotifications
      .filter((n) => !readIds.includes(n.ID))
      .map((n) => n.ID);

    if (visibleUnreadIds.length > 0) {
      setReadIds((prev) => [...prev, ...visibleUnreadIds]);
      Log(
        "frontend",
        "info",
        "page",
        `Marked all (${visibleUnreadIds.length}) visible notifications as read`
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      {/* Header section with Dynamic Unread Badge */}
      <Stack direction="row" mb={3} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Badge badgeContent={unreadCount} color="primary" max={99}>
            <NotificationsIcon sx={{ fontSize: 28, color: "primary.main" }} />
          </Badge>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Notifications Portal
          </Typography>
        </Stack>

        {unreadCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={handleMarkAllRead}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Mark Page Read
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Filter tab container */}
      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {/* Loading state spinner */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress size={44} thickness={4} />
        </Box>
      )}

      {/* Error State display */}
      {!loading && error && (
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(211, 47, 47, 0.15)" }}
        >
          Failed to load notifications: {error}
        </Alert>
      )}

      {/* Empty notifications state */}
      {!loading && !error && filteredNotifications.length === 0 && (
        <Card variant="outlined" sx={{ borderRadius: "8px", borderStyle: "dashed", py: 4, textAlign: "center" }}>
          <CardContent>
            <InfoOutlinedIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1.5 }} />
            <Typography variant="h6" color="text.primary" fontWeight={600} mb={0.5}>
              No Notifications Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no {filter !== "All" ? `${filter} ` : ""}notifications available on Page {page}.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Active notification card list */}
      {!loading && !error && filteredNotifications.length > 0 && (
        <Stack spacing={2}>
          {filteredNotifications.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isRead={readIds.includes(n.ID)}
              onToggleRead={() => handleToggleRead(n.ID)}
            />
          ))}
        </Stack>
      )}

      {/* Footer Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="medium"
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 600,
                borderRadius: "6px"
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}
