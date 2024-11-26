import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; // FontAwesome icons for buttons

const Staffs = () => {
  const [staffData, setStaffData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newStaff, setNewStaff] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    emailaddress: "",
    role: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to determine if we're editing
  const [currentStaffId, setCurrentStaffId] = useState(null); // Store the ID of the permission being edited
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch staff data
    const fetchStaffData = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedstaff");
        if (response.ok) {
          const data = await response.json();
          setStaffData(data);
        } else {
          console.error("Failed to fetch staff data");
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    // Fetch roles data
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedrole");
        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        } else {
          console.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchStaffData();
    fetchRoles();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable("#staffsTable")) {
      $("#staffsTable").DataTable().destroy();
    }

    $("#staffsTable").DataTable({
      data: staffData,
      columns: [
        { data: "firstname", title: "First Name" },
        { data: "lastname", title: "Last Name" },
        { data: "emailaddress", title: "Email" },
        { data: "phonenumber", title: "Phone" },
        { data: "rolename", title: "Role" },
        {
          data: null,
          title: "Actions",
          orderable: false,
          className: "text-right",  
          render: (data, type, row) => {
            return ` 
              <div class="d-flex justify-content-end">
                <button class="btn btn-info btn-resend-staff-password btn-xs" data-id="${row.staffid}">Resend Password</button>
                <button class="btn btn-info btn-edit-staff ml-2 btn-xs" data-id="${row.staffid}">Edit</button>
                <button class="btn btn-danger btn-xs ml-2" data-id="${row.staffid}">Delete</button>
             </div>
            `;
          },
          createdCell: (cell, cellData, rowData) => {
            // Add event listeners after rendering the table
            $(cell).find(".btn-resend-staff-password").on("click", () => editStaff(rowData.staffid));
            $(cell).find(".btn-edit-staff").on("click", () => editStaff(rowData.staffid));
            $(cell).find(".btn-danger").on("click", () => deleteStaff(rowData.staffid));
          },
        },
      ],
    });
  }, [staffData]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewStaff({
      firstname: "",
      lastname: "",
      phonenumber: "",
      emailaddress: "",
      role: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newStaff.firstname.trim()) newErrors.firstname = "First name is required.";
    if (!newStaff.lastname.trim()) newErrors.lastname = "Last name is required.";
    if (!newStaff.phonenumber.trim()) newErrors.phonenumber = "Phone number is required.";
    if (!newStaff.emailaddress.trim()) newErrors.emailaddress = "Email is required.";
    if (!newStaff.role.trim()) newErrors.role = "Role is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveNewStaff = async () => {
    if (!validateForm()) return;
    const staffData = {
      staffid: 0, // Assuming new staff gets a staffid of 0
      firstname:newStaff.firstname,
      lastname:newStaff.lastname,
      emailaddress:newStaff.emailaddress,
      phonenumber:newStaff.phonenumber,
      passwords: "",
      passwordhash: "",
      loginstatus: 2, // Assuming the user is inactive initially
      confirmemail: true, // Assuming email is confirmed
      confirmphone: true, // Assuming phone is confirmed
      changepassword: true, // Assuming the user can change password
      lastpasswordchange: new Date().toISOString(), // Set current date-time
      roleid: roles.find((roleObj) => roleObj.rolename === newStaff.role)?.roleid || 0, // Get roleid based on the selected role
      isactive: true,
      isdeleted: false, // Assuming the user is not deleted initially
      isdefault: false, // Assuming the staff is not a default user
      createdby: 0, // Assuming admin ID, or use appropriate value
      modifiedby: 0, // Initially 0 until updated
      datecreated: new Date().toISOString(),
      datemodified: new Date().toISOString(),
    };
    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedstaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Staff added successfully!',
        });
        handleCloseModal();
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to save staff!',
        });
        const errorData = await response.json();
        console.error(errorData.message || "Failed to save staff.");
      }
    } catch (error) {
      console.error("Error saving staff:", error.message);
    }
  };

   // Edit Staff Handler using GET
   const editStaff = async (staffId) => {
    console.log(staffId);
    setEditMode(true); // Set editing mode
    setCurrentStaffId(staffId); // Set the current permission ID

    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedstaff/${staffId}`);
      if (response.ok) {
        const staffToEdit = await response.json();
        setNewStaff({
          firstname: staffToEdit.firstname,
          lastname: staffToEdit.lastname,
          phonenumber: staffToEdit.phonenumber,
          emailaddress: staffToEdit.emailaddress,
          role: roles.find((role) => role.roleid === staffToEdit.roleid)?.rolename || "",
        });
        setShowModal(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch staff details!',
        });
      }
    } catch (error) {
      console.error("Error fetching staff details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching staff details!',
      });
    }
  };

  const handleUpdateNewStaff = async () => {
    if (!validateForm()) return;
  
    // Add the current permission ID to the updated permission object
    const updatedStaff = { 
      ...newStaff, 
      staffid: currentStaffId,
      roleid: roles.find((roleObj) => roleObj.rolename === newStaff.role)?.roleid || 0,
    };
  
    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedstaff", {
        method: "PUT", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStaff), // Send the updated permission object
      });
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Staff updated successfully!',
        });
        handleCloseModal();
        window.location.reload();  // Refresh the page to reflect changes
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to update staff!',
        });
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const deleteStaff = async (staffId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedstaff/${staffId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Staff deleted successfully!',
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete staff!',
        });
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  return (
    <div>
      <div className="card card-outline card-info">
        <div className="card-header">
          <h4 className="card-title">Staffs</h4>
          <Button className="float-right btn-info btn-sm" onClick={handleShowModal}>
            <FaPlus /> Add Staff
          </Button>
        </div>
        <div className="card-body">
          <table id="staffsTable" className="table table-bordered table-striped table-sm"></table>
        </div>
      </div>

      {showModal && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
          centered
        >
         <Modal.Header closeButton className="modal-header-custom">
           <Modal.Title>{editMode ? 'Edit Staff' : 'Add Staff'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newStaff.firstname}
                      onChange={(e) => setNewStaff({ ...newStaff, firstname: e.target.value })}
                    />
                    {errors.firstname && <small className="text-danger">{errors.firstname}</small>}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newStaff.lastname}
                      onChange={(e) => setNewStaff({ ...newStaff, lastname: e.target.value })}
                    />
                    {errors.lastname && <small className="text-danger">{errors.lastname}</small>}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={newStaff.phonenumber}
                      onChange={(e) => setNewStaff({ ...newStaff, phonenumber: e.target.value })}
                    />
                    {errors.phonenumber && <small className="text-danger">{errors.phonenumber}</small>}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      as="select"
                      className="content-justify-center"
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.roleid} value={role.rolename}>
                          {role.rolename}
                        </option>
                      ))}
                    </Form.Control>
                    {errors.role && <small className="text-danger">{errors.role}</small>}
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={newStaff.emailaddress}
                  onChange={(e) => setNewStaff({ ...newStaff, emailaddress: e.target.value })}
                />
                {errors.emailaddress && <small className="text-danger">{errors.emailaddress}</small>}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              <FaTimes /> Cancel
            </Button>
            <Button
              variant="info"
              onClick={editMode ? handleUpdateNewStaff : handleSaveNewStaff}
              className="btn-custom"
            >
              <FaSave /> {editMode ? 'Update Staff' : 'Add Staff'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Staffs;
