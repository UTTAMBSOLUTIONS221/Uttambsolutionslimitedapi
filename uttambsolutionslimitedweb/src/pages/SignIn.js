import React, { useState } from "react";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username) newErrors.username = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Submitting form", formData);
      // Add your API call logic here
    }
  };

  return (
    <div>
      {/* Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>UTTAMB SOLUTIONS | SIGNIN</title>
      
      {/* External Styles and Fonts */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"
      />
          <link href="%PUBLIC_URL%/plugins/fontawesome-free/css/all.min.css" rel="stylesheet" />
          <link href="%PUBLIC_URL%/dist/css/adminlte.min.css" rel="stylesheet" />
      <div className="login-box">
        <div className="card card-info card-outline">
          <div className="card-body login-card-body">
            <p className="login-box-msg font-weight-light text-dark text-uppercase font-weight-bold">
              Sign in to start your session
            </p>

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
                  <button
                    type="button"
                    onClick={() => console.log("Cancel")}
                    className="btn btn-sm btn-danger font-weight-bolder btn-block text-uppercase"
                  >
                    Cancel
                  </button>
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
  );
};

export default SignIn;
