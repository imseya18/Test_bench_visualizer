import { Button, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from '@heroui/react';
import { CardPropreties, useBoardStore } from '../utils/board-store';
import { Icon } from '@iconify/react';
import { CARD_TYPE_ARRAY } from '../utils/global-variable';
import { CardType } from '../utils/global-variable';

export function ChooseCard({ id }: CardPropreties) {
  const useUpdateCard = useBoardStore((state) => state.updateCard);
  const updateCard = (patch: Partial<CardPropreties>) => {
    useUpdateCard(id, patch);
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='flat' color='primary' startContent={<Icon icon='lucide:plus' />}>
          choose a card
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Types de composants'
        onAction={(key) => updateCard({ type: key as CardType })}
      >
        {CARD_TYPE_ARRAY.map((type) => (
          <DropdownItem key={type}>{type}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
