# Team Task Manager Full-Stack Application

This is a full-stack application for managing projects and tasks, with role-based access control (Admin/Member). 

## Directory Structure

- `backend/` - Node.js/Express backend with Prisma and PostgreSQL.
- `frontend/` - React application built with Vite and vanilla CSS.

## Local Development

### 1. Database Setup
You will need a PostgreSQL database. You can run one locally or use a free cloud provider.

### 2. Backend
1. Navigate to the `backend` folder: `cd backend`
2. Update the `.env` file with your `DATABASE_URL` and a `JWT_SECRET`.
3. Push the database schema: `npx prisma db push`
4. Generate the Prisma client: `npm run build`
5. Start the server: `npm run dev` (Runs on http://localhost:5000)

### 3. Frontend
1. Navigate to the `frontend` folder: `cd frontend`
2. Create an `.env` file in the frontend folder with: `VITE_API_URL=http://localhost:5000/api`
3. Start the dev server: `npm run dev`

## Deployment via Railway 🚀

Railway makes it incredibly easy to deploy this application. Follow these steps:

### Prerequisites
1. Create a GitHub repository and push this entire codebase (including `frontend` and `backend` folders) to it.
2. Sign up / Log in to [Railway](https://railway.app/).

### Step 1: Provision the Database
1. In Railway, click **New Project** -> **Provision PostgreSQL**.
2. Railway will instantly create a PostgreSQL database.

### Step 2: Deploy the Backend
1. In the same Railway project, click **New** -> **GitHub Repo**.
2. Select your repository. 
3. After adding it, click on the newly created service.
4. Go to **Settings** -> **Root Directory** and type `/backend`.
5. Go to **Variables**:
   - Railway might auto-detect the PostgreSQL DB. If not, add a variable `DATABASE_URL` and reference the PostgreSQL service's `DATABASE_URL`.
   - Add `JWT_SECRET` and set it to a secure random string.
6. Under **Settings** -> **Build Command**, put `npm run build`.
7. Under **Settings** -> **Start Command**, put `npm start`.
8. Railway will now build and deploy your backend. Once done, go to the **Settings** tab and click **Generate Domain** under Networking. Copy this URL (e.g., `https://your-backend-app.up.railway.app`).

### Step 3: Deploy the Frontend
1. In the same Railway project, click **New** -> **GitHub Repo** again.
2. Select your repository again.
3. Click on this second service.
4. Go to **Settings** -> **Root Directory** and type `/frontend`.
5. Go to **Variables** and add:
   - `VITE_API_URL` = `https://your-backend-app.up.railway.app/api` (The domain you generated in Step 2, make sure to add `/api` at the end).
6. Under **Settings** -> **Build Command**, put `npm run build`.
7. Under **Settings** -> **Start Command**, put `npm run preview -- --port $PORT --host 0.0.0.0` or deploy as a Static Site if you prefer.
8. Generate a Domain for the frontend.

🎉 **Your app is now live and fully functional!**
