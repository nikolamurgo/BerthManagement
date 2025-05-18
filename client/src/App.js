import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import Header from "./components/Header";
import TopBar from "./components/TopBar";
import RecordTable from "./components/RecordTable";

function App() {
  return (
    <div className="bg-light min-vh-100">
      <TopBar />
      <div className="container bg-white shadow-lg rounded p-3 mt-4">
        <Header />
        <RecordTable />
      </div>
    </div>
  );
}

export default App;
