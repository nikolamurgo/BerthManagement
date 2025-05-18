import React, { useState } from "react";

const EditableRow = ({ record, isEditing, onEdit, onSave, onCancel, onDelete, isConflict }) => {
    const [editedRecord, setEditedRecord] = useState({ ...record });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedRecord({ ...editedRecord, [name]: value });
    };

    const splitDateTime = (value) => {
        if (!value) return { date: "", time: "" };
        const [date, time] = value.split("T");
        return { date, time };
    };

    const handleDateTimeChange = (field, type, value) => {
        const current = splitDateTime(editedRecord[field]);
        const newDate = type === "date" ? value : current.date;
        const newTime = type === "time" ? value : current.time;
        setEditedRecord({ ...editedRecord, [field]: `${newDate}T${newTime}` });
    };

    return (
        <div className={`card ${isConflict ? "border border-danger bg-danger-subtle" : ""}`}>
            <div className="card-body">
                <div className="d-inline-block px-3 py-1 bg-dark text-white rounded mb-4 fw-bold">
                    Vessel Code: {record.vessel_code}
                </div>

                {isConflict && (
                    <div className="badge bg-warning text-dark mb-3">
                        ⚠️ Conflict: Duplicate Berth
                    </div>
                )}



                <h6 className="text-primary fw-bold mb-3">Vessel Information</h6>

                <div className="row mb-2">
                    <label className="col-sm-5 col-form-label fw-bold">Vessel Name:</label>
                    <div className="col-sm-7">
                        {isEditing ? (
                            <input
                                type="text"
                                name="vessel_name"
                                value={editedRecord.vessel_name}
                                onChange={handleChange}
                                className="form-control"
                            />
                        ) : (
                            <div className="form-control-plaintext">{record.vessel_name}</div>
                        )}
                    </div>
                </div>

                <div className="row mb-2">
                    <label className="col-sm-5 col-form-label fw-bold">Vessel Length:</label>
                    <div className="col-sm-7">
                        {isEditing ? (
                            <input
                                type="text"
                                name="vessel_length"
                                value={editedRecord.vessel_length}
                                onChange={handleChange}
                                className="form-control"
                            />
                        ) : (
                            <div className="form-control-plaintext">{record.vessel_length}</div>
                        )}
                    </div>
                </div>

                <div className="row mb-2">
                    <label className="col-sm-5 col-form-label fw-bold">Vessel Draft:</label>
                    <div className="col-sm-7">
                        {isEditing ? (
                            <input
                                type="text"
                                name="vessel_draft"
                                value={editedRecord.vessel_draft}
                                onChange={handleChange}
                                className="form-control"
                            />
                        ) : (
                            <div className="form-control-plaintext">{record.vessel_draft}</div>
                        )}
                    </div>
                </div>

                {/* ETA Arrival */}
                <div className="row mb-2">
                    <label className="col-sm-5 col-form-label fw-bold">ETA Arrival:</label>
                    <div className="col-sm-7">
                        <div className="d-flex flex-wrap gap-2">
                            {isEditing ? (
                                <>
                                    <input
                                        type="date"
                                        value={splitDateTime(editedRecord.eta_arrival).date}
                                        onChange={(e) =>
                                            handleDateTimeChange("eta_arrival", "date", e.target.value)
                                        }
                                        className="form-control w-auto"
                                    />
                                    <input
                                        type="time"
                                        value={splitDateTime(editedRecord.eta_arrival).time}
                                        onChange={(e) =>
                                            handleDateTimeChange("eta_arrival", "time", e.target.value)
                                        }
                                        className="form-control w-auto"
                                    />
                                </>
                            ) : (
                                <div className="form-control-plaintext">
                                    {splitDateTime(record.eta_arrival).date}{" "}
                                    <span className="ms-3">{splitDateTime(record.eta_arrival).time}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actual Arrival */}
                <div className="row mb-2">
                    <label className="col-sm-5 col-form-label fw-bold">Actual Arrival:</label>
                    <div className="col-sm-7">
                        <div className="d-flex flex-wrap gap-2">
                            {isEditing ? (
                                <>
                                    <input
                                        type="date"
                                        value={splitDateTime(editedRecord.actual_arrival).date}
                                        onChange={(e) =>
                                            handleDateTimeChange("actual_arrival", "date", e.target.value)
                                        }
                                        className="form-control w-auto"
                                    />
                                    <input
                                        type="time"
                                        value={splitDateTime(editedRecord.actual_arrival).time}
                                        onChange={(e) =>
                                            handleDateTimeChange("actual_arrival", "time", e.target.value)
                                        }
                                        className="form-control w-auto"
                                    />
                                </>
                            ) : (
                                <div className="form-control-plaintext">
                                    {splitDateTime(record.actual_arrival).date}{" "}
                                    <span className="ms-3">{splitDateTime(record.actual_arrival).time}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Departure */}
                <div className="row mb-2">
                    <label className="col-sm-5 col-form-label fw-bold">Departure:</label>
                    <div className="col-sm-7">
                        <div className="d-flex flex-wrap gap-2">
                            {isEditing ? (
                                <>
                                    <input
                                        type="date"
                                        value={splitDateTime(editedRecord.departure).date}
                                        onChange={(e) =>
                                            handleDateTimeChange("departure", "date", e.target.value)
                                        }
                                        className="form-control w-auto"
                                    />
                                    <input
                                        type="time"
                                        value={splitDateTime(editedRecord.departure).time}
                                        onChange={(e) =>
                                            handleDateTimeChange("departure", "time", e.target.value)
                                        }
                                        className="form-control w-auto"
                                    />
                                </>
                            ) : (
                                <div className="form-control-plaintext">
                                    {splitDateTime(record.departure).date}{" "}
                                    <span className="ms-3">{splitDateTime(record.departure).time}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <h6 className="text-primary fw-bold mb-3">Berth Information</h6>

                <div className="row mb-2">
                    <label className="col-sm-5 col-form-label fw-bold">Berth Number:</label>
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
                    <label className="col-sm-5 col-form-label fw-bold">Berth Length:</label>
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
                    <label className="col-sm-5 col-form-label fw-bold">Berth Depth:</label>
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

                {/* Buttons */}
                <div className="d-flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => onSave(record.id, editedRecord)} className="btn btn-success">
                                ✅ Save
                            </button>
                            <button onClick={onCancel} className="btn btn-secondary">
                                ❌ Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={onEdit} className="btn btn-primary">
                                ✏️ Edit
                            </button>
                            <button onClick={() => onDelete(record.id)} className="btn btn-danger">
                                🗑 Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditableRow;
