import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; // FontAwesome icons for buttons

const Vehiclemodels = () => {
  const [vehicleModelsData, setVehicleModelsData] = useState([]);
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [newVehicleModel, setNewVehicleModel] = useState({
    vehiclemodelname: "",
    vehiclemakeid:0
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to determine if we're editing
  const [currentVehicleModelId, setCurrentVehicleModelId] = useState(null); // Store the ID of the permission being edited
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch vehicle Models data
    const fetchVehicleModelsData = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel");
        if (response.ok) {
          const data = await response.json();
          setVehicleModelsData(data);
        } else {
          console.error("Failed to fetch vehicle Models data");
        }
      } catch (error) {
        console.error("Error fetching vehicle Models data:", error);
      }
    };
    const fetchVehicleMakes = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemake");
        if (response.ok) {
          const data = await response.json();
          setVehicleMakes(data);
        } else {
          console.error("Failed to fetch vehicle makes");
        }
      } catch (error) {
        console.error("Error fetching vehicle makes:", error);
      }
    };

    fetchVehicleModelsData();
    fetchVehicleMakes();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable("#vehicleModelTable")) {
      $("#vehicleModelTable").DataTable().destroy();
    }

    $("#vehicleModelTable").DataTable({
      data: vehicleModelsData,
      columns: [
        { data: "vehiclemodelname", title: "Model Name" },
        {
          data: null,
          title: "Actions",
          orderable: false,
          className: "text-right",  
          render: (data, type, row) => {
            return ` 
              <div class="d-flex justify-content-end">
                <button class="btn btn-info btn-xs" data-id="${row.vehiclemodelid}">Edit</button>
                <button class="btn btn-danger btn-xs ml-2" data-id="${row.vehiclemodelid}">Delete</button>
             </div>
            `;
          },
          createdCell: (cell, cellData, rowData) => {
            // Add event listeners after rendering the table
            $(cell).find(".btn-info").on("click", () => editVehicleModel(rowData.vehiclemodelid));
            $(cell).find(".btn-danger").on("click", () => deleteVehicleModel(rowData.vehiclemodelid));
          },
        },
      ],
    });
  }, [vehicleModelsData]);

  const handleShowModal = () => {
    setEditMode(false);  // Reset to add mode
    setNewVehicleModel({
        vehiclemodelname: "",
        vehiclemakeid:0
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newVehicleModel.vehiclemodelname.trim()) newErrors.vehiclemodelname = "Vehicle model name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveNewVehicleModel = async () => {
    if (!validateForm()) return;
    const vehicleModel = {
      vehiclemodelname:newVehicleModel.vehiclemodelname,
      vehiclemakeid:vehicleMakes.find((vehicleMakeObj) => vehicleMakeObj.vehiclemakename === newVehicleModel.vehicleMake)?.vehiclemakeid || 0, 
    };
    
    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleModel),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle model added successfully!',
        });
        handleCloseModal();
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to save vehicle model!',
        });
      }
    } catch (error) {
      console.error("Error saving vehicle model:", error);
    }
  };

  // Edit Permission Handler using GET
  const editVehicleModel = async (vehiclemodelId) => {
    console.log(vehiclemodelId);
    setEditMode(true); // Set editing mode
    setCurrentVehicleModelId(vehiclemodelId); // Set the current permission ID

    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel/${vehiclemodelId}`);
      if (response.ok) {
        const vehicleModelToEdit = await response.json();
        setNewVehicleModel({
            vehiclemodelname: vehicleModelToEdit.vehiclemodelname,
        });
        setShowModal(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch vehicle model details!',
        });
      }
    } catch (error) {
      console.error("Error fetching vehicle model details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching vehicle model details!',
      });
    }
  };

  const handleSaveUpdatedVehicleModel = async () => {
    if (!validateForm()) return;
  
    // Add the current permission ID to the updated permission object
    const updatedVehicleModel = { 
      ...newVehicleModel, 
      vehiclemodelid: currentVehicleModelId // Ensure the correct ID is included
    };
  
    try {
      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel", {
        method: "PUT", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVehicleModel), // Send the updated permission object
      });
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle model updated successfully!',
        });
        handleCloseModal();
        window.location.reload();  // Refresh the page to reflect changes
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to update vehicle model!',
        });
      }
    } catch (error) {
      console.error("Error updating vehicle model:", error);
    }
  };
  
  // Delete Permission Handler (Assuming API delete endpoint)
  const deleteVehicleModel = async (vehiclemodelId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel/${vehiclemodelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle model deleted successfully!',
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete vehicle model!',
        });
      }
    } catch (error) {
      console.error("Error deleting vehicle model:", error);
    }
  };

  return (
    <div>
      <div className="card card-outline card-info">
        <div className="card-header">
          <h4 className="card-title">Vehicle Models</h4>
          <Button className="float-right btn-info btn-sm" onClick={handleShowModal}>
            <FaPlus /> Add Model
          </Button>
        </div>
        <div className="card-body">
          <table id="vehicleModelTable" className="table table-bordered table-striped table-sm"></table>
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
            <Modal.Title>{editMode ? 'Edit Model' : 'Add Model'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <Form>
              <Row className="mb-3">
              <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label>Vehicle Make</Form.Label>
                    <Form.Control
                      as="select"
                      className="content-justify-center"
                      value={newVehicleModel.vehicleMake}
                      onChange={(e) => setNewVehicleModel({ ...newVehicleModel, vehicleMake: e.target.value })}
                    >
                      <option value="">Select Vehicle Make</option>
                      {vehicleMakes.map((vehicleMake) => (
                        <option key={vehicleMake.vehiclemakeid} value={vehicleMake.vehiclemakename}>
                          {vehicleMake.vehiclemakename}
                        </option>
                      ))}
                    </Form.Control>
                    {errors.vehicleMake && <small className="text-danger">{errors.vehicleMake}</small>}
                  </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Model Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newVehicleModel.vehiclemodelname}
                        onChange={(e) => setNewVehicleModel({ ...newVehicleModel, vehiclemodelname: e.target.value })}
                        className="form-control-custom"
                      />
                      {errors.vehiclemodelname && <small className="text-danger">{errors.vehiclemodelname}</small>}
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
              onClick={editMode ? handleSaveUpdatedVehicleModel : handleSaveNewVehicleModel}
              className="btn-custom"
            >
              <FaSave /> {editMode ? 'Update Vehicle Model' : 'Add Vehicle Model'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Vehiclemodels;
