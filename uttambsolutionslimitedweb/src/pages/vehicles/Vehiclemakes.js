import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-bs4'; // DataTables Bootstrap 4 integration
import 'datatables.net-bs4/css/dataTables.bootstrap4.css'; // DataTables CSS for Bootstrap 4

const Vehiclemakes = () => {
  const [vehicleMakeName, setVehicleMakeName] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        // Initialize DataTable with AJAX to load data from the REST API
        const table = $("#vehicleMakesTable").DataTable({
          processing: true,
          serverSide: true, // Optional: Use if server-side processing is enabled in the API
          ajax: {
            url: "http://localhost:8001/api/Uttambsolutionslimitedstaff", // Replace with your API endpoint
            method: "GET",
            dataSrc: "", // Adjust based on the structure of your API response
          },
          columns: [
            { data: "name", title: "Name" },
            { data: "position", title: "Position" },
            { data: "office", title: "Office" },
            { data: "age", title: "Age" },
            { data: "startDate", title: "Start Date" },
            { data: "salary", title: "Salary" },
          ],
        });
    
        // Cleanup on unmount
        return () => {
          table.destroy(true);
        };
      }, []);

        const handleShowModal = () => setShowModal(true);
        const handleCloseModal = () => setShowModal(false);
        const handleSaveChanges = async () => {
        if (!vehicleMakeName.trim()) {
            setError("Make name is required.");
            return;
        }
    
        try {
            setError(""); // Clear previous errors
    
            // API call to save data
            const response = await fetch("http://localhost:8001/api/vehicle-makes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: vehicleMakeName }),
            });
    
            if (response.ok) {
            alert("Vehicle make created successfully!");
            setVehicleMakeName(""); // Clear input
            setShowModal(false); // Close modal
    
            // Reload DataTable
            $("#vehicleMakesTable").DataTable().ajax.reload();
            } else {
            const errorData = await response.json();
            setError(`Failed to save: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            setError(`Network error: ${error.message}`);
        }
    };
    
      return (
        <div>
            <div className="card card-outline card-info">
                <div className="card-header">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <h4 className="card-title text-uppercase fw-bold text-custom">Vehicle Makes</h4>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <button className="btn btn-info btn-sm text-uppercase fw-bold float-right" onClick={handleShowModal} > Add Make </button>
                        </div>
                    </div>
                </div>
                <div className="card-body table-responsive">
                    <table id="vehicleMakesTable" className="table table-bordered table-sm table-striped"></table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg border-0">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title text-uppercase fw-bold">
                        Create New Vehicle Make
                        </h5>
                        <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body px-4 py-3">
                        <form>
                        <div className="mb-4">
                            <label
                            htmlFor="vehicleMakeName"
                            className="form-label fw-semibold"
                            >
                            Make Name
                            </label>
                            <input
                            type="text"
                            className={`form-control border-2 ${
                                error ? "is-invalid" : ""
                            }`}
                            id="vehicleMakeName"
                            placeholder="Enter vehicle make name"
                            value={vehicleMakeName}
                            onChange={(e) => setVehicleMakeName(e.target.value)}
                            style={{
                                borderRadius: "0.3rem",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                            />
                            {error && (
                            <div className="invalid-feedback">{error}</div>
                            )}
                        </div>
                        </form>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer d-flex justify-content-between px-4 py-3">
                        <button
                        type="button"
                        className="btn btn-secondary btn-sm fw-bold text-uppercase"
                        onClick={() => setShowModal(false)}
                        style={{
                            borderRadius: "0.25rem",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                        >
                        Close
                        </button>
                        <button
                        type="button"
                        className="btn btn-primary btn-sm fw-bold text-uppercase"
                        onClick={handleSaveChanges}
                        style={{
                            backgroundColor: "#0a506c", // Custom brand color
                            borderRadius: "0.25rem",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                        >
                        Save Changes
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            )}


        </div>
      );
    };
  export default Vehiclemakes;