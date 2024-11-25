import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row } from "react-bootstrap";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; // FontAwesome icons for buttons

const Vehiclemakes = () => {
  const [vehicleMakesData, setVehicleMakesData] = useState([]);
  const [newVehicleMake, setNewVehicleMake] = useState({
    vehiclemakename: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to determine if we're editing
  const [currentVehicleMakeId, setCurrentVehicleMakeId] = useState(null); // Store the ID of the permission being edited
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch vehicle makes data
    const fetchVehicleMakesData = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemake");
        if (response.ok) {
          const data = await response.json();
          setVehicleMakesData(data);
        } else {
          console.error("Failed to fetch vehicle makes data");
        }
      } catch (error) {
        console.error("Error fetching vehicle makes data:", error);
      }
    };

    fetchVehicleMakesData();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable("#vehicleMakeTable")) {
      $("#vehicleMakeTable").DataTable().destroy();
    }

    $("#vehicleMakeTable").DataTable({
      data: vehicleMakesData,
      columns: [
        { data: "vehiclemakename", title: "Make Name" },
        {
          data: null,
          title: "Actions",
          orderable: false,
          className: "text-right",  
          render: (data, type, row) => {
            return ` 
              <div class="d-flex justify-content-end">
                <button class="btn btn-info btn-xs" data-id="${row.vehiclemakeid}">Edit</button>
                <button class="btn btn-danger btn-xs ml-2" data-id="${row.vehiclemakeid}">Delete</button>
             </div>
            `;
          },
          createdCell: (cell, cellData, rowData) => {
            // Add event listeners after rendering the table
            $(cell).find(".btn-info").on("click", () => editVehicleMake(rowData.vehiclemakeid));
            $(cell).find(".btn-danger").on("click", () => deleteVehicleMake(rowData.vehiclemakeid));
          },
        },
      ],
    });
  }, [vehicleMakesData]);

  const handleShowModal = () => {
    setEditMode(false);  // Reset to add mode
    setNewVehicleMake({
        vehiclemakename: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newVehicleMake.vehiclemakename.trim()) newErrors.vehiclemakename = "Vehicle make name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveNewVehicleMake = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVehicleMake),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle make added successfully!',
        });
        handleCloseModal();
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to save vehicle make!',
        });
      }
    } catch (error) {
      console.error("Error saving vehicle make:", error);
    }
  };

  // Edit Permission Handler using GET
  const editVehicleMake = async (vehiclemakeId) => {
    console.log(vehiclemakeId);
    setEditMode(true); // Set editing mode
    setCurrentVehicleMakeId(vehiclemakeId); // Set the current permission ID

    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedvehiclemake/${vehiclemakeId}`);
      if (response.ok) {
        const vehicleMakeToEdit = await response.json();
        setNewVehicleMake({
            vehiclemakename: vehicleMakeToEdit.vehiclemakename,
        });
        setShowModal(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch vehicle make details!',
        });
      }
    } catch (error) {
      console.error("Error fetching vehicle make details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching vehicle make details!',
      });
    }
  };

  const handleSaveUpdatedVehicleMake = async () => {
    if (!validateForm()) return;
  
    // Add the current permission ID to the updated permission object
    const updatedVehicleMake = { 
      ...newVehicleMake, 
      vehiclemakeid: currentVehicleMakeId // Ensure the correct ID is included
    };
  
    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemake", {
        method: "PUT", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVehicleMake), // Send the updated permission object
      });
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle make updated successfully!',
        });
        handleCloseModal();
        window.location.reload();  // Refresh the page to reflect changes
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to update vehicle make!',
        });
      }
    } catch (error) {
      console.error("Error updating vehicle make:", error);
    }
  };
  
  // Delete Permission Handler (Assuming API delete endpoint)
  const deleteVehicleMake = async (vehiclemakeId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedvehiclemake/${vehiclemakeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle make deleted successfully!',
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete vehicle make!',
        });
      }
    } catch (error) {
      console.error("Error deleting vehicle make:", error);
    }
  };

  return (
    <div>
      <div className="card card-outline card-info">
        <div className="card-header">
          <h4 className="card-title">Vehicle Makes</h4>
          <Button className="float-right btn-info btn-sm" onClick={handleShowModal}>
            <FaPlus /> Add Make
          </Button>
        </div>
        <div className="card-body">
          <table id="vehicleMakeTable" className="table table-bordered table-striped table-sm"></table>
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
            <Modal.Title>{editMode ? 'Edit Make' : 'Add Make'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Form>
              <Row className="mb-3">
              <Form.Group>
                    <Form.Label className="form-label-custom">Make Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newVehicleMake.vehiclemakename}
                      onChange={(e) => setNewVehicleMake({ ...newVehicleMake, vehiclemakename: e.target.value })}
                      className="form-control-custom"
                    />
                    {errors.vehiclemakename && <small className="text-danger">{errors.vehiclemakename}</small>}
                  </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer className="modal-footer-custom">
            <Button variant="secondary" onClick={handleCloseModal} className="btn-custom">
              <FaTimes /> Cancel
            </Button>
            <Button
              variant="info"
              onClick={editMode ? handleSaveUpdatedVehicleMake : handleSaveNewVehicleMake}
              className="btn-custom"
            >
              <FaSave /> {editMode ? 'Update Vehicle Make' : 'Add Vehicle Make'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Vehiclemakes;
