import React, { StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import UserIndex from "./pages/Index";
import Auth from "./pages/Auth";
import AllRecipes from "./pages/AllRecipes";
import CuisinesPage from "./pages/CuisinesPage";
import DevicesPage from "./pages/DevicesPage";
import RecipeDetail from "./pages/RecipeDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ReactQueryProvider } from "./providers/query-client-provider";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminDashboard from "./admin/pages/Index";
import CreateRecipe from "./admin/components/createRecipe/createRecipe";

function App() {
  return (
    <ErrorBoundary>
      <div className="App min-h-screen flex flex-col overflow-y-auto">
        <StrictMode>
          <ReactQueryProvider>
            <Router basename="/">
              <AuthProvider>
                <div className="flex-1">
                  <Routes>
                    {/* User Routes */}
                    <Route path="/" element={<UserIndex />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/all-recipes" element={<AllRecipes />} />
                    <Route path="/cuisines" element={<CuisinesPage />} />
                    <Route path="/devices" element={<DevicesPage />} />
                    <Route path="/recipes/:id" element={<RecipeDetail />} />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Create Recipe Route - Protected for Authenticated Users */}
                    <Route
                      path="/admin/create-recipe"
                      element={
                          <CreateRecipe />
                      }
                    />

                    {/* Catch-all Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster position="top-right" richColors />
              </AuthProvider>
            </Router>
          </ReactQueryProvider>
        </StrictMode>
      </div>
    </ErrorBoundary>
  );
}

export default App;