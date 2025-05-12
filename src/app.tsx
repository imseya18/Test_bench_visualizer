import React, { useEffect, useState } from "react";
import "./App.css";

import { Sidebar } from "./component/side-bar";
import { DeviceGrid } from "./component/device-grid";
import { Settings } from "./component/settings";
import { PipelineDetails } from "./component/pipeline-board";
import { useBoardStore } from "./utils/board-store";
export type MenuKey = "Home" | "Board" | "Settings";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";

const Menu: Record<MenuKey, React.ReactNode> = {
  Home: (
    <PipelineDetails
      deviceId={1}
      deviceName="oui"
      isOpen={true}
      onClose={() => undefined}
    />
  ),
  Board: <DeviceGrid rows={5} columns={5} />,
  Settings: <Settings />,
};

function App() {
  const fetchGitLabData = useBoardStore((s) => s.fetchGitLabData);
  useEffect(() => {
    fetchGitLabData();
  }, [fetchGitLabData]);

  return (
    <MemoryRouter>
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex flex-row min-h-0">
          <Sidebar></Sidebar>
          <Routes>
            <Route path="/" element={<></>} />
            <Route
              path="/board"
              element={<DeviceGrid rows={5} columns={5} />}
            />
            <Route path="/Settings" element={<Settings />} />
            <Route
              path="/pipelines"
              element={
                <PipelineDetails
                  deviceId={1}
                  deviceName="oui"
                  isOpen={true}
                  onClose={() => undefined}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </MemoryRouter>
  );
}

export default App;
