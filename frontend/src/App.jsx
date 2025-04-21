import { useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const authUser = useAuthStore((state) => state.authUser); // ✅ Corrected state usage
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const onlineUser = useAuthStore((state) => state.onlineUser);
  console.log("Onlne-",onlineUser)
const {theme}=useThemeStore()
  useEffect(() => {
    checkAuth();
     useAuthStore.getState().checkAuth();
  }, [checkAuth]);

  console.log("APP auth user", { authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
