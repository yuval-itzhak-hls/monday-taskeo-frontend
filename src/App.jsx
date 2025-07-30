import React, { useState } from "react";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [file, setFile] = useState(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      alert("Please select a PDF file only");
    }
  };

  const handleSubmit = () => {
    if (!file) {
      alert("No file selected!");
      return;
    }

    console.log("Selected file:", file);
    alert(`File submitted: ${file.name}`);
    toggleModal(); // Close modal after submission
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Small open button */}
      <button onClick={toggleModal} style={{ fontSize: 24 }}>
        Upload a PRD
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            backgroundColor: "white",
            padding: "2rem",
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <h2>Upload Specification Document</h2>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <br />
          {file && <p style={{ marginTop: "1rem" }}>📎 {file.name}</p>}

          <div style={{ marginTop: "1.5rem" }}>
            <button onClick={handleSubmit} style={{ marginRight: "1rem" }}>
              Submit
            </button>
            <button onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
