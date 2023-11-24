import dayjs from "dayjs";
import { Eye, Share2 } from "react-feather";
import toast from "react-hot-toast";

import { ITerritoryCard } from "@/common/territories/type";
import { ITerritoryActions } from "@/common/territories/useTerritories";
import { ShareCopy } from "@/common/territory/ShareCopy";



interface HeaderButtonsProps {
  territoryCard: ITerritoryCard;
  actions: ITerritoryActions;
}

export const HeaderButtons = ({ territoryCard, actions }: HeaderButtonsProps) => {

  return (
    <div className='flex items-center justify-end gap-2'>
      {territoryCard?.signature?.key && (<Eye className='cursor-pointer' onClick={() => actions.blockNavigation(territoryCard.territoryId)} />)}
      {
        territoryCard.overseer && territoryCard.signature.expirationDate ? (
          <ShareCopy
            actions={actions}
            id={territoryCard.territoryId}
            message={{
              title: `*DESIGNAÇÃO DE TERRITÓRIO*`,
              url: `${origin}/home?p=territorio/${territoryCard.territoryId}&s=${territoryCard?.signature?.key}`,
              text: `*DESIGNAÇÃO DE TERRITÓRIO*\n\nPrezado irmão *_${territoryCard.overseer}_*\nsegue o link para o território *${territoryCard.name}* que você irá trabalhar até ${dayjs(territoryCard.signature.expirationDate).format('DD/MM/YYYY')} \n\n\r`,
            }}
            signatureKey={territoryCard?.signature?.key as string}
            key={territoryCard.territoryId}
          />
        ) : (
          <Share2 id="overseer-share" onClick={() => toast.error('Não é possível compartilhar um território sem dirigente ou data de expiração')} size={24} />
        )
      }
    </div>
  );
};