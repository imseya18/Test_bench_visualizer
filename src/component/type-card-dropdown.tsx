import { DropdownMenu, DropdownItem } from '@heroui/react';
import { CardPropreties, useBoardStore } from '../utils/board-store';
import { CARD_TYPE_ARRAY } from '../utils/global-variable';
import { CardType } from '../utils/global-variable';

export function CardTypeDropdown({ id }: CardPropreties) {
  const useUpdateCard = useBoardStore((state) => state.updateCard);
  const updateCard = (patch: Partial<CardPropreties>) => {
    useUpdateCard(id, patch);
  };
  return (
    <DropdownMenu
      aria-label='Types de composants'
      onAction={(key) => updateCard({ type: key as CardType })}
    >
      {CARD_TYPE_ARRAY.map((type) => (
        <DropdownItem key={type === 'no card' ? '' : type}>{type}</DropdownItem>
      ))}
    </DropdownMenu>
  );
}
