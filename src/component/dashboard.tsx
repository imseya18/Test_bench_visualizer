import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, Button, Tooltip, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useBoardStore } from '../utils/board-store';
import { CardPropreties } from '../utils/board-store';
const formatRelativeTime = (dateEntry: Date): string => {
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
          <Card key={board.id} isPressable className='border border-content3'>
            <CardBody className='p-0'>
              <div className='h-32 bg-content2 relative overflow-hidden'>
                {/* Board thumbnail or visualization */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  {board.deviceCount > 0 ? (
                    <div className='grid grid-cols-5 gap-1 p-2 opacity-70 scale-75'>
                      {Object.values(board.cards)
                        .sort((a, b) => b.onBoardPosition - a.onBoardPosition)
                        .map((card) => {
                          return (
                            <div
                              key={card.id}
                              className={`w-4 h-4 rounded-sm ${
                                card.type ? 'bg-success' : 'bg-default-300'
                              }`}
                            />
                          );
                        })}
                    </div>
                  ) : (
                    <Icon icon='lucide:layout-grid' size={48} className='text-default-300' />
                  )}
                </div>
              </div>

              <div className='p-4'>
                <h2 className='text-xl font-semibold mb-1'>{board.name}</h2>
                <p className='text-default-500 text-small mb-3'>{board.description}</p>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-1'>
                    <Icon icon='lucide:cpu' size={16} className='text-default-500' />
                    <span className='text-small'>
                      {board.activeDevices}/{board.deviceCount} devices
                    </span>
                  </div>
                  <Tooltip content={board.lastUpdated.toLocaleString()}>
                    <div className='flex items-center gap-1 text-default-500'>
                      <Icon icon='lucide:clock' size={14} />
                      <span className='text-tiny'>{formatRelativeTime(board.lastUpdated)}</span>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </CardBody>
            <CardFooter className='flex justify-between border-t border-content3'>
              <Button
                size='sm'
                variant='light'
                startContent={<Icon icon='lucide:settings' size={16} />}
              >
                Configure
              </Button>
              <Button
                size='sm'
                color='primary'
                variant='flat'
                startContent={<Icon icon='lucide:external-link' size={16} />}
                onPress={() => goToSelectedBoards(board.cards)}
              >
                Open
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
