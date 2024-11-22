import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
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

    const registerApiUrl = "http://localhost:8001/api/Uttambsolutionslimitedstaff";
    try {
      const response = await fetch(registerApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed.");
      }

      alert("Registration successful!");
      navigate("/signin");
    } catch (err) {
      console.error("An error occurred during registration:", err.message);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstname) errors.firstname = "First name is required.";
    if (!formData.lastname) errors.lastname = "Last name is required.";
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
    }
    if (!formData.phone) errors.phone = "Phone number is required.";
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  return (
    <div>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>UTTAMB SOLUTIONS | SIGNUP</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"
      />
      <link href="/plugins/fontawesome-free/css/all.min.css" rel="stylesheet" />
      <link href="/dist/css/adminlte.min.css" rel="stylesheet" />
      <div className="hold-transition login-page">
        <div className="login-box">
          <div className="card card-info card-outline">
            <div className="card-body login-card-body">
              <p className="login-box-msg font-weight-light text-dark text-uppercase font-weight-bold">
                Sign up to join us
              </p>
              <form onSubmit={handleSubmit}>

              <div className="row">
                <div className="col-md-6">
                  
                {/* First Name */}
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="First Name"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fa fa-user" />
                    </div>
                  </div>
                </div>
                {errors.firstname && (
                  <span className="text-danger">{errors.firstname}</span>
                )}
                </div>
                <div className="col-md-6">
                   {/* Last Name */}
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Last Name"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fa fa-user" />
                    </div>
                  </div>
                </div>
                {errors.lastname && (
                  <span className="text-danger">{errors.lastname}</span>
                )}
                </div>
              </div>
                {/* Email */}
                <div className="input-group mb-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Email"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fa fa-envelope" />
                    </div>
                  </div>
                </div>
                {errors.email && (
                  <span className="text-danger">{errors.email}</span>
                )}

                {/* Phone */}
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Phone"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fa fa-phone" />
                    </div>
                  </div>
                </div>
                {errors.phone && (
                  <span className="text-danger">{errors.phone}</span>
                )}
                  <div className="row">
                  <div className="col-md-6">
                    {/* Password */}
                      <div className="input-group mb-3">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Password"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fa fa-lock" />
                          </div>
                        </div>
                      </div>
                      {errors.password && (
                        <span className="text-danger">{errors.password}</span>
                      )}
                    </div>
                    <div className="col-md-6">
                      {/* Confirm Password */}
                      <div className="input-group mb-3">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Confirm Password"
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fa fa-lock" />
                          </div>
                        </div>
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-danger">{errors.confirmPassword}</span>
                      )}
                    </div>
                  </div>

                {/* Buttons */}
                <div className="row">
                  <div className="col-6">
                    <a href="/" className="btn btn-danger btn-block">
                      Cancel
                    </a>
                  </div>
                  <div className="col-6">
                    <button
                      type="submit"
                      className="btn btn-info btn-block"
                    >
                      Register
                    </button>
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

export default SignUp;
