import clsx from "clsx";

import { BuildIcon } from "@/assets/icons/BuildIcon";
import { HouseIcon } from "@/assets/icons/HouseIcon";
import { StoreIcon } from "@/assets/icons/StoreIcon";

const Icon = {
  'Residencial': <HouseIcon />,
  'Comercial': <StoreIcon />,
}

interface TabTerritoryTypesProps extends React.ComponentPropsWithoutRef<'div'> {
  options: {
    id: number;
    name: string;
  }[];
  selectedType: string;
  changeSelectType: (id: number) => void;
  showComponent: boolean;

}

export const TabTerritoryTypes = ({ options, selectedType, changeSelectType, showComponent }: TabTerritoryTypesProps) => {
  return (
    <div className="flex">
      {options.map((type, index) => {
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
                className={`hidden mini:flex items-center gap-2 text-lg transition-opacity duration-150 ${showComponent ? 'opacity-100' : 'opacity-0'}`}>
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
  )
}