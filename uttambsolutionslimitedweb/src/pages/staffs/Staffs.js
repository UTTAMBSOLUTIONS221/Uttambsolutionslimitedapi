import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";

const Staffs = () => {
  const [staffData, setStaffData] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch all data
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedstaff");
        if (response.ok) {
          const data = await response.json();
          setStaffData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Initialize DataTable
    if ($.fn.DataTable.isDataTable("#staffsTable")) {
      $("#staffsTable").DataTable().destroy();
    }

    const table = $("#staffsTable").DataTable({
      data: staffData,
      columns: [
        { data: "firstname", title: "First Name" },
        { data: "lastname", title: "Last Name" },
        { data: "emailaddress", title: "Email" },
        { data: "phonenumber", title: "Phone" },
        { data: "roleid", title: "Role" },
        {
          data: null,
          title: "Actions",
          orderable: false,
          render: (data, type, row) => `
            <button class="btn btn-info btn-xs" onclick="editStaff(${row.id})">Edit</button>
            <button class="btn btn-danger btn-xs" onclick="deleteStaff(${row.id})">Delete</button>
          `,
        },
      ],
    });

    return () => {
      table.destroy();
    };
  }, [staffData]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setStaffName("");
    setStaffRole("");
  };

  const handleSaveChanges = async () => {
    if (!staffName.trim() || !staffRole.trim()) {
      setError("Both staff name and role are required.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8001/api/Uttambsolutionslimitedstaffs", // Replace with POST API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: staffName,
            role: staffRole,
          }),
        }
      );

      if (response.ok) {
        alert("Staff added successfully!");
        // Reload data from API
        const updatedData = await response.json();
        setStaffData((prev) => [...prev, updatedData]);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save staff.");
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="card card-outline card-info">
        <div className="card-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h4 className="card-title text-uppercase fw-bold text-custom">
                Staffs
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <button
                className="btn btn-info btn-sm text-uppercase fw-bold float-right"
                onClick={handleShowModal}
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
        <div className="card-body table-responsive">
          <table
            id="staffsTable"
            className="table table-bordered table-sm table-striped"
          ></table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "#000000aa" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Staff</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group">
                  <label htmlFor="staffName">Staff Name</label>
                  <input
                    type="text"
                    id="staffName"
                    className="form-control"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="staffRole">Role</label>
                  <input
                    type="text"
                    id="staffRole"
                    className="form-control"
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staffs;
