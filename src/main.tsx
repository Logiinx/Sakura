// Import the 'createRoot' function from 'react-dom/client' to render the React app.
// This is the modern way to render React apps (React 18+).
import { createRoot } from 'react-dom/client';

// Import the main application component.
// './App' means the 'App.tsx' file in the same directory.
import App from './App';

// Import the global CSS file.
// This file often contains base styles, resets, and Tailwind CSS imports.
import './index.css';

// Ensure strict error checking during development.
// This helps catch potential issues early.
// Note: The '!' after document.getElementById('root') is a non-null assertion operator in TypeScript.
// It tells TypeScript that we are sure 'rootElement' will not be null or undefined.
// However, it's generally safer to check for null explicitly, as done below.
const rootElement = document.getElementById('root');

// Check if the root element exists in the HTML file (usually index.html).
// If it doesn't, throw an error because React needs a place to mount the application.
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create a React root attached to the 'rootElement' and render the 'App' component inside it.
// This starts the React application.
createRoot(rootElement).render(<App />);
