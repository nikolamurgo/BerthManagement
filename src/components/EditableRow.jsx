import React, { useState } from "react";

const EditableRow = ({ record, isEditing, onEdit, onSave, onCancel }) => {
  const [editedRecord, setEditedRecord] = useState({ ...record });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecord({ ...editedRecord, [name]: value });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">Boat ID: {record.boat_id}</h5>

        {/* Vessel Info Section */}
        <h6 className="text-primary fw-bold mb-3">Vessel Information</h6>

        <div className="row mb-2">
          <label className="col-sm-5 col-form-label">Boat Length:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="text"
                name="boat_length"
                value={editedRecord.boat_length}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.boat_length}</div>
            )}
          </div>
        </div>

        <div className="row mb-2">
          <label className="col-sm-5 col-form-label">Draft:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="text"
                name="draft"
                value={editedRecord.draft}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.draft}</div>
            )}
          </div>
        </div>

        <div className="row mb-2">
          <label className="col-sm-5 col-form-label">ETA Arrival:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="datetime-local"
                name="eta_arrival"
                value={editedRecord.eta_arrival}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.eta_arrival}</div>
            )}
          </div>
        </div>

        <div className="row mb-2">
          <label className="col-sm-5 col-form-label">Actual Arrival:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="datetime-local"
                name="actual_arrival"
                value={editedRecord.actual_arrival}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.actual_arrival}</div>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <label className="col-sm-5 col-form-label">ETA Departure:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="datetime-local"
                name="eta_departure"
                value={editedRecord.eta_departure}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.eta_departure}</div>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <label className="col-sm-5 col-form-label">Actual Departure:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="datetime-local"
                name="actual_departure"
                value={editedRecord.actual_departure}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.actual_departure}</div>
            )}
          </div>
        </div>

        {/* Berth Info Section */}
        <h6 className="text-primary fw-bold mb-3">Berth Information</h6>

        <div className="row mb-2">
          <label className="col-sm-5 col-form-label">Berth Number:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="text"
                name="berth_number"
                value={editedRecord.berth_number}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.berth_number}</div>
            )}
          </div>
        </div>

        <div className="row mb-2">
          <label className="col-sm-5 col-form-label">Berth Length:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="text"
                name="berth_length"
                value={editedRecord.berth_length}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.berth_length}</div>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <label className="col-sm-5 col-form-label">Berth Depth:</label>
          <div className="col-sm-7">
            {isEditing ? (
              <input
                type="text"
                name="berth_depth"
                value={editedRecord.berth_depth}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <div className="form-control-plaintext">{record.berth_depth}</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => onSave(record.id, editedRecord)}
                className="btn btn-success"
              >
                ✅ Save
              </button>
              <button
                onClick={onCancel}
                className="btn btn-secondary"
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="btn btn-primary"
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableRow;
