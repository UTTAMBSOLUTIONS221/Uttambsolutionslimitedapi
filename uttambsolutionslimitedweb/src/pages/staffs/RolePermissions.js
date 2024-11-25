import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; // FontAwesome icons for buttons

const RolePermissions = () => {
  const [permissionsData, setPermissionsData] = useState([]);
  const [rolesData, setRolesData] = useState([]); // Store roles
  const [selectedPermissions, setSelectedPermissions] = useState([]); // Selected permissions for a role
  const [newRole, setNewRole] = useState({
    rolename: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch permissions and roles data
  useEffect(() => {
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

    const fetchRolesData = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedrole");
        if (response.ok) {
          const data = await response.json();
          setRolesData(data);
        } else {
          console.error("Failed to fetch roles data");
        }
      } catch (error) {
        console.error("Error fetching roles data:", error);
      }
    };

    fetchPermissionsData();
    fetchRolesData();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable("#rolesTable")) {
      $("#rolesTable").DataTable().destroy();
    }

    $("#rolesTable").DataTable({
      data: rolesData,
      columns: [
        { data: "rolename", title: "Role Name" },
        {
          data: null,
          title: "Actions",
          orderable: false,
          className: "text-right",
          render: (data, type, row) => {
            return ` 
              <div class="d-flex justify-content-end">
                <button class="btn btn-info btn-xs" data-id="${row.roleid}">Edit</button>
                <button class="btn btn-danger btn-xs ml-2" data-id="${row.roleid}">Delete</button>
             </div>
            `;
          },
          createdCell: (cell, cellData, rowData) => {
            $(cell).find(".btn-info").on("click", () => editRole(rowData.roleid));
            $(cell).find(".btn-danger").on("click", () => deleteRole(rowData.roleid));
          },
        },
      ],
    });
  }, [rolesData]);

  // Show modal for adding or editing a role
  const handleShowModal = () => {
    setEditMode(false);
    setNewRole({ rolename: "" });
    setSelectedPermissions([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newRole.rolename.trim()) newErrors.rolename = "Role name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle saving a new role
  const handleSaveNewRole = async () => {
    if (!validateForm()) return;

    const newRoleData = { ...newRole, permissions: selectedPermissions };

    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedrole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoleData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Role added successfully!',
        });
        handleCloseModal();
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to save role!',
        });
      }
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  // Edit Role Handler
  const editRole = async (roleId) => {
    setEditMode(true);
    setCurrentRoleId(roleId);

    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedrole/${roleId}`);
      if (response.ok) {
        const roleToEdit = await response.json();
        setNewRole({ rolename: roleToEdit.rolename });
        setSelectedPermissions(roleToEdit.permissions || []);
        setShowModal(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch role details!',
        });
      }
    } catch (error) {
      console.error("Error fetching role details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching role details!',
      });
    }
  };

  // Handle saving updated role
  const handleSaveUpdatedRole = async () => {
    if (!validateForm()) return;

    const updatedRole = { ...newRole, id: currentRoleId, permissions: selectedPermissions };

    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedrole", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRole),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Role updated successfully!',
        });
        handleCloseModal();
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to update role!',
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Delete Role Handler
  const deleteRole = async (roleId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedrole/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Role deleted successfully!',
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete role!',
        });
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div>
      <div className="card card-outline card-info">
        <div className="card-header">
          <h4 className="card-title">Roles and Permissions</h4>
          <Button className="float-right btn-info btn-sm" onClick={handleShowModal}>
            <FaPlus /> Add Role
          </Button>
        </div>
        <div className="card-body">
          <table id="rolesTable" className="table table-bordered table-striped table-sm"></table>
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
            <Modal.Title>{editMode ? 'Edit Role' : 'Add Role'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Form>
              <Row className="mb-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Role Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newRole.rolename}
                      onChange={(e) => setNewRole({ ...newRole, rolename: e.target.value })}
                      className="form-control-custom"
                    />
                    {errors.rolename && <small className="text-danger">{errors.rolename}</small>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12}>
                  <Form.Label className="form-label-custom">Permissions</Form.Label>
                  <div className="permissions-checkboxes">
                    {permissionsData.map((permission) => (
                      <Form.Check
                        key={permission.permissionid}
                        type="checkbox"
                        label={permission.permissionname}
                        checked={selectedPermissions.includes(permission.permissionid)}
                        onChange={() => {
                          const newSelectedPermissions = selectedPermissions.includes(permission.permissionid)
                            ? selectedPermissions.filter(id => id !== permission.permissionid)
                            : [...selectedPermissions, permission.permissionid];
                          setSelectedPermissions(newSelectedPermissions);
                        }}
                      />
                    ))}
                  </div>
                </Col>
              </Row>
            </Form>
          </Modal.Body>

          <Modal.Footer className="modal-footer-custom">
            <Button variant="secondary" onClick={handleCloseModal}>
              <FaTimes /> Close
            </Button>
            <Button
              variant="info"
              onClick={editMode ? handleSaveUpdatedRole : handleSaveNewRole}
            >
              <FaSave /> {editMode ? 'Update' : 'Save'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default RolePermissions;
