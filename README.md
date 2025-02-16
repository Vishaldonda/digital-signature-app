# Full-Stack Digital Signature Application

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Setup and Installation](#setup-and-installation)
  - [1. Keycloak (Authentication)](#1-keycloak-authentication)
  - [2. Backend (Django)](#2-backend-django)
  - [3. Frontend (React)](#3-frontend-react)
- [Usage Guide](#usage-guide)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [File Upload & Signing](#file-upload--signing)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Additional Information](#additional-information)
- [References](#References)

---

## Introduction
This is a **full-stack web application** that allows users to upload and digitally sign PDF documents. The system consists of:
- **Frontend**: Built with **React** for user interaction.
- **Backend**: Built with **Django** for handling file uploads and digital signatures.
- **Authentication**: Managed by **Keycloak**, an open-source identity and access management solution.

---

## Features
-  User authentication via Keycloak (Registration & Login)  
- Secure file upload via Django backend  
- Digital signature integration using PyHanko  
- Simple and user-friendly React interface  
- API-based interaction between frontend and backend  

---

## Technology Stack
| Component      | Technology Used  |
|---------------|-----------------|
| Frontend      | React.js, Axios  |
| Backend       | Django, Django REST Framework, PyHanko |
| Authentication | Keycloak |
| Database      | SQLite/PostgreSQL |
| Deployment    | Localhost / Docker (optional) |

---

## System Architecture
```
React (Frontend)  --->  Keycloak (Auth)  --->  Django (Backend)  --->  Digital Signing (PyHanko)
```

---

## Setup and Installation
Follow these steps to set up the application on your local machine.

### 1. Keycloak (Authentication)
1. **Download & Run Keycloak**
   ```bash
   cd /path/to/keycloak
   bin/kc.bat start-dev  # (Windows)
   bin/kc.sh start-dev    # (Linux/macOS)
   ```
2. **Access Keycloak Admin Panel** at `http://localhost:8080`
3. **Create a Realm** (e.g., `demo`)
4. **Create a Client**
   - Client ID: `demo_client`
   - Access Type: `public`
5. **Create Users** under the `Users` tab

### 2. Backend (Django)
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo.git
   cd backend
   ```
2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # (Linux/macOS)
   venv\Scripts\activate  # (Windows)
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run Server**
   ```bash
   python manage.py runserver
   ```
5. **Backend available at** `http://localhost:8000`

### 3. Frontend (React)
1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start React App**
   ```bash
   npm start
   ```
4. **Frontend available at** `http://localhost:3000`

---

## Usage Guide

### User Registration
- Go to `http://localhost:3000/register`
- Fill in username, email, and password
- Click "Register"
- The user is added to Keycloak

### User Login
- Go to `http://localhost:3000/login`
- Enter credentials
- On success, redirects to file upload page

### File Upload & Signing
- Go to `http://localhost:3000/upload`
- Select a PDF file and upload
- File is signed using PyHanko and stored securely

---

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate user with Keycloak |
| POST | `/api/upload` | Upload a PDF file |
| GET | `/api/files` | List uploaded files |
| GET | `/api/files/{id}` | Download a signed PDF |

---

## Troubleshooting
### CORS Error When Calling Keycloak API
**Solution**: Add the following to `Keycloak` client settings:
- Allowed Web Origins: `http://localhost:3000`
- Web Origins: `*`

### Keycloak Login Fails (Invalid Credentials)
**Solution**:
- Ensure the user is created in Keycloak under the correct realm
- Double-check the client ID and secret

---

## Additional Information

### How is the Digital Signature Handled?
Here's a breakdown of how we handle the digital signature process in our Django application using PyHanko and OpenSSL:

1. **File Upload & Selection**  
   - Users upload a PDF file via our Django API.
   - The system fetches the latest uploaded file from the media directory.

2. **Key & Certificate Generation**  
   - If a `.pfx` file (PKCS#12 certificate) doesn’t already exist, we generate:
     - A private key (`private_key.pem`).
     - A self-signed certificate (`certificate.pem`).
     - A `.pfx` file (`my_certificate.pfx`) using OpenSSL, which bundles both.

3. **PDF Preprocessing (Fixing & Cleaning)**  
   - Since PDFs can sometimes contain structural inconsistencies, we use Ghostscript (`gswin64c`) to clean and optimize the file.
   - The output is stored as `fixed_output.pdf`.

4. **Adding a Signature Field**  
   - A signature field (`MySignature`) is added to the cleaned PDF using PyHanko (`IncrementalPdfFileWriter`).
   - The modified file is saved as `fixed_with_sig.pdf`.

5. **Digital Signing Process**  
   - PyHanko loads the `.pfx` file and applies the digital signature to the signature field.
   - The final signed document is stored as `signed_output.pdf`.

6. **Response & Output**  
   - The signed file is returned via API, accessible at `/media/output/signed_output.pdf`.

### How Cryptography is Used in Our Process
- **Public-Key Cryptography (PKI):** We use RSA keys to sign the PDF securely.
- **PKCS#12 (.pfx):** This format ensures both the private key and certificate are bundled securely.
- **OpenSSL:** Handles key/certificate generation and conversion.
- **PyHanko:** Implements the cryptographic signing process within the PDF.

---

## References

- Keycloak Admin REST API :  https://www.keycloak.org/docs-api/latest/rest-api/index.html#_users

