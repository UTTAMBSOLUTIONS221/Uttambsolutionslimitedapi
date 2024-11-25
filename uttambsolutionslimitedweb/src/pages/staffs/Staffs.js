import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import Swal from "sweetalert2";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTimes, FaEdit } from "react-icons/fa";

const Staffs = () => {
  const [staffData, setStaffData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    emailaddress: "",
    role: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch staff and roles data on component load
  useEffect(() => {
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

  // Initialize DataTable
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
            <button class="btn btn-info btn-xs edit-btn">Edit</button>
            <button class="btn btn-danger btn-xs delete-btn">Delete</button>
          `,
        },
      ],
    });

    $("#staffsTable tbody").on("click", ".edit-btn", function () {
      const rowData = $("#staffsTable").DataTable().row($(this).parents("tr")).data();
      handleEditStaff(rowData);
    });
  }, [staffData]);

  // Show modal for adding or editing staff
  const handleShowModal = () => {
    setShowModal(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewStaff({
      firstname: "",
      lastname: "",
      phonenumber: "",
      emailaddress: "",
      role: "",
    });
    setCurrentStaff(null);
    setIsEdit(false);
  };

  // Handle Edit
  const handleEditStaff = (staff) => {
    setIsEdit(true);
    setCurrentStaff(staff);
    setNewStaff({
      firstname: staff.firstname,
      lastname: staff.lastname,
      phonenumber: staff.phonenumber,
      emailaddress: staff.emailaddress,
      role: roles.find((role) => role.roleid === staff.roleid)?.rolename || "",
    });
    handleShowModal();
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

  // Save or Update Staff
  const handleSaveStaff = async () => {
    if (!validateForm()) return;
    const payload = {
      ...currentStaff,
      firstname: newStaff.firstname,
      lastname: newStaff.lastname,
      emailaddress: newStaff.emailaddress,
      phonenumber: newStaff.phonenumber,
      roleid: roles.find((role) => role.rolename === newStaff.role)?.roleid || 0,
    };

    try {
      const url = `http://localhost:8001/api/Uttambsolutionslimitedstaff${isEdit ? `/${currentStaff.staffid}` : ""}`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setStaffData((prev) =>
          isEdit
            ? prev.map((staff) => (staff.staffid === updatedData.staffid ? updatedData : staff))
            : [...prev, updatedData]
        );
        Swal.fire({
          icon: "success",
          title: isEdit ? "Staff updated successfully!" : "Staff added successfully!",
        });
        handleCloseModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to save staff!",
        });
      }
    } catch (error) {
      console.error("Error saving staff:", error);
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
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>{isEdit ? "Edit Staff" : "Add Staff"}</Modal.Title>
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
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={newStaff.emailaddress}
                      onChange={(e) => setNewStaff({ ...newStaff, emailaddress: e.target.value })}
                    />
                    {errors.emailaddress && <small className="text-danger">{errors.emailaddress}</small>}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              <FaTimes /> Close
            </Button>
            <Button variant="info" onClick={handleSaveStaff}>
              <FaSave /> {isEdit ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Staffs;
