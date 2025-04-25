import "./App.css";
import { DeviceCard } from "./device-card";
import React from "react";

interface DeviceGrid {
  rows: number;
  columns: number;
}

export const DeviceGrid: React.FC<DeviceGrid> = ({ rows, columns }) => {
  const total = rows * columns;
  const cells = [];
  for (let index = 0; index < total; index++) {
    cells.push(
      <DeviceCard
        key={index}
        id={index}
        name="test"
        status="Running"
        completedTests={15}
        totalTests={25}
      ></DeviceCard>
    );
  }
  return (
    <div className="grid grid-cols-5 gap-4 flex-1 min-h-0 p-4 dark:bg-background">
      {cells}
    </div>
  );
};
