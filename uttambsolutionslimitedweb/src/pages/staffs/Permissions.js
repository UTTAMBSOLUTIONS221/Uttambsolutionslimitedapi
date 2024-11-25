import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; // FontAwesome icons for buttons

const Permissions = () => {
  const [permissionsData, setPermissionsData] = useState([]);
  const [newPermission, setNewPermission] = useState({
    permissionname: "",
    permissionadmin: false,  // Added isAdmin field
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to determine if we're editing
  const [currentPermissionId, setCurrentPermissionId] = useState(null); // Store the ID of the permission being edited
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
          className: "text-right",  
          render: (data, type, row) => {
            return ` 
              <div class="d-flex justify-content-end">
                <button class="btn btn-info btn-xs" data-id="${row.permissionid}">Edit</button>
                <button class="btn btn-danger btn-xs ml-2" data-id="${row.permissionid}">Delete</button>
             </div>
            `;
          },
          createdCell: (cell, cellData, rowData) => {
            // Add event listeners after rendering the table
            $(cell).find(".btn-info").on("click", () => editPermission(rowData.permissionid));
            $(cell).find(".btn-danger").on("click", () => deletePermission(rowData.permissionid));
          },
        },
      ],
    });
  }, [permissionsData]);

  const handleShowModal = () => {
    setEditMode(false);  // Reset to add mode
    setNewPermission({
      permissionname: "",
      permissionadmin: false,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
      }
    } catch (error) {
      console.error("Error saving permission:", error);
    }
  };

  // Edit Permission Handler using GET
  const editPermission = async (permissionId) => {
    console.log(permissionId);
    setEditMode(true); // Set editing mode
    setCurrentPermissionId(permissionId); // Set the current permission ID

    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedpermission/${permissionId}`);
      if (response.ok) {
        const permissionToEdit = await response.json();
        setNewPermission({
          permissionname: permissionToEdit.permissionname,
          permissionadmin: permissionToEdit.permissionadmin,
        });
        setShowModal(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch permission details!',
        });
      }
    } catch (error) {
      console.error("Error fetching permission details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching permission details!',
      });
    }
  };

  const handleSaveUpdatedPermission = async () => {
    if (!validateForm()) return;
  
    // Add the current permission ID to the updated permission object
    const updatedPermission = { 
      ...newPermission, 
      permissionid: currentPermissionId // Ensure the correct ID is included
    };
  
    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedpermission", {
        method: "PUT", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPermission), // Send the updated permission object
      });
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Permission updated successfully!',
        });
        handleCloseModal();
        window.location.reload();  // Refresh the page to reflect changes
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to update permission!',
        });
      }
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };
  
  // Delete Permission Handler (Assuming API delete endpoint)
  const deletePermission = async (permissionId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedpermission/${permissionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Permission deleted successfully!',
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete permission!',
        });
      }
    } catch (error) {
      console.error("Error deleting permission:", error);
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
            <Modal.Title>{editMode ? 'Edit Permission' : 'Add Permission'}</Modal.Title>
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
            <Button
              variant="info"
              onClick={editMode ? handleSaveUpdatedPermission : handleSaveNewPermission}
              className="btn-custom"
            >
              <FaSave /> {editMode ? 'Update Permission' : 'Add Permission'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Permissions;
