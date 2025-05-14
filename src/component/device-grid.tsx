import '../App.css';
import { DeviceCard } from './device-card';
import { Button } from '@heroui/react';
import React, { useEffect } from 'react';
import { CardPropreties } from '../utils/board-store';
import { useBoardStore } from '../utils/board-store';
import { nanoid } from 'nanoid';

interface DeviceGridProperties {
  rows: number;
  columns: number;
}

export function DeviceGrid({ rows, columns }: DeviceGridProperties) {
  const total = rows * columns;
  const initCard = useBoardStore((state) => state.initCard);
  const cards = useBoardStore((state) => state.cards);
  const boards = useBoardStore((state) => state.boards);
  const loading = useBoardStore((state) => state.jsonLoading);
  const error = useBoardStore((state) => state.jsonError);
  const pushboard = useBoardStore((state) => state.pushBoards);
  useEffect(() => {
    // to prevent reRender when ReactMode.Strict enabled
    if (Object.keys(cards).length > 0) return;
    for (let index = 0; index < total; index++) {
      const initialCard: CardPropreties = { id: nanoid() };
      initCard(initialCard.id, initialCard);
    }
  }, []);

  const saveBoard = () => {
    console.log(cards);
    pushboard(cards);
  };
  return (
    <>
      <div className={`grid gap-4 p-4 flex-1 min-h-0 dark:bg-background grid-cols-5`}>
        {Object.keys(cards).map((id) => (
          <DeviceCard key={id} id={id}></DeviceCard>
        ))}
      </div>
      {!loading && (
        <div>
          <Button onPress={saveBoard}>save board</Button>
        </div>
      )}
    </>
  );
}
