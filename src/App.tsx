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
import RequireAuth from "./pages/website/auth/RequireAuth";
import HomePage from "./pages/website/HomePage";
import { enRole } from "./dtos/auth/Role";
import RequireCustomAuth from "./pages/website/auth/RequireCustomAuth";
import RequireBack from "./pages/website/auth/RequireBack";

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

          <Route element={<RequireBack />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
          <Route path="*" element={<NotFound />} />
          {/* protected routes */}
          <Route element={<RequireAuth />}>
            {/* Require custom auth */}
            <Route
              element={
                <RequireCustomAuth
                  roles={[enRole.admin, enRole.writer, enRole.productManager]}
                />
              }
            >
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
