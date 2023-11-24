import { Input } from "@material-tailwind/react";
import { driver } from "driver.js";
import Image from 'next/image';
import { Info, Search } from 'react-feather';

import "driver.js/dist/driver.css";

import image from '@/assets/territory_green_1.jpg';
interface IHeaderHomeProps {
  search: string;
  handleChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitSearch: () => void;
}

let timeout: NodeJS.Timeout;

export function HeaderHome({
  search,
  handleChangeSearch,
  submitSearch,
}: IHeaderHomeProps) {

  const driverAction = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { element: '#admin-filter-search', popover: { title: 'Pesquisar Território', description: 'Encontre o território por nome ou número.' } },
        { element: '#admin-filter-type', popover: { title: 'Filtrar por Tipo', description: 'Filtre os territórios de acordo com o tipo.' } },
        { element: '#admin-filter-round', popover: { title: 'Filtrar por Rodada', description: 'Filtre os territórios de acordo com a rodada.' } },
        { element: '#admin-chart', popover: { title: 'Gráfico', description: 'Visualize no gráfico os detalhes deste território, incluindo a porcentagem de conclusão e o período de trabalho.' } },
        { element: '#admin-overseer', popover: { title: 'Dirigente', description: 'Adicione o nome do dirigente que utilizará este território.' } },
        { element: '#admin-expirationTime', popover: { title: 'Expiração', description: 'Adicione a data de expiração do acesso do dirigente a este território.' } },
        { element: '#overseer-share', popover: { title: 'Compartilhar', description: 'Compartilhe o território com o dirigente.' } },
        { element: '#admin-revoke-access', popover: { title: 'Revogar acesso', description: 'Revogue o acesso do dirigente a este território se necessário.' } },
      ],
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
    });
    driverObj.drive()
  }

  return (
    <div className='p-2 py-4'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <div className='w-[50px] overflow-hidden rounded-full '>
            <Image src={image} alt='logo' className='w-full' />
          </div>

          <div className="w-60">
            <Input
              id="admin-filter-search"
              label='Pesquise o território'
              className='shadow-md'
              value={search}
              onChange={handleChangeSearch}
              onKeyDown={submitSearch}
              icon={<Search size={16} />}
            />
          </div>

        </div>
        <Info onClick={driverAction} size={35} fill="rgb(121 173 87 / var(--tw-text-opacity))" className='text-gray-50 cursor-pointer' />
      </div>
    </div>

  );
}
