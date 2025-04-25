import "./App.css";
import { DeviceCard } from "./device-card";
import React from "react";

interface DeviceGridProperties {
  rows: number;
  columns: number;
}

export function DeviceGrid({ rows, columns }: DeviceGridProperties) {
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
    <div
      className={`grid gap-4 p-4 flex-1 min-h-0 dark:bg-background grid-cols-${columns}`}
    >
      {cells}
    </div>
  );
}
