import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    const staffApiUrl = "http://localhost:8002/api/Staffauth/Staffauthenticate";
    const customerApiUrl = "http://localhost:8002/customerlogin";

    try {
      let response = await fetch(staffApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      let data = await response.json();

      if (!response.ok) {
        response = await fetch(customerApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email, password }),
        });

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Invalid credentials.");
        }
      }

      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ height: "75vh" }}>
      <div className="card shadow-lg w-100 p-4" style={{ backgroundColor: "#f8f9fa", maxWidth: "500px", margin: "10px" }}>
        <h2 className="text-center fw-bold text-uppercase mb-4" style={{ color: "#0a506c" }}>Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger" aria-live="polite">{error}</div>}
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#0a506c",
              color: "white",
              fontWeight: "bold",
              padding: "15px",
              fontSize: "18px",
              borderRadius: "5px",
            }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;