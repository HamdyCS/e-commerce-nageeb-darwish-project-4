import "bootstrap/dist/css/bootstrap.min.css";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { windowSizeAtom } from "./atoms/WindowAtom";
import Layout from "./components/website/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import GoogleCallbackPage from "./pages/website/auth/GoogleCallbackPage";
import LoginPage from "./pages/website/auth/LoginPage";
import Register from "./pages/website/auth/RegisterPage";
import HomePage from "./pages/website/HomePage";
import RequireAuth from "./pages/website/auth/RequireAuth";

function App() {
  const [windowSize, setWindowSize] = useAtom(windowSizeAtom);

  //update window size on resize
  useEffect(() => {
    window.onresize = () => {
      setWindowSize(window.innerWidth);
    };

    //cleanup
    return () => {
      window.onresize = null;
    };
  }, []);

  return (
    <div
      className="App overflow-hidden "
      style={{
        fontSize: "20px",
      }}
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
          <Route path="*" element={<NotFound />} />
          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
