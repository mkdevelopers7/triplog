import styles from "./AppLayout.module.css";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import User from "../components/User";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./ProtectedRoute";

function AppLayout() {
  const { isAuthenticated } = useAuth();
  // const navigate = useNavigate();
  // useEffect(
  //   function () {
  //     if (!isAuthenticated) navigate("/login");
  //   },
  //   [isAuthenticated]
  // );

  return (
    <div className={styles.app}>
      <ProtectedRoute>
        {isAuthenticated && <User />}
        <Sidebar />
        <Map />
      </ProtectedRoute>
    </div>
  );
}

export default AppLayout;
