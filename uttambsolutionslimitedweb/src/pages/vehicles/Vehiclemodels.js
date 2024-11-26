import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; // FontAwesome icons for buttons

const Vehiclemodels = () => {
  const [vehicleModelsData, setVehicleModelsData] = useState([]);
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [newVehicleModel, setNewVehicleModel] = useState({
    vehiclemodelname: "",
    vehiclemakeid: 0,
    vehicleimage: null, // Add an image field
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to determine if we're editing
  const [currentVehicleModelId, setCurrentVehicleModelId] = useState(null); // Store the ID of the permission being edited
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false); // State to track processing status
  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

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

    // Fetch vehicle Makes
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
        { data: "vehiclemakename", title: "Make Name" },
        { data: "vehiclemodelname", title: "Model Name" },
        {
          data: "vehicleimage", // Column to display the image
          title: "Image",
          render: (data) => {
            return `<img src="${data}" alt="Vehicle Image" width="50" height="50" />`;
          },
        },
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
        vehiclemakeid: 0,
        vehicleimage: null,
    });
    setImagePreview(null); // Reset image preview
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewVehicleModel({ ...newVehicleModel, vehicleimage: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewVehicleModel = async () => {
    if (!validateForm()) return;
    setIsProcessing(true); // Start processing

    const vehicleModel = {
      vehiclemodelname: newVehicleModel.vehiclemodelname,
      vehiclemakeid: vehicleMakes.find((vehicleMakeObj) => vehicleMakeObj.vehiclemakename === newVehicleModel.vehicleMake)?.vehiclemakeid || 0,
      vehicleimage: imagePreview, // Add image to payload
    };

    try {
      const formData = new FormData();
      formData.append('vehiclemodelname', vehicleModel.vehiclemodelname);
      formData.append('vehiclemakeid', vehicleModel.vehiclemakeid);
      if (newVehicleModel.vehicleimage) {
        formData.append('vehicleimage', newVehicleModel.vehicleimage); // Append image file
      }

      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel", {
        method: "POST",
        body: formData,
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
    } finally {
      setIsProcessing(false); // End processing
    }
  };

  // Edit Permission Handler using GET
  const editVehicleModel = async (vehiclemodelId) => {
    setEditMode(true); // Set editing mode
    setCurrentVehicleModelId(vehiclemodelId); // Set the current permission ID

    try {
      const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel/${vehiclemodelId}`);
      if (response.ok) {
        const vehicleModelToEdit = await response.json();
        setNewVehicleModel({
            vehiclemodelname: vehicleModelToEdit.vehiclemodelname,
            vehicleMake: vehicleMakes.find((vehicleMakeObj) => vehicleMakeObj.vehiclemakeid === vehicleModelToEdit.vehiclemakeid)?.vehiclemakename || "",
            vehicleimage: vehicleModelToEdit.vehicleimage || null, // Set image if exists
        });
        setImagePreview(vehicleModelToEdit.vehicleimage || null); // Set image preview if exists
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

    setIsProcessing(true); // Start processing
    const updatedVehicleModel = {
      ...newVehicleModel,
      vehiclemodelid: currentVehicleModelId,
      vehiclemakeid: vehicleMakes.find((vehicleMakeObj) => vehicleMakeObj.vehiclemakename === newVehicleModel.vehicleMake)?.vehiclemakeid || 0,
    };

    try {
      const formData = new FormData();
      formData.append('vehiclemodelid', updatedVehicleModel.vehiclemodelid);
      formData.append('vehiclemodelname', updatedVehicleModel.vehiclemodelname);
      formData.append('vehiclemakeid', updatedVehicleModel.vehiclemakeid);
      if (newVehicleModel.vehicleimage) {
        formData.append('vehicleimage', newVehicleModel.vehicleimage); // Append image file if new one
      }

      const response = await fetch("http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel", {
        method: "PUT", // Use PUT for updates
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle model updated successfully!',
        });
        handleCloseModal();
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Failed to update vehicle model!',
        });
      }
    } catch (error) {
      console.error("Error updating vehicle model:", error);
    } finally {
      setIsProcessing(false); // End processing
    }
  };

  // Delete Vehicle Model Handler
  const deleteVehicleModel = async (vehiclemodelId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8001/api/Uttambsolutionslimitedvehiclemodel/${vehiclemodelId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Vehicle model has been deleted.',
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
      }
    });
  };

  return (
    <>
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Vehicle Model" : "Add Vehicle Model"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} controlId="vehicleModelName">
              <Form.Label column sm="3">Model Name</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Enter Vehicle Model Name"
                  value={newVehicleModel.vehiclemodelname}
                  onChange={(e) =>
                    setNewVehicleModel({ ...newVehicleModel, vehiclemodelname: e.target.value })
                  }
                  isInvalid={errors.vehiclemodelname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.vehiclemodelname}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="vehicleMake">
              <Form.Label column sm="3">Make</Form.Label>
              <Col sm="9">
                <Form.Control
                  as="select"
                  value={newVehicleModel.vehicleMake}
                  onChange={(e) =>
                    setNewVehicleModel({ ...newVehicleModel, vehicleMake: e.target.value })
                  }
                >
                  <option value="">Select Vehicle Make</option>
                  {vehicleMakes.map((make) => (
                    <option key={make.vehiclemakeid} value={make.vehiclemakename}>
                      {make.vehiclemakename}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm="3">Vehicle Image</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img src={imagePreview} alt="Preview" width="100" height="100" />
                  </div>
                )}
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            <FaTimes /> Cancel
          </Button>
          <Button variant="primary" onClick={editMode ? handleSaveUpdatedVehicleModel : handleSaveNewVehicleModel} disabled={isProcessing}>
            {isProcessing ? <Spinner as="span" animation="border" size="sm" /> : <FaSave />}
            {editMode ? "Save Changes" : "Save Vehicle Model"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Vehiclemodels;
