# Smart Home Cloud

Smart Home Cloud is a modern full-stack smart home automation web application built for cloud project demos. It simulates four smart appliances with rich UI animations, voice commands, and persistent cloud-backed state using MongoDB Atlas.

## Features

- Premium dark-mode dashboard with animated cards for Light, Fan, Door, and AC
- Voice control using the browser Web Speech API
- MongoDB Atlas persistence so device states survive page refreshes
- Express.js REST API with reusable MongoDB device model
- Toast notifications, loading states, sync timestamps, and API error handling
- Responsive layout for desktop, tablet, and mobile screens
- Ready for Vercel frontend deployment and Render backend deployment

## Project Structure

```text
smart-home-cloud/
  client/
  server/
  .env.example
  README.md
```

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios
- react-hot-toast

### Backend

- Node.js
- Express.js
- Mongoose
- MongoDB Atlas
- CORS

## API Routes

- `GET /api/devices`
- `PUT /api/devices/light`
- `PUT /api/devices/fan`
- `PUT /api/devices/door`
- `PUT /api/devices/ac`
- `GET /api/health`

### Example Update Payloads

```json
{
  "status": "on"
}
```

```json
{
  "status": "open"
}
```

```json
{
  "status": "on",
  "temperature": 22
}
```

## Local Setup

### 1. Clone or open the project folder

```bash
cd smart-home-cloud
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173
```

If your MongoDB password contains special characters such as `@`, `:` or `/`, URL-encode the password portion before pasting it into `MONGODB_URI`.

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Run the backend

```bash
cd server
npm run dev
```

### 6. Run the frontend

```bash
cd client
npm run dev
```

The frontend opens on `http://localhost:5173` and the backend runs on `http://localhost:5000`.

## MongoDB Atlas Connection Guide

### 1. Create an Atlas project and cluster

1. Sign in to MongoDB Atlas.
2. Create a new project named `smart-home-cloud`.
3. Create a free shared cluster.

### 2. Create the database user

1. Go to `Database Access`.
2. Add a new database user with a username and password.
3. Save the credentials for your connection string.

### 3. Allow network access

1. Go to `Network Access`.
2. Add your current IP address for development.
3. For demos, you can temporarily add `0.0.0.0/0`, but for production use a tighter allowlist.

### 4. Get the connection string

1. Open `Clusters`.
2. Click `Connect`.
3. Select `Drivers`.
4. Copy the connection string and replace:
   - `<username>` with your Atlas username
   - `<password>` with your Atlas password
   - the database name with `smart-home-cloud`

### 5. Add it to `server/.env`

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smart-home-cloud?retryWrites=true&w=majority&appName=Cluster0
```

## Render Deployment Guide for Backend

### 1. Push the project to GitHub

Create a GitHub repository and push the `smart-home-cloud` folder.

### 2. Create a new Render Web Service

1. Sign in to Render.
2. Click `New +` and choose `Web Service`.
3. Connect your GitHub repository.
4. Select the repository.

### 3. Configure the service

- Root Directory: `smart-home-cloud/server`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

### 4. Add environment variables in Render

- `PORT=10000`
- `MONGODB_URI=your_atlas_connection_string`
- `CLIENT_URL=https://your-vercel-frontend-domain.vercel.app`

Render will expose a backend URL such as:

```text
https://smart-home-cloud-api.onrender.com
```

### 5. Update the frontend environment

Set the frontend API variable to:

```env
VITE_API_BASE_URL=https://smart-home-cloud-api.onrender.com/api
```

## Vercel Deployment Guide for Frontend

### 1. Import the GitHub repository into Vercel

1. Sign in to Vercel.
2. Click `Add New...` then `Project`.
3. Import your repository.

### 2. Configure the project

- Root Directory: `smart-home-cloud/client`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### 3. Add environment variable in Vercel

```env
VITE_API_BASE_URL=https://your-render-backend-domain.onrender.com/api
```

### 4. Redeploy after setting variables

Once the frontend is redeployed, it will call the Render backend using the deployed API URL.

## Render + Vercel CORS Note

When the frontend is deployed, update the backend `CLIENT_URL` to the exact Vercel domain. If you use both local and deployed frontends, you can provide multiple origins separated by commas:

```env
CLIENT_URL=http://localhost:5173,https://your-project.vercel.app
```

## Demo Commands for Voice Control

- `turn on light`
- `turn off light`
- `turn on fan`
- `turn off fan`
- `open door`
- `close door`
- `turn on ac`
- `turn off ac`

## Device State Behavior

- Light ON: bright yellow glow
- Light OFF: dim gray state
- Fan ON: continuous rotation animation
- Fan OFF: static icon
- Door OPEN: animated open state
- Door CLOSED: secure closed state
- AC ON: blue glow with temperature
- AC OFF: inactive cooling state

## Production Notes

- The backend seeds default device documents automatically on first launch.
- Device state updates are validated server-side before saving to MongoDB.
- The frontend uses Axios timeouts and friendly toast notifications for API errors.
- Web Speech API support is best in Chromium-based browsers like Google Chrome and Microsoft Edge.

## Available Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Submission Checklist

- Full source code in `client/` and `server/`
- Backend `.env.example` in `server/.env.example`
- Frontend `.env.example` in `client/.env.example`
- Combined environment reference in `.env.example`
- README with local setup, Atlas, Render, and Vercel deployment guides
