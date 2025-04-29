import "../App.css";
import { DeviceCard } from "./device-card";
import React, { useEffect } from "react";
import { CardPropreties } from "../utils/board-store";
import { useBoardStore } from "../utils/board-store";
import { nanoid } from "nanoid";

interface DeviceGridProperties {
  rows: number;
  columns: number;
}

export function DeviceGrid({ rows, columns }: DeviceGridProperties) {
  const total = rows * columns;
  const initCard = useBoardStore((state) => state.initCard);
  const cards = useBoardStore((state) => state.cards);

  useEffect(() => {
    // to prevent reRender when ReactMode.Strict enabled
    if (Object.keys(cards).length > 0) return;
    console.log("on re ici");
    for (let index = 0; index < total; index++) {
      const initialCard: CardPropreties = { id: nanoid() };
      initCard(initialCard.id, initialCard);
    }
  }, [initCard, cards]);

  return (
    <div
      className={`grid gap-4 p-4 flex-1 min-h-0 dark:bg-background grid-cols-5`}
    >
      {Object.keys(cards).map((id) => (
        <DeviceCard key={id} id={id}></DeviceCard>
      ))}
    </div>
  );
}
