/**
 * src/App.tsx
 * 
 * This is the root component of the React application.
 * It sets up global providers (like data fetching, UI tooltips) and defines the main routing structure.
 */

// --- Imports --- //

// UI Components from shadcn-ui library (located in @/components/ui)
// Toaster: Used for displaying brief notifications (often for success/error messages).
import { Toaster } from "@/components/ui/toaster"; 
// Sonner: Another toast component library, potentially used for different styles or positions.
import { Toaster as Sonner } from "@/components/ui/sonner"; 
// TooltipProvider: Enables the use of tooltips throughout the application (required by shadcn-ui tooltips).
import { TooltipProvider } from "@/components/ui/tooltip";

// Data Fetching Library (React Query)
// QueryClient: Manages the cache for fetched data.
// QueryClientProvider: Makes the QueryClient available to all components in the app.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Routing Library (React Router DOM)
// BrowserRouter: Provides routing capabilities using the browser's history API.
// Routes: Container for defining individual Route components.
// Route: Defines a mapping between a URL path and a React component.
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page Components (located in ./pages/)
// These components represent the different pages of the application.
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import BookNow from "./pages/BookNow";
import NotFound from "./pages/NotFound"; // Page displayed for invalid URLs

// Layout Components (located in ./components/)
// Layout: A wrapper component that likely contains common UI elements like header/footer.
import Layout from "./components/Layout";
// SakuraPetals: A custom component, possibly for background animation or decoration.
import SakuraPetals from "./components/SakuraPetals";

// --- React Query Client Setup --- //

// Create a new instance of QueryClient to manage server state (fetched data).
const queryClient = new QueryClient({
  // Default options for all queries made using this client.
  defaultOptions: {
    queries: {
      // staleTime: How long data is considered fresh (in milliseconds) before potentially refetching.
      // 5 * 60 * 1000 = 5 minutes.
      staleTime: 5 * 60 * 1000, 
      // refetchOnWindowFocus: Whether to automatically refetch data when the browser window regains focus.
      // Setting to `false` disables this behavior.
      refetchOnWindowFocus: false,
    },
  },
});

// --- App Component Definition --- //

/**
 * The main App functional component.
 * It wraps the application content with necessary providers and sets up routes.
 */
const App = () => (
  // Provide the React Query client to the entire application.
  // Any component within this provider can now use React Query hooks (like useQuery).
  <QueryClientProvider client={queryClient}>
    {/* Provide tooltip context (required for shadcn-ui tooltips). */}
    <TooltipProvider>
      {/* Render the Toaster component - this is where toast notifications will appear. */}
      <Toaster />
      {/* Render the Sonner component - for other toast notifications. */}
      <Sonner />
      {/* Render the custom SakuraPetals component. */}
      <SakuraPetals />
      
      {/* Set up client-side routing using BrowserRouter. */}
      <BrowserRouter>
        {/* Define the routes for the application. */}
        <Routes>
          {/* Define a parent route that uses the Layout component. */}
          {/* All nested routes will render inside the Layout component's <Outlet />. */}
          <Route path="/" element={<Layout />}>
            {/* Index Route: Rendered when the path is exactly "/". Uses the Index page component. */}
            <Route index element={<Index />} />
            {/* Other Page Routes: Map specific URL paths to their corresponding page components. */}
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-now" element={<BookNow />} />
            {/* Wildcard Route: Matches any path not matched above. Renders the NotFound page. */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Export the App component to be used in main.tsx.
export default App;
