import React, { useState } from "react";
import mondaySdk from "monday-sdk-js";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const monday = mondaySdk();
// const API_TOKEN =
//   "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU0MzcwMjM4NCwiYWFpIjoxMSwidWlkIjo3NjgzMTY2OCwiaWFkIjoiMjAyNS0wNy0yOFQwODoxNTo0My4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTEwMjMyOCwicmduIjoidXNlMSJ9.jr_7kxFtUmsNgt9kkMKWfRNmvvqTRNoxUqDYhSA4jMI";

const API_TOKEN = import.meta.env.VITE_API_KEY || "";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [boardName, setBoardName] = useState("");
  const [apiToken] = useState(API_TOKEN);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const toggleModal = () => {
    if (!loading) {
      setIsOpen(!isOpen);
      setFile(null);
      setBoardName("");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      alert("Please select a PDF file only");
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("No file selected!");
    if (!boardName) return alert("Please enter a board name!");
    if (!apiToken) return alert("Unable to retrieve Monday API token.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("board_name", boardName);
    formData.append("monday_api_key", apiToken);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/generate-board/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSnackbar({
          open: true,
          message: data.message || "Board generated successfully!",
          severity: "success",
        });
        toggleModal();
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Something went wrong",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error submitting data:", err);
      setSnackbar({
        open: true,
        message: "Failed to submit. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="contained" onClick={toggleModal}>
        Upload a PRD
      </Button>

      <Dialog open={isOpen} onClose={toggleModal} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Specification Document</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Board Name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              fullWidth
            />
            <Button variant="outlined" component="label" disabled={loading}>
              Select PDF
              <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
            </Button>
            {file && (
              <Typography variant="body2" color="text.secondary">
                📎 {file.name}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal} disabled={loading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!file || loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
