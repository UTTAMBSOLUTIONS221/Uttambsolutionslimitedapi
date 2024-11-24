import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4"; // DataTables Bootstrap 4 integration
import "datatables.net-bs4/css/dataTables.bootstrap4.css"; // DataTables CSS for Bootstrap 4

const Staffs = () => {
  const [vehicleMakeName, setVehicleMakeName] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Initialize DataTable
    if ($.fn.DataTable.isDataTable("#staffsTable")) {
      $("#staffsTable").DataTable().destroy();
    }

    const table = $("#staffsTable").DataTable({
      processing: true,
      serverSide: true,
      ajax: {
        url: "http://localhost:8001/api/Uttambsolutionslimitedstaff", // Replace with your API endpoint
        method: "GET",
        dataSrc: function (json) {
          console.log("API response:", json);
          return json; // Adjust this if the API response has nested data
        },
      },
      columns: [
        {
          data: "firstname",
          title: "Name",
          render: (data, type, row) =>
            `${row.firstname} ${row.lastname || ""}`,
        },
        { data: "emailaddress", title: "Email" },
        { data: "phonenumber", title: "Phone" },
        { data: "roleid", title: "Role" },
        {
          data: null,
          title: "Status",
          render: (data, type, row) => {
            const isActiveStatus = row.isactive ? "Active" : "Inactive";
            const isDeletedStatus = row.isdeleted ? "Deleted" : "Not Deleted";
            const loginStatus =
              row.loginstatus === 1
                ? "Online"
                : row.loginstatus === 0
                ? "Offline"
                : "Unknown";

            return `
              <span class="badge ${
                row.isactive ? "badge-success" : "badge-warning"
              }">${isActiveStatus}</span>
              <span class="badge ${
                row.isdeleted ? "badge-danger" : "badge-info"
              }">${isDeletedStatus}</span>
              <span class="badge ${
                row.loginstatus === 1
                  ? "badge-primary"
                  : row.loginstatus === 0
                  ? "badge-secondary"
                  : "badge-dark"
              }">${loginStatus}</span>
            `;
          },
        },
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

    // Cleanup on unmount
    return () => {
      table.destroy();
    };
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleSaveChanges = async () => {
    if (!vehicleMakeName.trim()) {
      setError("Make name is required.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8001/api/Uttambsolutionslimitedstaffs", // Replace with your POST API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: vehicleMakeName }),
        }
      );

      if (response.ok) {
        alert("Vehicle make created successfully!");
        setVehicleMakeName(""); // Clear input
        setShowModal(false); // Close modal
        $("#staffsTable").DataTable().ajax.reload(); // Reload table data
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save.");
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
                  <label htmlFor="vehicleMakeName">Staff Name</label>
                  <input
                    type="text"
                    id="vehicleMakeName"
                    className="form-control"
                    value={vehicleMakeName}
                    onChange={(e) => setVehicleMakeName(e.target.value)}
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
