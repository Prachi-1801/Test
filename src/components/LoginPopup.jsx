import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginPopup = () => {
  return (
    <Box
      sx={{
        zIndex: 10,
        position: "relative",
        width: { xs: "90%", sm: 355 },
        bgcolor: "rgba(255,255,255,0.93)",
        borderRadius: 3.5,
        p: 4,
        boxShadow:
          "0 8px 48px rgba(123,79,255,0.28), 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 #fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          bgcolor: "linear-gradient(135deg,#e96cff,#7b4fff,#3a8eff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          boxShadow: "0 4px 20px rgba(123,79,255,0.4)",
          mb: 2.5,
        }}
      >
        ✦
      </Box>

      {/* Heading */}
      <Typography
        variant="h6"
        sx={{ mb: 0.5, fontWeight: 700, color: "#1a1230" }}
      >
        Welcome back
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "#9992b0" }}>
        Sign in to your account
      </Typography>

      {/* Email */}
      <TextField
        fullWidth
        placeholder="you@example.com"
        variant="outlined"
        size="small"
        type="email"
        InputProps={{
          startAdornment: (
            <EmailOutlinedIcon sx={{ color: "#c4bcd8", mr: 1 }} />
          ),
        }}
        sx={{ mb: 1.5 }}
      />

      {/* Password */}
      <TextField
        fullWidth
        placeholder="••••••••••"
        variant="outlined"
        size="small"
        type="password"
        InputProps={{
          startAdornment: <LockOutlinedIcon sx={{ color: "#c4bcd8", mr: 1 }} />,
        }}
        sx={{ mb: 1.5 }}
      />

      {/* Remember / Forgot */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <FormControlLabel
          control={<Checkbox sx={{ color: "#7b4fff" }} />}
          label="Remember me"
          sx={{
            "& .MuiFormControlLabel-label": { fontSize: 12, color: "#9992b0" },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            alignSelf: "center",
            color: "#7b4fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Forgot password?
        </Typography>
      </Box>

      {/* Sign In Button */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          background:
            "linear-gradient(90deg,#e96cff 0%,#7b4fff 50%,#3a8eff 100%)",
          color: "#fff",
          fontWeight: 700,
          mb: 2,
          "&:hover": {
            background:
              "linear-gradient(90deg,#e96cff 0%,#7b4fff 50%,#3a8eff 100%)",
          },
        }}
      >
        Sign in →
      </Button>

      {/* Footer */}
      <Typography
        variant="caption"
        sx={{ textAlign: "center", color: "#9992b0" }}
      >
        Don’t have an account?{" "}
        <Typography
          component="span"
          sx={{
            background: "linear-gradient(90deg,#e96cff,#7b4fff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 600,
          }}
        >
          Sign up free
        </Typography>
      </Typography>
    </Box>
  );
};

export default LoginPopup;
