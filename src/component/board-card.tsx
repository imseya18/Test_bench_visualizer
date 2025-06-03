import { BoardProperties } from '../stores/json-store';
import { Card, CardBody, CardFooter, Button, Tooltip } from '@heroui/react';
import { Modal, ModalContent, useDisclosure, ModalHeader, ModalBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { formatRelativeTime } from './dashboard';
import { useJsonStore } from '../stores/json-store';
import { CardPropreties } from '../stores/card-store';
import { useCardStore } from '../stores/card-store';
import { useNavigate } from 'react-router-dom';
export function BoardCard(board: BoardProperties) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const removeBoard = useJsonStore((state) => state.removeBoard);
  const setCards = useCardStore((state) => state.setCards);
  const navigate = useNavigate();
  const goToSelectedBoards = (cards: Record<string, CardPropreties>) => {
    setCards(cards);
    navigate('/board');
  };
  return (
    <Card key={board.id} className='border border-content3'>
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
          variant='flat'
          color='danger'
          startContent={<Icon icon='lucide:delete' size={16} />}
          onPress={onOpen}
        >
          Delete
        </Button>
        <Modal
          isOpen={isOpen}
          placement='top-center'
          className='dark text-white'
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col items-center gap-1'>
                  Are you sure you want to delete {board.name} ?
                </ModalHeader>
                <ModalBody className='flex flex-row justify-between'>
                  <Button color='primary' onPress={onClose}>
                    Close
                  </Button>
                  <Button color='danger' variant='flat' onPress={() => removeBoard(board.name)}>
                    Delete
                  </Button>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
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
  );
}
