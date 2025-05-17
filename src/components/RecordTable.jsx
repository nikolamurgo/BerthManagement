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
        berth_depth: 12
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
        berth_depth: 10
    }
];

const RecordTable = () => {
    const [records, setRecords] = useState(initialRecords);
    const [editId, setEditId] = useState(null);

    const handleSave = (id, updatedRecord) => {
        const newRecords = records.map((rec) => (rec.id === id ? updatedRecord : rec));
        setRecords(newRecords);
        setEditId(null);
    };

    const handleCancel = () => {
        setEditId(null);
    };

    return (
        <div className="row gy-4">
            {records.map((record) => (
                <div className="col-md-6" key={record.id}>
                    <EditableRow
                        record={record}
                        isEditing={editId === record.id}
                        onEdit={() => setEditId(record.id)}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </div>
            ))}
        </div>
    );
};

export default RecordTable;
