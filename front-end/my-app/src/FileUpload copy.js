import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [signing, setSigning] = useState(false); // New state for signing status
  const [fileUrl, setFileUrl] = useState("");
  const [signedFileUrl, setSignedFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/uploads/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setFileUrl(`http://localhost:8000${response.data.file_url}`);
        setSignedFileUrl(""); // Reset signed file URL on new upload
        alert("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSign = async () => {
    if (!fileUrl) {
      alert("Please upload a file first.");
      return;
    }

    setSigning(true); // Start signing process

    try {
      const response = await axios.get("http://localhost:8000/uploads/sign/");
      
      if (response.status === 200) {
        const signedPdfUrl = `http://localhost:8000${response.data.signed_pdf_url}`;
        setSignedFileUrl(signedPdfUrl);
        alert("File signed successfully! Click 'Download Signed File' to get it.");
      }
    } catch (error) {
      console.error("Error signing file:", error);
      alert("Error signing file. Please try again.");
    } finally {
      setSigning(false); // End signing process
    }
  };

  return (
    <div className="flex center full bg-light">
      <div className="card">
        <h2 className="title">Upload File</h2>
        <input type="file" onChange={handleFileChange} className="input mb-4" />

        <div className="btn-group">
          <button onClick={handleUpload} className="btn primary full" disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </button>

          <button onClick={handleSign} className="btn secondary full" disabled={!fileUrl || signing}>
            {signing ? "Signing..." : "Sign"}
          </button>
        </div>

        {fileUrl && (
          <div className="mt-4">
            <p>File uploaded successfully.</p>
            <p> Access it here: </p>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {fileUrl}
            </a>
          </div>
        )}

        {signedFileUrl && (
          <div className="mt-4">
            <p> File signed successfully!</p>
            <a href={signedFileUrl} download className="btn success full">
              Download Signed File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
