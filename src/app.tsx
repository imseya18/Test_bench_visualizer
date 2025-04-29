import React from "react";
import "./App.css";

import { Sidebar } from "./component/side-bar";
import { DeviceGrid } from "./component/device-grid";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-row min-h-0">
        <Sidebar></Sidebar>
        <DeviceGrid rows={5} columns={5}></DeviceGrid>
      </div>
    </div>
  );
}

export default App;
