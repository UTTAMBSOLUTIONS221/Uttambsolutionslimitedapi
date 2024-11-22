import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const staffApiUrl = "http://localhost:8002/api/Staffauth/Staffauthenticate";
    const customerApiUrl = "http://localhost:8002/customerlogin";

    try {
      const userData = await authenticateUser(staffApiUrl, customerApiUrl);
      if (userData) {
        login(userData);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("An error occurred during sign-in:", err.message);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Email is required.";
    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  const authenticateUser = async (staffApiUrl, customerApiUrl) => {
    try {
      let response = await fetch(staffApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      let data = await response.json();
      if (!response.ok) {
        response = await fetch(customerApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Invalid credentials.");
        }
      }
      return data;
    } catch (err) {
      throw new Error(err.message || "Authentication failed.");
    }
  };
  return (
  <div>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UTTAMB SOLUTIONS | SIGNIN</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback" />
    <link href="/plugins/fontawesome-free/css/all.min.css" rel="stylesheet" />
    <link href="/dist/css/adminlte.min.css" rel="stylesheet" />
  <div className="hold-transition login-page">
    <div className="login-box">
      <div className="card card-info card-outline">
        <div className="card-body login-card-body">
          <p className="login-box-msg font-weight-light text-dark text-uppercase font-weight-bold">Sign in to start your session</p>
           {/* Form */}
           <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="input-group mb-3">
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="Email Address"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fa fa-envelope" />
                  </div>
                </div>
              </div>
              {errors.username && (
                <span className="text-danger font-weight-light">
                  {errors.username}
                </span>
              )}

              {/* Password Input */}
              <div className="input-group mb-3">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="Password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fa fa-lock" />
                  </div>
                </div>
              </div>
              {errors.password && (
                <span className="text-danger font-weight-light">
                  {errors.password}
                </span>
              )}

              {/* Buttons */}
              <div className="row">
                <div className="col-6">
                  <a href="/" className="btn btn-sm btn-danger font-weight-bolder btn-block text-uppercase">Cancel</a>
                </div>
                <div className="col-6">
                  <button
                    type="submit"
                    className="btn btn-sm btn-info font-weight-bolder btn-block text-uppercase"
                  >
                    Sign in
                  </button>
                </div>
              </div>

              {/* Additional Links */}
              <div className="row mt-2">
                <div className="col-5">
                  <a
                    href="/forgotpassword"
                    className="text-uppercase text-info text-xs"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="col-7">
                  <p className="text-xs">
                    Don't have an account yet?{" "}
                    <a
                      href="/signup"
                      className="text-uppercase text-info text-xs"
                    >
                      Register
                    </a>
                  </p>
                </div>
              </div>
            </form>
        </div>
      </div>
    </div>
    </div>
  </div>
  );
};
 export default SignIn;
