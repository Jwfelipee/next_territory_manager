import { Option, Select } from '@material-tailwind/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { BuildIcon } from '@/assets/icons/BuildIcon';
import { HouseIcon } from '@/assets/icons/HouseIcon';
import { StoreIcon } from '@/assets/icons/StoreIcon';
import { RootModeScreen } from '@/common/loading';
import {
  HeaderHome,
  TerritoryCard,
  useTerritories,
} from '@/common/territories';
import { Body } from '@/ui';

const Icon = {
  'Residencial': <HouseIcon />,
  'Comercial': <StoreIcon />,
}

export default function Territorios() {
  const {
    search,
    territoryCards,
    isLoading,
    actions,
    types,
    round,
    setTypes,
    setRound,
    handleChangeSearch,
    submitSearch
  } = useTerritories();

  const [selectedType, setSelectedType] = useState<string>();
  const [showComponent, setShowComponent] = useState(true);

  const handleSelectRound = (value?: string) => {
    if (!value) return;
    setRound(
      (prev) => {
        return {
          ...prev,
          selected: value
        }
      }
    )
  }

  const changeSelectType = (id: number) => {
    setShowComponent(false); // Inicia a animação de saída
    setTypes(
      (prev) => {
        return {
          ...prev,
          selected: id.toString()
        }
      }
    )
    setTimeout(() => {
      setSelectedType(String(id)); // Atualiza o tipo após a animação de saída
      setShowComponent(true); // Inicia a animação de entrada
    }, 300);
  }

  useEffect(() => {
    setSelectedType(String(types.selected))
  }, [types.selected]);

  return (
    <RootModeScreen mode={isLoading}>

      <div className={clsx('relative')}>
        <HeaderHome
          search={search}
          handleChangeSearch={handleChangeSearch}
          submitSearch={submitSearch}
        />
        <div>
          <div className='flex w-full items-center gap-2 justify-between px-2'>

            <div
              id="admin-filter-type"
              className="my-2 flex items-center">
              <div className="flex">
                {types.options.map((type, index) => {
                  const isSelected = selectedType == String(type.id);
                  return (
                    <button
                      key={index}
                      onClick={() => changeSelectType(type.id)}
                      className={clsx(
                        'flex items-center gap-2 text-lg  p-2 px-3',
                        isSelected ? 'border-b' : 'border rounded-lg'
                      )}
                      value={type.id}
                    >
                      {Icon[type.name]}
                      {
                        isSelected &&
                        <span
                          className={`flex items-center gap-2 text-lg transition-opacity duration-300 ${showComponent ? 'opacity-100' : 'opacity-0'}`}>
                          {type.name}
                        </span>
                      }
                    </button>
                  )
                })}
                <button
                  className="flex items-center gap-2 text-lg p-2 px-3 border rounded-lg"
                >
                  <BuildIcon />
                </button>
              </div>
            </div>

            <div id="admin-filter-round">
              <Select
                label="Rodada"
                onChange={(value) => handleSelectRound(value)}
                value={round.selected}
                containerProps={{ className: "!min-w-[85px]" }}
              >
                {round.options.map((round, index) => (
                  <Option key={index} value={String(round)}>
                    {round}
                  </Option>
                ))}
              </Select >
            </div>

          </div>

        </div>
        <Body>
          <div className='flex h-full w-full flex-col p-2 gap-4'>
            {territoryCards?.map((territoryCard, index) => (
              <TerritoryCard
                key={territoryCard.territoryId}
                territoryCard={territoryCard}
                index={index}
                actions={actions}
              />
            ))}
          </div>
        </Body>
      </div>
    </RootModeScreen>
  );
}
