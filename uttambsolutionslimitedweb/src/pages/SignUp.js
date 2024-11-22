import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      console.log("You must accept the terms and services");
      return;
    }
    if (password === confirmPassword) {
      console.log("Signing up with", firstName, lastName, phoneNumber, email, password);
    } else {
      console.log("Passwords do not match");
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{
        height: "85vh", // Increased height for a taller viewport
      }}
    >
      <div
        className="card shadow-lg p-5"
        style={{
          backgroundColor: "#fff",
          maxWidth: "600px", // Increased max width
          width: "100%",
          borderRadius: "15px", // Rounded corners for a more modern look
          padding: "40px", // Increased padding for larger spacing
        }}
      >
        <h2 className="text-center fw-bold text-uppercase mb-5" style={{ color: "#0a506c", fontSize: "32px" }}>
          Sign Up
        </h2>
        <form onSubmit={handleSignUp}>
          {/* First Name and Last Name in One Row */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label" style={{ fontSize: "18px" }}>
                First Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg" // Use a larger input size
                id="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label" style={{ fontSize: "18px" }}>
                Last Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="form-label" style={{ fontSize: "18px" }}>
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control form-control-lg"
              id="phoneNumber"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Email Address Field */}
          <div className="mb-4">
            <label htmlFor="email" className="form-label" style={{ fontSize: "18px" }}>
              Email address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password and Confirm Password in One Row */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="password" className="form-label" style={{ fontSize: "18px" }}>
                Password
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="confirmPassword" className="form-label" style={{ fontSize: "18px" }}>
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Terms and Services Checkbox */}
          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="terms" style={{ fontSize: "16px" }}>
              I accept the{" "}
              <Link to="/terms-and-services" style={{ color: "#0a506c", fontWeight: "bold" }}>
                Terms and Services
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-3"
            style={{
              backgroundColor: "#0a506c", // Brand color
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              borderRadius: "10px", // Larger rounded corners
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;