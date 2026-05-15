import { useState } from "react";
import "./RegisterPage.css";
import {
  Box, Typography, TextField, Button,
  IconButton, InputAdornment, Avatar,
} from "@mui/material";
import {
  PersonOutlined, EmailOutlined, LockOutlined,
  PhoneOutlined, CalendarMonthOutlined,
  Visibility, VisibilityOff, PhotoCameraOutlined,
} from "@mui/icons-material";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [preview, setPreview]           = useState(null);
  const [form, setForm] = useState({
    userName: "", userEmail: "", password: "", confirmPassword: "",
    userPhoneNo: "", dob: "", profilePhoto: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, profilePhoto: file });
    setErrors({ ...errors, profilePhoto: "" });
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.userName.trim())     errs.userName        = "Username is required";
    if (!form.userEmail.trim())    errs.userEmail       = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.userEmail))
                                   errs.userEmail       = "Enter a valid email";
    if (!form.userPhoneNo.trim())  errs.userPhoneNo     = "Phone is required";
    else if (!/^\d{10}$/.test(form.userPhoneNo))
                                   errs.userPhoneNo     = "Enter a valid 10-digit number";
    if (!form.dob)                 errs.dob             = "Date of birth is required";
    if (!form.password)            errs.password        = "Password is required";
    else if (form.password.length < 6)
                                   errs.password        = "Minimum 6 characters";
    if (!form.confirmPassword)     errs.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password)
                                   errs.confirmPassword = "Passwords do not match";
    if (!form.profilePhoto)        errs.profilePhoto    = "Profile photo is required";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    alert("Registered successfully!");
  };

  // Shared MUI TextField sx — keeps field styles consistent
  const inputSx = (name) => ({
    mb: errors[name] ? 0.5 : 1.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      background: "#f3f0fb",
      "& fieldset": {
        borderColor: errors[name] ? "#ff4d4d" : "#e0d9f5",
        borderWidth: "1.5px",
      },
      "&:hover fieldset":    { borderColor: "#7b4fff" },
      "&.Mui-focused fieldset": { borderColor: "#7b4fff", borderWidth: "1.5px" },
    },
    "& .MuiInputBase-input": { fontSize: 14, color: "#1a1230", padding: "12px 14px 12px 0" },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: "#b0a8c8", fontSize: 20 },
    "& .MuiFormHelperText-root": { color: "#ff4d4d", fontSize: 11, marginLeft: 0 },
  });

  return (
    <div className="register-page">

      {/* Animated Triangle SVG Layer */}
      <svg className="tri-layer" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <polygon className="tri-float1" points="-60,20 280,20 110,320"       fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5"/>
        <polygon className="tri-float2" points="20,80 240,80 130,270"         fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <polygon className="tri-float3" points="-60,560 380,560 160,920"      fill="none" stroke="rgba(255,255,255,0.2)"  strokeWidth="1.5"/>
        <polygon className="tri-float4" points="60,680 280,680 170,880"       fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1"/>
        <polygon className="tri-float2" points="1160,10 1500,10 1340,260"     fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5"/>
        <polygon className="tri-float1" points="1220,60 1460,60 1340,240"     fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <polygon className="tri-spin"   points="1080,580 1500,580 1300,920"   fill="none" stroke="rgba(255,255,255,0.2)"  strokeWidth="1.5"/>
        <polygon className="tri-float3" points="1180,660 1440,660 1320,860"   fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1"/>
      </svg>

      {/* Card */}
      <div className="register-card">

        {/* Profile Photo Upload */}
        <div className="photo-section">
          <div className="photo-wrapper">
            <Avatar
              src={preview || undefined}
              sx={{
                width: 72, height: 72,
                background: preview ? "transparent" : "linear-gradient(135deg,#a855f7,#7b4fff)",
                fontSize: 28,
                boxShadow: "0 4px 16px rgba(123,79,255,0.4)",
                border: errors.profilePhoto ? "2px solid #ff4d4d" : "none",
              }}
            >
              {!preview && "✦"}
            </Avatar>
            <label htmlFor="photo-upload">
              <div className="photo-camera-btn">
                <PhotoCameraOutlined sx={{ fontSize: 14, color: "#fff" }} />
              </div>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhoto}
            />
          </div>
          {errors.profilePhoto
            ? <span className="photo-error">⚠ {errors.profilePhoto}</span>
            : <span className="photo-hint">
                {preview ? "Photo selected ✓" : "Upload profile photo"}
              </span>
          }
        </div>

        {/* Heading */}
        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 700, color: "#1a1230", mb: 0.5 }}>
          Create account
        </Typography>
        <Typography sx={{ textAlign: "center", fontSize: 13, color: "#9992b0", mb: 2.5 }}>
          Sign up to get started
        </Typography>

        {/* Username */}
        <TextField
          fullWidth name="userName" placeholder="Username"
          value={form.userName} onChange={handleChange}
          error={!!errors.userName} helperText={errors.userName}
          InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlined /></InputAdornment> }}
          sx={inputSx("userName")}
        />

        {/* Email */}
        <TextField
          fullWidth name="userEmail" type="email" placeholder="Email address"
          value={form.userEmail} onChange={handleChange}
          error={!!errors.userEmail} helperText={errors.userEmail}
          InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined /></InputAdornment> }}
          sx={inputSx("userEmail")}
        />

        {/* Phone */}
        <TextField
          fullWidth name="userPhoneNo" type="tel" placeholder="Phone number (10 digits)"
          value={form.userPhoneNo} onChange={handleChange}
          error={!!errors.userPhoneNo} helperText={errors.userPhoneNo}
          InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlined /></InputAdornment> }}
          sx={inputSx("userPhoneNo")}
        />

        {/* Date of Birth */}
        <TextField
          fullWidth name="dob" type="date"
          value={form.dob} onChange={handleChange}
          error={!!errors.dob} helperText={errors.dob}
          inputProps={{ max: new Date().toISOString().split("T")[0] }}
          InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthOutlined /></InputAdornment> }}
          sx={{
            ...inputSx("dob"),
            "& input[type='date']::-webkit-calendar-picker-indicator": {
              opacity: 0.5, cursor: "pointer",
            },
          }}
        />

        {/* Password */}
        <TextField
          fullWidth name="password" placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={form.password} onChange={handleChange}
          error={!!errors.password} helperText={errors.password}
          InputProps={{
            startAdornment: <InputAdornment position="start"><LockOutlined /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(p => !p)} edge="end" size="small"
                  sx={{ color: "#b0a8c8", "&:hover": { color: "#7b4fff" } }}>
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputSx("password")}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth name="confirmPassword" placeholder="Confirm password"
          type={showConfirm ? "text" : "password"}
          value={form.confirmPassword} onChange={handleChange}
          error={!!errors.confirmPassword} helperText={errors.confirmPassword}
          InputProps={{
            startAdornment: <InputAdornment position="start"><LockOutlined /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(p => !p)} edge="end" size="small"
                  sx={{ color: "#b0a8c8", "&:hover": { color: "#7b4fff" } }}>
                  {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputSx("confirmPassword")}
        />

        {/* Submit */}
        <Button fullWidth className="register-btn" onClick={handleSubmit} sx={{ mt: 1 }}>
          CREATE ACCOUNT →
        </Button>

        {/* Footer */}
        <p className="register-footer">
          Already have an account?{" "}
          <span className="sign-in-link">Sign in</span>
        </p>
      </div>
    </div>
  );
}
