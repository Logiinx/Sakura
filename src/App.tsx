/**
 * src/App.tsx
 *
 * This is the root component of the React application.
 * It sets up global providers (like data fetching, UI tooltips) and defines the main routing structure.
 */

// --- Imports --- //

import { QueryClient, QueryClientProvider } from "@tanstack/react-query" // Data Fetching Library (React Query)
// QueryClient: Manages the cache for fetched data.
// QueryClientProvider: Makes the QueryClient available to all components in the app.
// Routing Library (React Router DOM)
// BrowserRouter: Provides routing capabilities using the browser's history API.
// Routes: Container for defining individual Route components.
// Route: Defines a mapping between a URL path and a React component.
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Sonner: Another toast component library, potentially used for different styles or positions.
import { Toaster as Sonner } from "@/components/ui/sonner"
// UI Components from shadcn-ui library (located in @/components/ui)
// Toaster: Used for displaying brief notifications (often for success/error messages).
import { Toaster } from "@/components/ui/toaster"
// TooltipProvider: Enables the use of tooltips throughout the application (required by shadcn-ui tooltips).
import { TooltipProvider } from "@/components/ui/tooltip"

import AdminImages from "./admin/AdminImages"
import ProtectedRoute from "./admin/ProtectedRoute"
// Layout: A wrapper component that likely contains common UI elements like header/footer.
import Layout from "./components/Layout"
// SakuraPetals: A custom component, possibly for background animation or decoration.
import SakuraPetals from "./components/SakuraPetals"
import ScrollToTop from "./components/ScrollToTop"
import ScrollToTopButton from "./components/ScrollToTopButton"
import BookNow from "./pages/BookNow"
import Contact from "./pages/Contact"
import Galerie from "./pages/Galerie"
// Page Components (located in ./pages/)
// These components represent the different pages of the application.
import Index from "./pages/Index"
import MentionsLegales from "./pages/MentionsLegales"
import NotFound from "./pages/NotFound" // Page displayed for invalid URLs
import PackageFourPage from "./pages/PackageFourPage"
import PackageOnePage from "./pages/PackageOnePage"
import PackageThreePage from "./pages/PackageThreePage"
import PackageTwoPage from "./pages/PackageTwoPage"
import Partenaires from "./pages/Partenaires"

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
})

const App = () => {
  // Correctly return the main application structure
  return (
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
          {/* Component to handle scrolling to top on route changes */}
          <ScrollToTop />
          {/* Floating button to scroll to top */}
          <ScrollToTopButton />
          {/* Define the routes for the application. */}
          <Routes>
            {/* Define a parent route that uses the Layout component. */}
            {/* All nested routes will render inside the Layout component's <Outlet />. */}
            <Route path="/" element={<Layout />}>
              {/* Index Route: Rendered when the path is exactly "/". Uses the Index page component. */}
              <Route index element={<Index />} />
              {/* Other Page Routes: Map specific URL paths to their corresponding page components. */}
              <Route path="/galerie" element={<Galerie />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/book-now" element={<BookNow />} />
              <Route path="/grossesse" element={<PackageOnePage />} />
              <Route path="/famille" element={<PackageTwoPage />} />
              <Route path="/bebe" element={<PackageThreePage />} />
              <Route path="/complices" element={<PackageFourPage />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/partenaires" element={<Partenaires />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminImages />
                  </ProtectedRoute>
                }
              />
              {/* Wildcard Route: Matches any path not matched above. Renders the NotFound page. */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

// Export the App component to be used in main.tsx.
export default App
