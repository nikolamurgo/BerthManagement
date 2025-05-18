import React, { useState, useEffect } from "react";
import EditableRow from "./EditableRow";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function parseCustomDateTime(str) {
    if (!str) return null;
    const parts = str.split(" ");
    if (parts.length < 4) return null;

    const day = parts[0].replace(".", "").padStart(2, "0");
    const month = parts[1].replace(".", "").padStart(2, "0");
    const year = parts[2];
    const time = parts[3];

    const isoString = `${year}-${month}-${day}T${time}`;
    return new Date(isoString);
}

function isConflict(date1, date2) {
    if (!date1 || !date2) return false;
    if (
        date1.getFullYear() !== date2.getFullYear() ||
        date1.getMonth() !== date2.getMonth() ||
        date1.getDate() !== date2.getDate()
    ) return false;

    const diffHours = Math.abs(date1 - date2) / (1000 * 60 * 60);
    return diffHours <= 10;
}

function getBerthConflicts(records) {
    const berthMap = {};
    records.forEach((rec) => {
        if (!rec.berth_number || !rec.eta_arrival) return;
        const arrivalDate = parseCustomDateTime(rec.eta_arrival);
        if (!arrivalDate) return;
        if (!berthMap[rec.berth_number]) berthMap[rec.berth_number] = [];
        berthMap[rec.berth_number].push({ id: rec.id, arrivalDate });
    });

    const conflictIds = new Set();
    Object.values(berthMap).forEach((arrivals) => {
        for (let i = 0; i < arrivals.length; i++) {
            for (let j = i + 1; j < arrivals.length; j++) {
                if (isConflict(arrivals[i].arrivalDate, arrivals[j].arrivalDate)) {
                    conflictIds.add(arrivals[i].id);
                    conflictIds.add(arrivals[j].id);
                }
            }
        }
    });
    return conflictIds;
}

const RecordTable = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [predictions, setPredictions] = useState({});
    const [predictingId, setPredictingId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newRecord, setNewRecord] = useState({
        vessel_name: "",
        vessel_code: "",
        vessel_length: "",
        vessel_draft: "",
        eta_arrival: "",
        actual_arrival: "",
        departure: "",
        berth_number: "",
        total_vessel_weight: "",
    });

    const mapBackendToFrontend = (v) => ({
        id: v["Vessel Code"] || Math.random(),
        vessel_name: v["Vessel Name"] || "",
        vessel_code: v["Vessel Code"] || "",
        vessel_length: parseFloat(v["Vessel Length"]?.replace(",", ".") || 0),
        vessel_draft: parseFloat(v["Draft"]?.replace(",", ".") || 0),
        eta_arrival: v["Arrival Date and Time ETA"] || "",
        actual_arrival: "",
        departure: "",
        berth_number: v["Berth Code/Label"] || "",
        total_vessel_weight: parseFloat(v["Total Vessel Weight"]?.replace(",", ".") || 0),
    });

    useEffect(() => {
        fetch("http://127.0.0.1:8000/get-data/")
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    const mapped = data.data.map(mapBackendToFrontend);

                    mapped.sort((a, b) => new Date(a.eta_arrival) - new Date(b.eta_arrival));

                    setRecords(mapped);
                } else {
                    setError("No data found");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch vessel data");
                setLoading(false);
            });
    }, []);


    const handlePredict = async (record) => {
        setPredictingId(record.id);
        setError(null);

        const rawPayload = {
            "Vessel Length": record.vessel_length.toString().replace(".", ","),
            "Draft": record.vessel_draft.toString().replace(".", ","),
            "Cargo Weight": "0",
            "Total Vessel Weight": record.total_vessel_weight.toString().replace(".", ","),
            "Arrival_Hour": new Date(record.eta_arrival).getHours(),
            "Arrival_Day": new Date(record.eta_arrival).getDate(),
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/predict/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rawPayload),
            });
            const json = await response.json();

            if (json.error) {
                setError(json.error);
            } else {
                setPredictions((prev) => ({
                    ...prev,
                    [record.id]: json.predicted_berth,
                }));
            }
        } catch {
            setError("Prediction request failed");
        } finally {
            setPredictingId(null);
        }
    };

    const handleSave = (id, updatedRecord) => {
        const updated = records.map((rec) => (rec.id === id ? updatedRecord : rec));
        setRecords(updated);
        setEditId(null);
    };

    const handleCancel = () => {
        setEditId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            setRecords(records.filter((rec) => rec.id !== id));
        }
    };

    const handleNewChange = (e) => {
        const { name, value } = e.target;
        setNewRecord({ ...newRecord, [name]: value });
    };

    const handleAddNew = () => {
        const newId = Date.now();
        const recordToAdd = { id: newId, ...newRecord };
        setRecords((prev) => [recordToAdd, ...prev]);

        setNewRecord({
            vessel_name: "",
            vessel_code: "",
            vessel_length: "",
            vessel_draft: "",
            eta_arrival: "",
            actual_arrival: "",
            departure: "",
            berth_number: "",
            total_vessel_weight: "",
        });

        document.getElementById("closeModalBtn").click();
    };

    const filteredRecords = records.filter((rec) =>
        rec.vessel_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const conflictIds = getBerthConflicts(filteredRecords);

    const handleGeneratePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Cargo Ship Berth Records", 14, 20);

        const tableData = filteredRecords.map((rec) => [
            rec.vessel_code,
            rec.eta_arrival,
            rec.departure,
            rec.berth_number,
        ]);

        autoTable(doc, {
            startY: 30,
            head: [["Vessel Code", "ETA Arrival", "ETA Departure", "Berth Number"]],
            body: tableData,
        });

        doc.save("ship_records.pdf");
    };

    if (loading) return <p>Loading vessels...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
                    ➕ Add New Record
                </button>
                <button onClick={handleGeneratePDF} className="btn btn-warning">
                    📄 Generate PDF
                </button>
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search by Boat ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="row gy-4">
                {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                        <div className="col-12 col-md-6 col-lg-4" key={record.id}>
                            <EditableRow
                                record={record}
                                isEditing={editId === record.id}
                                onEdit={() => setEditId(record.id)}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDelete={handleDelete}
                                onPredict={handlePredict}
                                predictingId={predictingId}
                                isConflict={conflictIds.has(record.id)}
                            />
                            {predictions[record.id] && (
                                <div className="alert alert-success mt-2">
                                    Predicted Berth:{" "}
                                    {Array.isArray(predictions[record.id])
                                        ? predictions[record.id][0]
                                        : predictions[record.id]}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted">No records found.</div>
                )}
            </div>

            {/* Add New Record Modal */}
            <div className="modal fade" id="addModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Record</h5>
                            <button
                                id="closeModalBtn"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
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
