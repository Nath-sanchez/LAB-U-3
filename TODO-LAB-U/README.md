# Petal List — Beige & Pastel Pink To-Do Planner

A React + Tailwind CSS + React Router DOM task manager made for DCIT 26 Laboratory 3.

## Features
- Dashboard with total, completed, and pending task counts
- Create and delete task groups
- Add, complete/uncomplete, search, filter, and delete tasks
- User guide and Developers page
- React Router routes: `/`, `/groups`, `/groups/:groupId`, `/guide`, `/developers`
- localStorage persistence
- Responsive beige and pastel pink UI

## Requirements
Install Node.js LTS from https://nodejs.org/ and a code editor such as Visual Studio Code.

## Run locally
1. Extract this project ZIP.
2. Open the extracted `beige-pink-todo` folder in Visual Studio Code.
3. Open Terminal > New Terminal.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local address Vite prints, usually `http://localhost:5173`.

## Build test
Run `npm run build`. The production-ready website will be generated in the `dist` folder.

## Deploy to Vercel
1. Create a GitHub repository and upload the project files.
2. Go to https://vercel.com/ and sign in with GitHub.
3. Select Add New > Project, then import your repository.
4. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
5. Click Deploy. Vercel will provide a public URL.

Vercel needs SPA route fallback for direct refreshes on React Router paths. Create a `vercel.json` file in the project root with:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## Before submitting
- Open the Developers page and replace the sample name with every member's complete name and contribution.
- Test adding tasks, toggling Done/Not Done, deleting tasks, creating groups, filters, dashboard counts, and page navigation.
- Test the deployed URL and refresh a group route directly.
- Submit the public deployed website URL, not a Google Drive link.
