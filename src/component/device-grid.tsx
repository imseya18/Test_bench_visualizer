import '../App.css';
import { DeviceCard } from './device-card';
import { BoardProperties } from '../utils/board-store';
import { useEffect, useState } from 'react';
import { CardPropreties } from '../utils/board-store';
import { useBoardStore } from '../utils/board-store';
import { nanoid } from 'nanoid';
import { Icon } from '@iconify/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Select,
  SelectItem,
  Input,
} from '@heroui/react';
interface DeviceGridProperties {
  rows: number;
  columns: number;
}

export const day = [
  { key: '1', label: 'Today' },
  { key: '7', label: 'Last 7 Days' },
  { key: '30', label: 'Last 30 Days' },
  { key: '180', label: 'Last 180 Days' },
];

export function DeviceGrid({ rows, columns }: DeviceGridProperties) {
  const total = rows * columns;
  const initCard = useBoardStore((state) => state.initCard);
  const cards = useBoardStore((state) => state.cards);
  const loading = useBoardStore((state) => state.jsonLoading);
  const pushboard = useBoardStore((state) => state.pushBoards);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // to prevent reRender when ReactMode.Strict enabled
    if (Object.keys(cards).length > 0) return;
    for (let index = 0; index < total; index++) {
      const initialCard: CardPropreties = { id: nanoid(), onBoardPosition: index };
      initCard(initialCard.id, initialCard);
    }
  }, []);

  const handleSubmitNewBoard = () => {
    console.log(name);
    console.log(description);
    const deviceCount = Object.keys(cards).length;
    const activeDevices = Object.values(cards).reduce((acc, card) => acc + (card.type ? 1 : 0), 0);

    const newBoard: BoardProperties = {
      id: nanoid(),
      name,
      cards,
      description,
      deviceCount,
      activeDevices,
      lastUpdated: new Date(),
    };
    pushboard(newBoard);
    // Reset the name and Description for the next save;
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className='flex-1 flex min-h-0 flex-col'>
      {!loading && (
        <div className='flex justify-between items-center pl-3 pr-3'>
          <Select className='max-w-xs' label='Select a period'>
            {day.map((day) => (
              <SelectItem key={day.key}>{day.label}</SelectItem>
            ))}
          </Select>
          <Button onPress={onOpen} color='primary' startContent={<Icon icon='lucide:plus' />}>
            Save Board
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
                    Board Infos
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      label='Board Name'
                      placeholder='Enter board name'
                      isRequired
                      variant='bordered'
                      onValueChange={(e) => setName(e)}
                    />

                    <Textarea
                      label='Description'
                      placeholder='Enter board description'
                      variant='bordered'
                      minRows={3}
                      onValueChange={(e) => setDescription(e)}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color='danger' variant='flat' onPress={onClose}>
                      Close
                    </Button>
                    <Button color='primary' isDisabled={!name} onPress={handleSubmitNewBoard}>
                      Save
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}
      <div className={`grid gap-4 p-4 flex-1 min-h-0 dark:bg-background grid-cols-5`}>
        {Object.values(cards)
          .sort((a, b) => b.onBoardPosition - a.onBoardPosition)
          .map((cards) => (
            <DeviceCard
              key={cards.id}
              id={cards.id}
              onBoardPosition={cards.onBoardPosition}
            ></DeviceCard>
          ))}
      </div>
    </div>
  );
}
