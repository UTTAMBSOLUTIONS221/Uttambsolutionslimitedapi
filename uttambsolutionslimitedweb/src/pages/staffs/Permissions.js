import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; // FontAwesome icons for buttons

const Permissions = () => {
  const [permissionsData, setPermissionsData] = useState([]);
  const [newPermission, setNewPermission] = useState({
    permissionname: "",
    permissionadmin: false,  // Added isAdmin field
  });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch permissions data
    const fetchPermissionsData = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedpermission");
        if (response.ok) {
          const data = await response.json();
          setPermissionsData(data);
        } else {
          console.error("Failed to fetch permissions data");
        }
      } catch (error) {
        console.error("Error fetching permissions data:", error);
      }
    };

    fetchPermissionsData();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable("#permissionsTable")) {
      $("#permissionsTable").DataTable().destroy();
    }

    $("#permissionsTable").DataTable({
      data: permissionsData,
      columns: [
        { data: "permissionname", title: "Permission Name" },
        { data: "permissionadmin", title: "Is Admin", render: (data) => (data ? "Yes" : "No") },
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
  }, [permissionsData]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewPermission({
      permissionname: "",
      permissionadmin: false, // Reset isAdmin checkbox
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newPermission.permissionname.trim()) newErrors.permissionname = "Permission name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveNewPermission = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedpermission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPermission),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setPermissionsData((prev) => [...prev, updatedData]);
        alert("Permission added successfully!");
        handleCloseModal();
      } else {
        const errorData = await response.json();
        console.error(errorData.message || "Failed to save permission.");
      }
    } catch (error) {
      console.error("Error saving permission:", error.message);
    }
  };

  return (
    <div>
      <div className="card card-outline card-info">
        <div className="card-header">
          <h4 className="card-title">Permissions</h4>
          <Button className="float-right btn-info btn-sm" onClick={handleShowModal}>
            <FaPlus /> Add Permission
          </Button>
        </div>
        <div className="card-body">
          <table id="permissionsTable" className="table table-bordered table-striped table-sm"></table>
        </div>
      </div>

      {showModal && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
          centered
          className="modal-custom"
        >
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>Add Permission</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Form>
              <Row className="mb-3">
                <Col xs={12} sm={8}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Permission Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newPermission.permissionname}
                      onChange={(e) => setNewPermission({ ...newPermission, permissionname: e.target.value })}
                      className="form-control-custom"
                    />
                    {errors.permissionname && <small className="text-danger">{errors.permissionname}</small>}
                  </Form.Group>
                </Col>
                <Col xs={12} sm={4} className="d-flex align-items-center">
                  <Form.Group className="d-flex align-items-center">
                    <Form.Label className="mr-2 form-label-custom">Is Admin</Form.Label>
                    <Form.Check
                      type="checkbox"
                      checked={newPermission.permissionadmin}
                      onChange={(e) => setNewPermission({ ...newPermission, permissionadmin: e.target.checked })}
                      className="form-check-custom"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer className="modal-footer-custom">
            <Button variant="secondary" onClick={handleCloseModal} className="btn-custom">
              <FaTimes /> Cancel
            </Button>
            <Button variant="info" onClick={handleSaveNewPermission} className="btn-custom">
              <FaSave /> Add Permission
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Permissions;