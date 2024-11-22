import { Outlet, Link } from "react-router-dom"; // Import Link for navigation
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    window.location.href = "/signin"; // Redirect to signin page
  };

  return (
    <div className="wrapper">
      <nav className="main-header navbar navbar-expand fixed-top bg-white">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button className="nav-link" data-widget="pushmenu">
              <i className="fas fa-bars text-dark" />
            </button>
          </li>
        </ul>
        <ul className="nav-item order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
          <li className="nav-link dropdown">
            <p
              className="font-weight-bold text-uppercase text-xs text-dark text-muted dropdown-toggle text-decoration-none"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user-circle text-dark text-muted font-weight-bold fa-1x img-circle rounded-circle" />
              &nbsp; {user?.fullname}
            </p>
            <div className="dropdown-menu bg-white">
              <button
                onClick={handleLogout}
                className="dropdown-item text-dark text-sm font-weight-bold"
              >
                Log out
              </button>
            </div>
          </li>
        </ul>
      </nav>
      <aside className="main-sidebar sidebar-white bg-white position-fixed">
        <Link to="/dashboard" className="brand-link bg-white text-decoration-none">
          <img
            src="/uttambsolutionlogo.jpg"
            alt="UTTAMB SOLUTIONS LIMITED"
            className="brand-image img-circle"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-bold text-dark text-muted text-uppercase text-xs">
            UTTAMB SOLUTIONS LIMITED
          </span>
        </Link>
        <div className="sidebar" style={{ height: "calc(100vh - 56px)", overflowY: "auto" }}>
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link text-dark">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </Link>
              </li>
              <li className="nav-item has-treeview main">
                <Link to="/settings" className="nav-link">
                  <i className="nav-icon fa fa-cogs" />
                  <p>
                    Settings
                    <i className="fa fa-angle-left right" />
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item main">
                    <Link to="/permissions" className="nav-link">
                      <i className="nav-icon fas fa-list" />
                      <p>Permissions</p>
                    </Link>
                  </li>
                  <li className="nav-item main">
                    <Link to="/templates" className="nav-link">
                      <i className="nav-icon fas fa-list" />
                      <p>Templates</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item main">
                <Link to="/staffs" className="nav-link">
                  <i className="nav-icon fas fa-users" />
                  <p>Staffs</p>
                </Link>
              </li>
              
            </ul>
          </nav>
        </div>
      </aside>
      <div className="content-wrapper" style={{ marginTop: "56px" }}>
        <section className="content">
          <div className="container-fluid text-sm font-weight-light text-dark">
            <main role="main" className="pb-3 mt-2 pt-2">
              <Outlet />
            </main>
          </div>
        </section>
      </div>
      <footer className="main-footer text-center bg-light">
        <p className="text-xs font-weight-normal">
          © 2020 - {new Date().getFullYear()} Uttamb Solutions. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminLayout;