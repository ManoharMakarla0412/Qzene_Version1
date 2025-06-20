import React, { StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeProvider } from "./contexts/RecipeContext";
import { ReactQueryProvider } from "./providers/query-client-provider";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import UserIndex from "./pages/Index";
import Auth from "./pages/Auth";
import AllRecipes from "./pages/AllRecipes";
import CuisinesPage from "./pages/CuisinesPage";
import DevicesPage from "./pages/DevicesPage";
import RecipeDetail from "./pages/RecipeDetail";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

// Admin
import AdminLayout from "./admin/pages/Index"; // This will be our admin layout wrapper
import CreateRecipe from "./admin/components/createRecipe/createRecipe";

// Utilities
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ErrorBoundary>
      <div className="App min-h-screen flex flex-col overflow-y-auto">
        <StrictMode>
          <ReactQueryProvider>
            <Router>
              <AuthProvider>
                <RecipeProvider>
                  <div className="flex-1">
                    <Routes>
                      {/* ✅ User Routes */}
                      <Route path="/" element={<UserIndex />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/all-recipes" element={<AllRecipes />} />
                      <Route path="/cuisines" element={<CuisinesPage />} />
                      <Route path="/devices" element={<DevicesPage />} />
                      <Route path="/recipes/:id" element={<RecipeDetail />} />

                      {/* ✅ Admin Routes (Protected with Nested Routing) */}
                      <Route
                        path="/admin/*"
                        element={
                          <ProtectedRoute adminOnly={true}>
                            <AdminLayout />
                          </ProtectedRoute>
                        }
                      />

                      {/* ✅ Standalone Admin Routes */}
                      <Route
                        path="/admin/create-recipe"
                        element={
                          <ProtectedRoute adminOnly={true}>
                            <CreateRecipe />
                          </ProtectedRoute>
                        }
                      />

                      {/* ✅ Dashboard - Protected (for Authenticated Users) */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* ❌ Catch-all */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <Toaster
                    position="top-right"
                    richColors
                    toastOptions={{
                      className:
                        "w-[400px] p-4 text-sm flex items-center shadow-lg rounded-lg",
                    }}
                  />
                </RecipeProvider>
              </AuthProvider>
            </Router>
          </ReactQueryProvider>
        </StrictMode>
      </div>
    </ErrorBoundary>
  );
}

export default App;
