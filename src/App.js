import React from "react";
import RecordTable from "./components/RecordTable";
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container bg-white shadow-lg rounded p-4">
        <Header />
        <RecordTable />
      </div>
    </div>
  );
}

export default App;
