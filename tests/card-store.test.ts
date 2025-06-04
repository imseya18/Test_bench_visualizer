import { act } from 'react';
import { useCardStore, CardPropreties } from '../src/stores/card-store';

describe('CardStore - unit test', () => {
  beforeEach(() => {
    useCardStore.getState().resetCards();
  });

  it('Cards empty at start', () => {
    const cardsInitial = useCardStore.getState().cards;
    expect(cardsInitial).toEqual({});
  });

  it('initCard: Initialization of a Card', () => {
    const id = 'c1';
    const card: CardPropreties = { id, onBoardPosition: 5 };
    act(() => {
      useCardStore.getState().initCard(id, card);
    });
    const cards = useCardStore.getState().cards;
    expect(cards[id]).toEqual(card);
  });

  it('updateCard: partialy modify an existing Card', () => {
    const id = 'c1';
    const card: CardPropreties = { id, onBoardPosition: 5, type: 'de-next-rap8-x86' };
    act(() => {
      useCardStore.getState().initCard(id, card);
    });
    act(() => {
      useCardStore.getState().updateCard(id, { type: 'imx8mm-cgt-sx8m-rev-a' });
    });
    const updated_card: CardPropreties = useCardStore.getState().cards[id];
    expect(updated_card).toEqual({
      id,
      onBoardPosition: 5,
      type: 'imx8mm-cgt-sx8m-rev-a',
    });
  });

  it('setCards: Replace whole state.cards', () => {
    const cardsObj: Record<string, CardPropreties> = {
      a: { id: 'a', onBoardPosition: 0 },
      b: { id: 'b', onBoardPosition: 1 },
    };
    act(() => {
      useCardStore.getState().setCards(cardsObj);
    });
    expect(useCardStore.getState().cards).toEqual(cardsObj);
  });
});
