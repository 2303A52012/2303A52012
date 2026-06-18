import { Card, CardContent, Typography, Box, Stack, Chip, IconButton, Tooltip } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import FiberNewIcon from "@mui/icons-material/FiberNew";

// Helper to determine the color, icon, and label for each notification type
const getTypeConfig = (type) => {
  switch (String(type).toLowerCase()) {
    case "placement":
      return {
        icon: <WorkIcon sx={{ color: "#2196f3", fontSize: 24 }} />,
        color: "info",
        bgColor: "rgba(33, 150, 243, 0.08)",
        borderColor: "#2196f3",
        label: "Placement"
      };
    case "result":
      return {
        icon: <SchoolIcon sx={{ color: "#4caf50", fontSize: 24 }} />,
        color: "success",
        bgColor: "rgba(76, 175, 80, 0.08)",
        borderColor: "#4caf50",
        label: "Result"
      };
    case "event":
      return {
        icon: <EventIcon sx={{ color: "#ff9800", fontSize: 24 }} />,
        color: "warning",
        bgColor: "rgba(255, 152, 0, 0.08)",
        borderColor: "#ff9800",
        label: "Event"
      };
    default:
      return {
        icon: <HelpOutlineIcon sx={{ color: "#9e9e9e", fontSize: 24 }} />,
        color: "default",
        bgColor: "rgba(158, 158, 158, 0.08)",
        borderColor: "#9e9e9e",
        label: type
      };
  }
};

// Formats the timestamp to a human-readable format
const formatTimestamp = (timestampStr) => {
  if (!timestampStr) return "";
  try {
    const date = new Date(timestampStr.replace(/-/g, "/")); // Replace dashes for cross-browser support
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return timestampStr;
  }
};

export function NotificationCard({ notification, isRead, onToggleRead }) {
  const { Type, Message, Timestamp } = notification;
  const config = getTypeConfig(Type);

  return (
    <Card
      elevation={isRead ? 0 : 2}
      sx={{
        position: "relative",
        borderLeft: `5px solid ${isRead ? "transparent" : config.borderColor}`,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: isRead ? "divider" : "rgba(33, 150, 243, 0.25)",
        backgroundColor: isRead ? "background.paper" : "rgba(33, 150, 243, 0.02)",
        transition: "all 0.25s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
          borderColor: config.borderColor,
          backgroundColor: isRead ? "rgba(0, 0, 0, 0.01)" : "rgba(33, 150, 243, 0.04)"
        }
      }}
      onClick={onToggleRead}
    >
      <CardContent sx={{ py: 1.75, px: 2, "&:last-child": { pb: 1.75 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexGrow: 1 }}>
            {/* Left side circular icon container */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: config.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {config.icon}
            </Box>

            {/* Notification content */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                <Chip
                  label={config.label}
                  size="small"
                  color={config.color}
                  variant={isRead ? "outlined" : "filled"}
                  sx={{ height: 18, fontSize: "0.6875rem", fontWeight: 600 }}
                />
                {!isRead && (
                  <Chip
                    icon={<FiberNewIcon sx={{ fontSize: "14px !important" }} />}
                    label="New"
                    size="small"
                    color="primary"
                    sx={{ height: 18, fontSize: "0.6875rem", fontWeight: 700 }}
                  />
                )}
              </Stack>
              <Typography
                variant="body1"
                fontWeight={isRead ? 500 : 700}
                color={isRead ? "text.secondary" : "text.primary"}
                sx={{
                  wordBreak: "break-word",
                  textTransform: "capitalize",
                  lineHeight: 1.3
                }}
              >
                {Message}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                {formatTimestamp(Timestamp)}
              </Typography>
            </Box>
          </Stack>

          {/* Action icon for read/unread state */}
          <Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0 }}>
            <Tooltip title={isRead ? "Mark as unread" : "Mark as read"}>
              <IconButton onClick={onToggleRead} size="small" color="primary">
                {isRead ? (
                  <MarkEmailUnreadIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                ) : (
                  <MarkEmailReadIcon sx={{ fontSize: 20, color: "primary.main" }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
