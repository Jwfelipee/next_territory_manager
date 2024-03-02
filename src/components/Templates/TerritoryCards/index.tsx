import { clsx } from 'clsx';
import * as React from 'react';

import { ITerritoryActions, ITerritoryCard, TerritoryCard } from '@/common/territories';


interface TerritoryCardsProps extends React.ComponentPropsWithoutRef<'div'> {
  data: ITerritoryCard[]
  actions: ITerritoryActions
}

export default function TerritoryCards({ className, data, actions, ...rest }: TerritoryCardsProps) {
  return (
    <div className={clsx(['flex h-full w-full flex-col md:flex-row md:flex-wrap items-center justify-center p-2 pb-12 gap-4', className])} {...rest}>

      {data?.map((territoryCard) => (
        <TerritoryCard
          key={territoryCard.territoryId}
          data={territoryCard}
          actions={actions}
          onShareClick={() => actions.share(territoryCard.territoryId)}
        />
      ))}

    </div>
  )
}