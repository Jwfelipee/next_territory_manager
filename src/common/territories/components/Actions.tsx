import { Button } from "@material-tailwind/react";

import { IActions, ITerritoryCard } from "@/common/territories/type";

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
        className='bg-primary'
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
    >
      Revogar acesso
    </Button>
  );
};
