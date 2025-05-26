import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useBoardStore } from '../utils/board-store';
import { CardPropreties } from '../utils/board-store';
import { BoardCard } from './board-card';
export const formatRelativeTime = (dateEntry: Date): string => {
  const date = new Date(dateEntry);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export function Dashboard() {
  const boards = useBoardStore((state) => state.boards);
  const loading = useBoardStore((state) => state.jsonLoading);
  const navigate = useNavigate();
  const setCards = useBoardStore((state) => state.setCards);
  const goToSelectedBoards = (cards: Record<string, CardPropreties>) => {
    setCards(cards);
    navigate('/board');
  };
  if (loading) {
    return <Spinner label='Fetching Data...'></Spinner>;
  }
  if (!boards || Object.keys(boards).length === 0) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-4 w-fullscreen'>
        No Board Found
        <Button onPress={() => goToSelectedBoards({})}>Create Board</Button>
      </div>
    );
  }

  return (
    <div className='p-4 flex-1 min-h-0'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <p className='text-default-500'>Manage and monitor your boards</p>
        </div>
        <Button
          color='primary'
          startContent={<Icon icon='lucide:plus' />}
          onPress={() => goToSelectedBoards({})}
        >
          New Board
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Object.values(boards).map((board) => (
          <BoardCard key={board.id} {...board}></BoardCard>
        ))}
      </div>
    </div>
  );
}
