import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const Staffs = () => {
  const [staffData, setStaffData] = useState([]); // State for table data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [search, setSearch] = useState(""); // Search input state
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newStaff, setNewStaff] = useState({
    firstname: "",
    lastname: "",
    emailaddress: "",
    phonenumber: "",
    role: "",
  });
  const [roles, setRoles] = useState([]); // State to store roles
  const [loadingRoles, setLoadingRoles] = useState(true); // Loading state for roles

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/Uttambsolutionslimitedstaff"
        ); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch staff data");
        }
        const data = await response.json();
        setStaffData(data);
        setFilteredData(data); // Initialize filtered data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch roles for the dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8001/api/Uttambsolutionslimitedrole"); // Replace with your roles API endpoint
        setRoles(response.data); // Assuming response.data is an array of roles
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoadingRoles(false); // Set loadingRoles to false after fetching
      }
    };

    fetchRoles();
  }, []);


  // Handle search filter
  useEffect(() => {
    const filtered = staffData.filter((item) =>
      `${item.firstname} ${item.lastname}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, staffData]);

  // Columns definition
  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.firstname} ${row.lastname}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.emailaddress,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phonenumber,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.rolename,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
        const isActiveStatus = row.isactive ? "Active" : "Inactive";
        const isDeletedStatus = row.isdeleted ? "Deleted" : "Not Deleted";
        const loginStatus =
          row.loginstatus === 1
            ? "Online"
            : row.loginstatus === 0
            ? "Offline"
            : "Unknown";
  
        return (
          <div>
            <span
              className={`badge ${
                row.isactive ? "badge-success" : "badge-warning"
              } mx-1`}
            >
              {isActiveStatus}
            </span>
            <span
              className={`badge ${
                row.isdeleted ? "badge-danger" : "badge-info"
              } mx-1`}
            >
              {isDeletedStatus}
            </span>
            <span
              className={`badge ${
                row.loginstatus === 1
                  ? "badge-primary"
                  : row.loginstatus === 0
                  ? "badge-secondary"
                  : "badge-dark"
              } mx-1`}
            >
              {loginStatus}
            </span>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            className="btn btn-xs btn-info mx-1"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-xs btn-danger mx-1"
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];


  const handleDelete = async (data) => {
    try {
      // Find the staff record by ID
      if (data) {
        // Update the isdelete flag to true
        data.isdeleted = true;
        const response = await axios.post('http://localhost:8001/api/Uttambsolutionslimitedstaff', data);
        // Send a request to your server to update the staff record
        if (response.status === 200) {
          // Success response
          Swal.fire({
            icon: "success",
            title: "Staff Deleted",
            text: "The staff has been marked as deleted.",
          });
  
             // Reload the page to reflect the changes
            window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was an issue deleting the staff. Please try again later.",
          });
        }
      }
    } catch (error) {
      console.error("Error marking staff as deleted:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue with the server. Please try again later.",
      });
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };
  const handleSaveNewStaff = async () => {
    const {
      firstname,
      lastname,
      emailaddress,
      phonenumber,
      role,
    } = newStaff;
  
    // Validation checks
    if (!firstname || !lastname || !emailaddress || !phonenumber || !role) {
      // Show error alert for missing fields
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
      });
      return;
    }
  
    // Simple email validation (regex)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailaddress)) {
      // Show error alert for invalid email
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address!',
      });
      return;
    }
  
    // Simple phone number validation (basic example)
    const phoneRegex = /^[0-9]{10}$/; // Assuming phone number should be 10 digits
    if (!phoneRegex.test(phonenumber)) {
      // Show error alert for invalid phone number
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Phone number should be 10 digits!',
      });
      return;
    }
    // Prepare the staff data object
    const staffData = {
      staffid: 0, // Assuming new staff gets a staffid of 0
      firstname,
      lastname,
      emailaddress,
      phonenumber,
      passwords: "",
      passwordhash: "",
      loginstatus: 2, // Assuming the user is inactive initially
      confirmemail: true, // Assuming email is confirmed
      confirmphone: true, // Assuming phone is confirmed
      changepassword: true, // Assuming the user can change password
      lastpasswordchange: new Date().toISOString(), // Set current date-time
      roleid: roles.find((roleObj) => roleObj.rolename === role)?.roleid || 0, // Get roleid based on the selected role
      isactive: true,
      isdeleted: false, // Assuming the user is not deleted initially
      isdefault: false, // Assuming the staff is not a default user
      createdby: 0, // Assuming admin ID, or use appropriate value
      modifiedby: 0, // Initially 0 until updated
      datecreated: new Date().toISOString(),
      datemodified: new Date().toISOString(),
    };
  
    // If validation passes, make the POST request to save the staff data
    try {
      const response = await axios.post('http://localhost:8001/api/Uttambsolutionslimitedstaff', staffData);
  
      // If the request is successful
      if (response.status === 200) {
        console.log('Staff added:', response.data);
  
        // Close the modal
        setShowAddModal(false);
  
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Staff Added',
          text: 'New staff has been successfully added!',
        });
  
        // Optionally, clear the form after saving
        setNewStaff({
          firstname: '',
          lastname: '',
          emailaddress: '',
          phonenumber: '',
          role: '',
        });
        // Reload the page to reflect the changes
      window.location.reload();
      } else {
        // If the response status is not 200, show an error alert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an issue adding the staff. Please try again later.',
        });
      }
    } catch (error) {
      // If there's an error with the API request
      console.error('Error adding staff:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue with the server. Please try again later.',
      });
    }
  };  

  const handleEdit = (data) => {
    setEditData(data);
    setShowEditModal(true);
  };
  const handleSaveEdit = async () => {
    const {
      firstname,
      lastname,
      emailaddress,
      phonenumber,
      role,
    } = editData;

    // Validation checks
    if (!firstname || !lastname || !emailaddress || !phonenumber || !role) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
      });
      return;
    }

    // Simple email validation (regex)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailaddress)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address!',
      });
      return;
    }

    // Simple phone number validation (basic example)
    const phoneRegex = /^[0-9]{10}$/; // Assuming phone number should be 10 digits
    if (!phoneRegex.test(phonenumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Phone number should be 10 digits!',
      });
      return;
    }

    // Prepare the staff data object
    const staffData = {
      ...editData,
      roleid: roles.find((roleObj) => roleObj.rolename === role)?.roleid || 0,
      datemodified: new Date().toISOString(),
    };

    // Send the PUT request to save the edited staff data
    try {
      const response = await axios.post('http://localhost:8001/api/Uttambsolutionslimitedstaff', staffData);

      // If the request is successful
      if (response.status === 200) {
        console.log('Staff updated:', response.data);

        // Close the modal
        setShowEditModal(false);

        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Staff Updated',
          text: 'Staff details have been successfully updated!',
        });

        // Optionally, reload the staff list after updating
        window.location.reload();
      } else {
        // If the response status is not 200, show an error alert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an issue updating the staff. Please try again later.',
        });
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue with the server. Please try again later.',
      });
    }
  };
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleCloseAddModal = () => setShowAddModal(false);
  return (
    <div className="container mt-3">
      <div
        className="card shadow-sm"
        style={{ borderRadius: "8px", overflow: "hidden" }}
      >
        <div
          className="card-header"
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <h6 className="font-weight-bold text-sm mb-0">Staffs</h6>
          <button
            className="btn btn-primary btn-sm float-right"
            style={{ marginRight: "10px" }}
            onClick={handleAdd}
          >
            Add Staff
          </button>
        </div>
        <div className="card-body" style={{ paddingTop: "2px" }}>
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="mb-3" style={{ maxWidth: "300px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    fontSize: "0.85rem",
                    height: "35px",
                    padding: "5px 10px",
                  }}
                />
              </div>

              {/* Data Table */}
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                responsive
                highlightOnHover
                striped
                customStyles={{
                  headCells: {
                    style: {
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      backgroundColor: "#f1f3f5",
                      color: "#333",
                    },
                  },
                  rows: {
                    style: {
                      fontSize: "0.85rem",
                      minHeight: "40px",
                    },
                  },
                }}
              />
            </>
          )}
        </div>
      </div>
  {/* Add Modal */}
  {showAddModal && (
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newStaff.firstname}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, firstname: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newStaff.lastname}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, lastname: e.target.value })
                      }
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={newStaff.phonenumber}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, phonenumber: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                        as="select"
                        value={newStaff.role || ""}
                        onChange={(e) =>
                            setNewStaff({ ...newStaff, role: e.target.value })
                        }
                        disabled={loadingRoles}
                        style={{
                            paddingTop: '8px',    // Add top padding
                            paddingBottom: '8px'  // Add bottom padding
                        }}
                        >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.roleid} value={role.rolename}>
                            {role.rolename}
                            </option>
                        ))}
                    </Form.Control>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={newStaff.emailaddress}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, emailaddress: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveNewStaff}>
              Add Staff
            </Button>
          </Modal.Footer>
        </Modal>
      )}

       {/* Edit Modal */}
       {showEditModal && (
          <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editData?.firstname || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, firstname: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editData?.lastname || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, lastname: e.target.value })
                      }
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={editData?.phonenumber || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, phonenumber: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                        as="select"
                        value={editData?.roleid || ""}  // Set roleid as the value
                        onChange={(e) =>
                            setEditData({ ...editData, role: e.target.options[e.target.selectedIndex].text, roleid: e.target.value }) // Update both role and roleid
                        } style={{
                            paddingTop: '8px',    // Add top padding
                            paddingBottom: '8px'  // Add bottom padding
                        }}
                        >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.roleid} value={role.roleid}>
                            {role.rolename}
                            </option>
                        ))}
                    </Form.Control>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editData?.emailaddress || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, emailaddress: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Staffs;
