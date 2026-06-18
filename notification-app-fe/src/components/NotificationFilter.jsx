import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const filters = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  const handleChange = (_, newValue) => {
    // Prevent deselecting (newValue will be null if clicking active filter)
    if (newValue !== null && onChange) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{ 
        flexWrap: "wrap", 
        gap: 0.5,
        border: "none",
        "& .MuiToggleButtonGroup-grouped": {
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "6px !important",
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            }
          }
        }
      }}
    >
      {filters.map((type) => (
        <ToggleButton 
          key={type} 
          value={type} 
          sx={{ 
            textTransform: "none", 
            px: 3, 
            py: 0.75,
            fontWeight: 600,
            fontSize: "0.875rem"
          }}
        >
          {type}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}