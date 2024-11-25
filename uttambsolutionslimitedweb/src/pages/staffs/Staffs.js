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
        { data: "roleid", title: "Role" },
        {
          data: null,
          title: "Actions",
          orderable: false,
          render: (data, type, row) => `
            <button class="btn btn-info btn-xs">Edit</button>
            <button class="btn btn-danger btn-xs">Delete</button>
          `,
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
        const updatedData = await response.json();
        setStaffData((prev) => [...prev, updatedData]);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Permission added successfully!',
        });
        handleCloseModal();
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to save permission!',
        });
        const errorData = await response.json();
        console.error(errorData.message || "Failed to save staff.");
      }
    } catch (error) {
      console.error("Error saving staff:", error.message);
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
          <Modal.Header closeButton>
            <Modal.Title>Add Staff</Modal.Title>
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
            <Button variant="info" onClick={handleSaveNewStaff}>
              <FaSave /> Add Staff
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Staffs;
