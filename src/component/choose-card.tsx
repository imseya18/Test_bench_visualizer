import { Button, Dropdown, DropdownTrigger } from '@heroui/react';
import { CardPropreties } from '../stores/card-store';
import { Icon } from '@iconify/react';
import { CardTypeDropdown } from './type-card-dropdown';
export function ChooseCard({ id, onBoardPosition }: CardPropreties) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='flat' color='primary' startContent={<Icon icon='lucide:plus' />}>
          choose a card
        </Button>
      </DropdownTrigger>
      <CardTypeDropdown id={id} onBoardPosition={onBoardPosition} />
    </Dropdown>
  );
}
