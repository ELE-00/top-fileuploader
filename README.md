# 📁 TOP - FileUploader

[![Node.js](https://img.shields.io/badge/Node.js-v22.16.0-brightgreen)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/) 
[![Prisma](https://img.shields.io/badge/Prisma-6.x-lightgrey)](https://www.prisma.io/) 
[![Passport](https://img.shields.io/badge/Passport.js-authentication-yellowgreen)](http://www.passportjs.org/)

A file management web application built with **Express**, **Prisma**, and **Passport.js**, allowing users to manage folders, upload files, and store them in the cloud.

---

## 🚀 Features

- **Authentication & Sessions**
  - Session-based authentication using **Passport.js**
  - Sessions persisted in the database using **Prisma Session Store**

- **File Upload**
  - Upload files (images, PDFs, videos) for authenticated users
  - Metadata saved in PostgreSQL (name, size, URL, public ID, upload time)
  - Supports cloud storage via **Cloudinary**

- **Folders**
  - Users can **create, view, update, delete folders**
  - Upload files into specific folders
  - Full CRUD functionality implemented via Express routes + Prisma

- **File Details & Download**
  - View file info (name, size in KB/MB, uploaded at)
  - Download files via secure links

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** Passport.js, express-session, Prisma Session Store
- **File Upload:** Multer for handling multipart/form-data
- **Cloud Storage:** Cloudinary (alternative: Supabase Storage)
- **Templating:** EJS

---
