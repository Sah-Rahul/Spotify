import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useUserData } from "./Context/UserContext";
import Loading from "./components/Loading";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Album from "./pages/Album";
import Playlist from "./components/Playlist";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { loading, isAuth } = useUserData();

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/album/:id" element={<Album />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route
          path="/login"
          element={isAuth ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/register"
          element={isAuth ? <Navigate to="/" replace /> : <Register />}
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
