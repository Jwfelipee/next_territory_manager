import { Button } from "@material-tailwind/react";

import { IActions, ITerritoryCard } from "@/components/Organisms/TerritoryCard/type";


interface ActionsProps {
  territoryCard: ITerritoryCard;
  actions: IActions;
  changeOverseer: (overseer: string) => void;
}

export const Actions = ({ territoryCard, actions, changeOverseer }: ActionsProps) => {
  if (territoryCard.signature.key) {
    return (
      <Button
        id='admin-revoke-access'
        onClick={() => {
          changeOverseer('')
          actions.revoke(territoryCard.territoryId)
        }}
        className='bg-primary px-2'
      >
        Revogar acesso
      </Button>
    );
  }
  return (
    <Button
      id='admin-revoke-access'
      disabled
      variant="outlined"
      className='px-2'
    >
      Revogar acesso
    </Button>
  );
};
