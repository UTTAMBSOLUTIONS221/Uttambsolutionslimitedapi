import React, { useEffect }from "react";
import { Routes, Route,useLocation  } from "react-router-dom"; // Updated imports

const Index = () => {
    const location = useLocation();

    useEffect(() => {
      if (location.hash) {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, [location]);
  
  return (
    <div className="container my-3 pt-3 flex-fill">
    <Routes>
      {/* Default route */}
      <Route path="/" element={
         <><section id="about" className="about-section my-5 pt-5">
          <div className="container">
            <div className="row text-center mb-5">
              <h2 className="col-12">About Us</h2>
              <p className="col-12">
                At UTTAMB SOLUTIONS LIMITED, we specialize in delivering custom software development solutions that cater to the unique needs of businesses across various industries. Our team works closely with clients to build tailored solutions that streamline operations, improve user experiences, and drive business growth.
              </p>
            </div>
            <div className="row text-center">
              <h3 className="col-12 mb-4">We provide custom software solutions for:</h3>

              {/* E-commerce Card */}
              <div className="col-md-4 mb-4">
                <div className="card shadow">
                  <img src="ecommerce-image.jpg" className="card-img-top" alt="E-commerce" />
                  <div className="card-body">
                    <h5 className="card-title">E-commerce</h5>
                    <p className="card-text">Secure, scalable, and user-friendly platforms for growing your online business.</p>
                  </div>
                </div>
              </div>

              {/* Property Management Card */}
              <div className="col-md-4 mb-4">
                <div className="card shadow">
                  <img src="property-management-image.jpg" className="card-img-top" alt="Property Management" />
                  <div className="card-body">
                    <h5 className="card-title">Property Management</h5>
                    <p className="card-text">Tailored software for managing properties, tenants, leases, and communication.</p>
                  </div>
                </div>
              </div>

              {/* Customer Management Card */}
              <div className="col-md-4 mb-4">
                <div className="card shadow">
                  <img src="customer-management-image.jpg" className="card-img-top" alt="Customer Management" />
                  <div className="card-body">
                    <h5 className="card-title">Customer Management</h5>
                    <p className="card-text">CRM systems that allow businesses to efficiently manage customer interactions and data.</p>
                  </div>
                </div>
              </div>

              {/* Car Hire and Rentals Card */}
              <div className="col-md-4 mb-4">
                <div className="card shadow">
                  <img src="car-hire-image.jpg" className="card-img-top" alt="Car Hire and Rentals" />
                  <div className="card-body">
                    <h5 className="card-title">Car Hire and Rentals</h5>
                    <p className="card-text">Custom solutions for fleet management, booking systems, and payment processing in the car hire industry.</p>
                  </div>
                </div>
              </div>

              {/* Health Services Card */}
              <div className="col-md-4 mb-4">
                <div className="card shadow">
                  <img src="health-services-image.jpg" className="card-img-top" alt="Health Services" />
                  <div className="card-body">
                    <h5 className="card-title">Health Services</h5>
                    <p className="card-text">Healthcare management systems to optimize patient care, scheduling, and billing.</p>
                  </div>
                </div>
              </div>

              {/* Security Services Card */}
              <div className="col-md-4 mb-4">
                <div className="card shadow">
                  <img src="security-services-image.jpg" className="card-img-top" alt="Security Services" />
                  <div className="card-body">
                    <h5 className="card-title">Security Services</h5>
                    <p className="card-text">Software solutions that assist security firms in managing operations, personnel, and compliance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row text-center mt-5">
              <p className="col-12">
                Our mission is to provide businesses with high-quality, scalable software solutions that address their specific challenges. We combine the latest technology with industry best practices to deliver solutions that make a real difference in your operations.
              </p>
            </div>
          </div>
        </section>
        <section id="solutions" className="solutions-section py-5 my-5 pt-5">
            <div className="container">
              <h2 className="section-title text-center mb-4">Our Solutions</h2>
              <div className="row">
                {/* Car Hire and Rentals Solution Card (First) */}
                <div className="col-md-4">
                  <div className="solution-card shadow-lg rounded border-light">
                    <img
                      src="path-to-your-carhire-image.jpg"
                      alt="Car Hire & Rentals"
                      className="img-fluid rounded-top"
                    />
                    <div className="card-body">
                      <h4 className="card-title">Car Hire & Rentals</h4>
                      <p className="card-text">
                        Fleet management and booking systems for the car hire and rental industry to streamline customer booking and payment processing.
                      </p>
                      <a href="#demo-booking" className="btn btn-primary text-uppercase" style={{
                        backgroundColor: "#0a506c", // Your brand color
                        color: "white",
                        fontWeight: "bold",
                        padding: "15px", // Increase padding
                        fontSize: "18px", // Larger font size
                        borderRadius: "5px", // Optional: rounded corners
                        }}>Hire a Car</a>
                    </div>
                  </div>
                </div>

                {/* Healthcare Services Solution Card (Second) */}
                <div className="col-md-4">
                  <div className="solution-card shadow-lg rounded border-light">
                    <img
                      src="path-to-your-healthcare-image.jpg"
                      alt="Healthcare Services"
                      className="img-fluid rounded-top"
                    />
                    <div className="card-body">
                      <h4 className="card-title">Healthcare Services</h4>
                      <p className="card-text">
                        Optimized healthcare management systems to improve patient care, appointment scheduling, and billing processes.
                      </p>
                      <a href="#demo-booking" className="btn btn-primary text-uppercase" style={{
                        backgroundColor: "#0a506c", // Your brand color
                        color: "white",
                        fontWeight: "bold",
                        padding: "15px", // Increase padding
                        fontSize: "18px", // Larger font size
                        borderRadius: "5px", // Optional: rounded corners
                        }}>Book a session</a>
                    </div>
                  </div>
                </div>

                {/* E-commerce Solution Card */}
                <div className="col-md-4">
                  <div className="solution-card shadow-lg rounded border-light">
                    <img
                      src="path-to-your-ecommerce-image.jpg"
                      alt="E-commerce"
                      className="img-fluid rounded-top"
                    />
                    <div className="card-body">
                      <h4 className="card-title">E-commerce</h4>
                      <p className="card-text">
                        Scalable and secure software solutions for online businesses to manage products, payments, and customer interactions seamlessly.
                      </p>
                      <a href="#demo-booking" className="btn btn-primary text-uppercase" style={{
                        backgroundColor: "#0a506c", // Your brand color
                        color: "white",
                        fontWeight: "bold",
                        padding: "15px", // Increase padding
                        fontSize: "18px", // Larger font size
                        borderRadius: "5px", // Optional: rounded corners
                        }}>Create a Shop</a>
                    </div>
                  </div>
                </div>

                {/* Property Management Solution Card */}
                <div className="col-md-4">
                  <div className="solution-card shadow-lg rounded border-light">
                    <img
                      src="path-to-your-property-management-image.jpg"
                      alt="Property Management"
                      className="img-fluid rounded-top"
                    />
                    <div className="card-body">
                      <h4 className="card-title">Property Management</h4>
                      <p className="card-text">
                        Custom software solutions for property management, including tenant management, lease tracking, and maintenance management.
                      </p>
                      <a href="#demo-booking" className="btn btn-primary text-uppercase" style={{
                        backgroundColor: "#0a506c", // Your brand color
                        color: "white",
                        fontWeight: "bold",
                        padding: "15px", // Increase padding
                        fontSize: "18px", // Larger font size
                        borderRadius: "5px", // Optional: rounded corners
                        }}>Book a Demo</a>
                    </div>
                  </div>
                </div>

                {/* Security Services Solution Card */}
                <div className="col-md-4">
                  <div className="solution-card shadow-lg rounded border-light">
                    <img
                      src="path-to-your-security-services-image.jpg"
                      alt="Security Services"
                      className="img-fluid rounded-top"
                    />
                    <div className="card-body">
                      <h4 className="card-title">Security Services</h4>
                      <p className="card-text">
                        Comprehensive solutions for security firms to manage personnel, compliance, and security operations efficiently.
                      </p>
                      <a href="#demo-booking" className="btn btn-primary text-uppercase" style={{
                        backgroundColor: "#0a506c", // Your brand color
                        color: "white",
                        fontWeight: "bold",
                        padding: "15px", // Increase padding
                        fontSize: "18px", // Larger font size
                        borderRadius: "5px", // Optional: rounded corners
                        }}>Contact Us</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="services-section py-5 my-5 pt-5">
            <div className="container">
              <h2 className="section-title text-center">Our Services</h2>
              <div className="row">
                {/* Software Development Service Card */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="card service-card">
                    <img
                      src="software-development.jpg" // Replace with your service image
                      className="card-img-top"
                      alt="Software Development" />
                    <div className="card-body">
                      <h5 className="card-title">Web Design and Development</h5>
                      <p className="card-text">
                        We offer custom software development services to create solutions that meet your business needs, ensuring quality and scalability.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Software Maintenance Service Card */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="card service-card">
                    <img
                      src="software-maintenance.jpg" // Replace with your service image
                      className="card-img-top"
                      alt="Software Maintenance" />
                    <div className="card-body">
                      <h5 className="card-title">Software Development and Maintenance</h5>
                      <p className="card-text">
                        Our maintenance services ensure your software runs smoothly and remains updated, with bug fixes and regular performance optimizations.
                      </p>
                    </div>
                  </div>
                </div>
                {/* HR and Payroll Management Service Card */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="card service-card">
                    <img
                      src="hr-payroll-management.jpg" // Replace with your service image
                      className="card-img-top"
                      alt="HR and Payroll Management" />
                    <div className="card-body">
                      <h5 className="card-title">HR & Payroll Management</h5>
                      <p className="card-text">
                        Our HR and payroll management systems help businesses manage employee records, payroll, benefits, and tax compliance seamlessly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recruitment and Onboarding Service Card */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="card service-card">
                    <img
                      src="recruitment-onboarding.jpg" // Replace with your service image
                      className="card-img-top"
                      alt="Recruitment and Onboarding" />
                    <div className="card-body">
                      <h5 className="card-title">Recruitment & Onboarding</h5>
                      <p className="card-text">
                        We provide comprehensive recruitment and onboarding solutions to help your business find and integrate the best talent.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Talent Matching Service Card */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="card service-card">
                    <img
                      src="talent-matching.jpg" // Replace with your service image
                      className="card-img-top"
                      alt="Talent Matching" />
                    <div className="card-body">
                      <h5 className="card-title">Talent Matching</h5>
                      <p className="card-text">
                        We offer expert talent matching services to align the right skills with your business requirements, ensuring a perfect fit for your projects.
                      </p>
                    </div>
                  </div>
                </div>

                

                {/* Additional Service Card (if applicable) */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="card service-card">
                    <img
                      src="additional-service.jpg" // Replace with your service image
                      className="card-img-top"
                      alt="Additional Service" />
                    <div className="card-body">
                      <h5 className="card-title">Additional Services</h5>
                      <p className="card-text">
                        We offer a range of additional services designed to help your business stay ahead of the competition. Contact us to learn more!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section><section id="contact" className="contact-section py-5 my-5 pt-5">
            <div className="container">
              <h2 className="section-title text-center">Contact Us</h2>
              <div className="row">
                {/* Contact Form Section */}
                <div className="col-md-6">
                  <h4 className="text-center">Get in Touch</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter your full name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows="4"
                        placeholder="Enter your message"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block w-100" style={{
                        backgroundColor: "#0a506c", // Your brand color
                        color: "white",
                        fontWeight: "bold",
                        padding: "15px", // Increase padding
                        fontSize: "18px", // Larger font size
                        borderRadius: "5px", // Optional: rounded corners
                        }}>
                      Submit
                    </button>
                  </form>
                </div>

                {/* Google Map Section */}
                <div className="col-md-6">
                  <h4 className="text-center">Our Location</h4>
                  <div className="map-container">
                    <iframe
                      title="Google Map"
                      width="100%"
                      height="400"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src="https://www.google.com/maps/embed/v1/place?q=YOUR_LOCATION&key=YOUR_GOOGLE_MAPS_API_KEY"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </section></>
      } />
    </Routes>
  </div>
  );
};

export default Index;