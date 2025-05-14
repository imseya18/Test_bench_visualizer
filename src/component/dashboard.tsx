import { Button, Spinner } from '@heroui/react';

import { useEffect } from 'react';

import { useBoardStore } from '../utils/board-store';
export function Dashboard() {
  const boards = useBoardStore((state) => state.boards);
  const loading = useBoardStore((state) => state.jsonLoading);
  const error = useBoardStore((state) => state.jsonError);

  useEffect(() => {
    console.log(boards);
  }, [boards]);

  if (loading) {
    return <Spinner label='Fetching Data...'></Spinner>;
  }
  if (!boards || boards.length === 0) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-4 w-fullscreen'>
        No Board Found
        <Button>Create Board</Button>
      </div>
    );
  }

  return (
    <div className='grid gap-4 p-4 grid-cols-5'>
      {/* {boards.map((cards) => (
        <DeviceCard key={cards.id} id={cards.id} />
      ))} */}
    </div>
  );
}
