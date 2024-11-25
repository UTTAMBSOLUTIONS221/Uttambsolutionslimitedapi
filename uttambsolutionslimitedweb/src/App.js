import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import PrivateRoute from "./routes/PrivateRoute";
import StartLayout from "./pages/shared/StartLayout";
import AdminLayout from "./pages/shared/AdminLayout";
import Permissions from "./pages/staffs/Permissions";
import RolePermissions from "./pages/staffs/RolePermissions";
import Staffs from "./pages/staffs/Staffs";
import Vehiclemakes from "./pages/vehicles/Vehiclemakes";
import Vehiclemodels from "./pages/vehicles/Vehiclemodels";
import { AuthProvider } from "./context/AuthContext"; // Wrap the app with context
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with StartLayout */}
          <Route path="/" element={<StartLayout />}>
            <Route index element={<Index />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Protected Routes with AdminLayout */}
          <Route element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/rolepermissions" element={<RolePermissions />} />
              <Route path="/staffs" element={<Staffs />} />
             
              <Route path="/vehiclemakes" element={<Vehiclemakes />} />
              <Route path="/vehiclemodels" element={<Vehiclemodels />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;