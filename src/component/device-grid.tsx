import "../App.css";
import { DeviceCard } from "./device-card";
import React from "react";
import { CardPropreties } from "../utils/board-store";
import { useBoardStore } from "../utils/board-store";
import { nanoid } from "nanoid";

interface DeviceGridProperties {
  rows: number;
  columns: number;
}

export function DeviceGrid({ rows, columns }: DeviceGridProperties) {
  const total = rows * columns;
  const cells = [];
  const initCard = useBoardStore((state) => state.initCard);

  for (let index = 0; index < total; index++) {
    const initialCard: CardPropreties = { id: nanoid() };
    initCard(initialCard.id, initialCard);
    cells.push(<DeviceCard key={index} id={index.toString()}></DeviceCard>);
  }
  return (
    <div
      className={`grid gap-4 p-4 flex-1 min-h-0 dark:bg-background grid-cols-5`}
    >
      {cells}
    </div>
  );
}
