import React, { useState } from "react";
import "./App.css";

import { Sidebar } from "./component/side-bar";
import { DeviceGrid } from "./component/device-grid";
import { Settings } from "./component/settings";
export type MenuKey = "Home" | "Board" | "Settings";

const Menu: Record<MenuKey, React.ReactNode> = {
  Home: <></>,
  Board: <DeviceGrid rows={5} columns={5} />,
  Settings: <Settings />,
};

function App() {
  const [menu, setMenu] = useState<MenuKey>("Board");
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-row min-h-0">
        <Sidebar setMenu={setMenu}></Sidebar>
        {Menu[menu]}
      </div>
    </div>
  );
}

export default App;
