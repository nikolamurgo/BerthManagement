import React, { useState } from "react";
import EditableRow from "./EditableRow";

const initialRecords = [
    {
        id: 1,
        boat_id: "A123",
        boat_length: 150,
        draft: 9.2,
        eta_arrival: "2025-05-17T08:00",
        actual_arrival: "2025-05-17T08:10",
        eta_departure: "2025-05-17T14:00",
        actual_departure: "2025-05-17T14:30",
        berth_number: "Berth 5",
        berth_length: 200,
        berth_depth: 12,
    },
    {
        id: 2,
        boat_id: "B245",
        boat_length: 120,
        draft: 7.5,
        eta_arrival: "2025-05-17T10:00",
        actual_arrival: "2025-05-17T10:15",
        eta_departure: "2025-05-17T16:00",
        actual_departure: "2025-05-17T16:45",
        berth_number: "Berth 2",
        berth_length: 150,
        berth_depth: 10,
    },
];

const RecordTable = () => {
    const [records, setRecords] = useState(initialRecords);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newRecord, setNewRecord] = useState({
        boat_id: "",
        boat_length: "",
        draft: "",
        eta_arrival: "",
        actual_arrival: "",
        eta_departure: "",
        actual_departure: "",
        berth_number: "",
        berth_length: "",
        berth_depth: "",
    });

    const handleSave = (id, updatedRecord) => {
        const updated = records.map((rec) => (rec.id === id ? updatedRecord : rec));
        setRecords(updated);
        setEditId(null);
    };

    const handleCancel = () => {
        setEditId(null);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this record?");
        if (confirmed) {
            setRecords(records.filter((rec) => rec.id !== id));
        }
    };

    const handleNewChange = (e) => {
        const { name, value } = e.target;
        setNewRecord({ ...newRecord, [name]: value });
    };

    const handleAddNew = () => {
        const newId = records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;
        setRecords([{ id: newId, ...newRecord }, ...records]);
        setNewRecord({
            boat_id: "",
            boat_length: "",
            draft: "",
            eta_arrival: "",
            actual_arrival: "",
            eta_departure: "",
            actual_departure: "",
            berth_number: "",
            berth_length: "",
            berth_depth: "",
        });
        document.getElementById("closeModalBtn").click(); // close modal
    };

    const filteredRecords = records.filter((rec) =>
        rec.boat_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
                    ➕ Add New Record
                </button>
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search by Boat ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Records */}
            <div className="row gy-4">
                {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                        <div className="col-md-6" key={record.id}>
                            <EditableRow
                                record={record}
                                isEditing={editId === record.id}
                                onEdit={() => setEditId(record.id)}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted">No records found.</div>
                )}
            </div>

            {/* Modal: Add New Record */}
            <div className="modal fade" id="addModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Record</h5>
                            <button id="closeModalBtn" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {Object.keys(newRecord).map((key) => (
                                    <div className="col-md-6 mb-3" key={key}>
                                        <label className="form-label text-capitalize">{key.replace(/_/g, " ")}</label>
                                        <input
                                            type={key.includes("time") ? "datetime-local" : "text"}
                                            name={key}
                                            value={newRecord[key]}
                                            onChange={handleNewChange}
                                            className="form-control"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button className="btn btn-success" onClick={handleAddNew}>
                                Save Record
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecordTable;
