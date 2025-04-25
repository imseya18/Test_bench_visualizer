import React from "react";
import "./App.css";

import { Sidebar } from "./side-bar";
import { DeviceGrid } from "./device-grid";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <main className=" dark flex-1 flex flex-row min-h-0">
        <Sidebar></Sidebar>
        <DeviceGrid rows={5} columns={5}></DeviceGrid>
      </main>
    </div>
  );
}

export default App;
