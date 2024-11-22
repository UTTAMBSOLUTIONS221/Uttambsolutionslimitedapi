import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Link, useNavigate } from "react-router-dom";

const StartLayout = () => {
  const navigate = useNavigate();
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight); // Get the navbar height
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: "#0a506c" }}>
      <div className="container d-flex align-items-center justify-content-between">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src="/uttambsolutionlogo.jpg" alt="UTTAMB SOLUTIONS LIMITED" className="brand-logo me-2" />
          <span className="d-none d-lg-inline">UTTAMB SOLUTIONS LTD.</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
                <a href="#about" className="nav-link fw-bold text-uppercase text-white text-decoration-none" onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/#about");
                    }}>
                About Us
                 </a>
            </li>
            <li className="nav-item">
            <a href="#solutions" className="nav-link fw-bold text-uppercase text-white text-decoration-none" onClick={(e) => {
                e.preventDefault();
                handleNavigation("/#solutions");
                }}>
                Solutions
            </a>
            </li>
            <li className="nav-item">
            <a href="#services" className="nav-link fw-bold text-uppercase text-white text-decoration-none" onClick={(e) => {
                e.preventDefault();
                handleNavigation("/#services");
                }}>
                Services
            </a>
            </li>
            <li className="nav-item">
                <a href="#contact" className="nav-link fw-bold text-uppercase text-white text-decoration-none" onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/#contact");
                    }}>
                    Contact
                </a>
            </li>
            {/* Sign In Button */}
            <li className="nav-item ms-2">
              <Link to="/signin">
                <button className="btn btn-light fw-bold text-uppercase btn-sm px-4 py-2 w-100 w-sm-auto mb-2 mb-sm-0">Sign In</button>
              </Link>
            </li>
            {/* Sign Up Button */}
            <li className="nav-item ms-2">
              <Link to="/signup">
                <button className="btn btn-light fw-bold text-uppercase btn-sm px-4 py-2 w-100 w-sm-auto">Sign Up</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
      {/* Main Content */}
      <main style={{ paddingTop: `${navbarHeight}px` }}>
        <Outlet />
      </main>

      <footer className="footer text-white text-center text-lg-start py-4 mt-auto" style={{ backgroundColor: "#0a506c" }}>
          <div className="container">
            <div className="row">
              {/* About Summary */}
              <div className="col-lg-4 col-md-12 mb-4">
                <h5>About Us</h5>
                <p>UTTAMB SOLUTIONS LIMITED specializes in providing custom software development services tailored to the needs of businesses in e-commerce, property management, customer management, health services, security, and car hire & rentals industries.</p>
              </div>

              {/* Quick Links */}
              <div className="col-lg-4 col-md-6 mb-4">
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                <li className="nav-item">
                <a href="#about" className="nav-link text-white text-decoration-none" onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/#about");
                    }}>
                About Us
                 </a>
            </li>
            <li className="nav-item">
            <a href="#solutions" className="nav-link text-white text-decoration-none" onClick={(e) => {
                e.preventDefault();
                handleNavigation("/#solutions");
                }}>
                Solutions
            </a>
            </li>
            <li className="nav-item">
            <a href="#services" className="nav-link text-white text-decoration-none" onClick={(e) => {
                e.preventDefault();
                handleNavigation("/#services");
                }}>
                Services
            </a>
            </li>
            <li className="nav-item">
                <a href="#contact" className="nav-link text-white text-decoration-none" onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/#contact");
                    }}>
                    Contact
                </a>
            </li>
                </ul>
              </div>

              {/* Contact Us with Two Columns */}
              <div className="col-lg-4 col-md-6 mb-4">
                <h5>Contact Us</h5>
                <div className="row">
                  {/* Column 1 */}
                  <div className="col-lg-6 col-md-12">
                    <p><strong>Headquarters - USA</strong></p>
                    <p>1234 Street Name, City, USA</p>
                    <p>Email: info@uttambsolutions.com</p>
                    <p>Phone: +1 123 456 7890</p>
                  </div>

                  {/* Column 2 */}
                  <div className="col-lg-6 col-md-12">
                    <p><strong>Branch - Nairobi, Kenya</strong></p>
                    <p>91011 Nairobi Road, Nairobi, Kenya</p>
                    <p>Email: kenya@uttambsolutions.com</p>
                    <p>Phone: +254 700 123 456</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Copyright */}
            <div className="text-center mt-3">
              <p>&copy; 2020 - {new Date().getFullYear()} UTTAMB SOLUTIONS LIMITED. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default StartLayout;