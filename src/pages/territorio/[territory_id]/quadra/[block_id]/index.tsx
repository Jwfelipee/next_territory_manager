/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { driver } from 'driver.js';
import { useRouter } from 'next/router';
import { HelpCircle } from 'react-feather';

import "driver.js/dist/driver.css";

import { Street, useBlock } from '@/common/block';
import { RootModeScreen } from '@/common/loading';
import { DialogMap } from '@/common/territory/components/DialogMap';
import { Body, Header } from '@/ui';

export default function Block() {
  const { query } = useRouter()
  const { block_id, round, territory_id } = query as { territory_id: string, block_id: string, round: string };

  const { block, actions, isLoading } = useBlock(block_id, territory_id, round);


  const driverAction = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { element: '#overseer-image', popover: { title: 'Imagem', description: 'Aqui você encontra a imagem do território.' } },
        { element: '#publisher-gps', popover: { title: 'GPS', description: 'Clique aqui para abrir o GPS e ser direcionado para a localização da quadra.' } },
        { element: '#publisher-details', popover: { title: 'Detalhes', description: 'Visualize os detalhes do endereço e marque as casas nesta seção.' } },
      ],
      nextBtnText: 'Próximo',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
    });
    driverObj.drive()
  }

  return (
    <RootModeScreen mode={isLoading}>
      <HelpCircle onClick={driverAction} size={50} fill="#5B98AB" className='text-gray-50 z-10 cursor-pointer fixed bottom-0 right-0 m-4' />
      <div className={clsx('relative')}>
        {block.imageUrl && (
          <DialogMap title={block.territoryName}>
            <img
              className="h-full w-full object-cover object-center"
              src={block.imageUrl}
              alt="Imagem do Território"
            />
          </DialogMap>
        )}
        <Header>
          <div>
            <h1 className='flex items-center text-xl font-semibold'>
              Olá Publicador(a),
            </h1>
            <p className='text-gray-700'>Preencha as casas da quadra onde voce falou!</p>
            <hr className='my-2 w-1/2 h-0.5 bg-gray-800' />
            <h4 className='text-xl font-semibold text-gray-700'>{block?.territoryName}</h4>
            <h5 className='text-xl font-semibold text-gray-700'>{block?.blockName}</h5>
          </div>
        </Header>
        <Body>
          <div className='h-6 w-full'></div>
          <div className='flex flex-col gap-2 pb-20'>
            {block?.addresses?.map((address) => {
              const { addresses, ...blockWithoutAddress } = block;
              return (
                <Street
                  block={blockWithoutAddress}
                  key={address.id}
                  address={address}
                  actions={actions}
                />
              );
            })}
          </div>
        </Body>
      </div>
    </RootModeScreen>
  );
}
