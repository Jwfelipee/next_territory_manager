import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Edit, Edit2, Edit3, Eye, Share2 } from 'react-feather';
import toast from 'react-hot-toast';

import { IconContainer } from '@/components/Atoms/IconContainer';
import { ShareCopy, ShareProps } from '@/components/Atoms/ShareCopy';

import { ITerritoryCard } from '@/common/territories';

interface HeaderTerritoryCardProps extends React.ComponentPropsWithoutRef<'div'> {
  data: ITerritoryCard;
  onShareClick: () => void;
}

export default function HeaderTerritoryCard({ className, data, onShareClick, ...rest }: HeaderTerritoryCardProps) {
  const navigation = useRouter();
  const shareData: ShareProps = {
    signatureKey: data.signature.key ?? '',
    message: data.shareData
  }

  const blockNavigation = (territoryId: string) => {
    navigation.push(`/territorio/${territoryId}?round=${data.round}`);
  }

  const territoryEditNavigate = (territoryId: string) => {
    navigation.push(`/territorio/${territoryId}/editar`);
  }

  return (
    <div className={clsx(['flex h-full w-full items-center justify-between', className])} {...rest}>
      <h6 className='ml-2 block text-xl font-medium'>{data.name}</h6>
      <div className='flex items-center justify-end gap-1'>
        <IconContainer icon={<EyeComponent
          data={data.signature.key}
          onClick={() => blockNavigation(data.territoryId)}
        />}
        />
        <IconContainer icon={<ShareComponent
          condition={Boolean(data.overseer && data.signature.expirationDate)}
          data={shareData}
          onShareClick={onShareClick}
        />}
        />
        <IconContainer icon={<Edit id="overseer-edit" onClick={() => territoryEditNavigate(data.territoryId)} />}
        />
      </div>
    </div>
  )
}

const EyeComponent = ({ data, onClick }) => {
  return data && (<Eye className='cursor-pointer' onClick={onClick} />)
}

const ShareComponent = ({ data, condition, onShareClick }) => {
  if (condition) {
    return <ShareCopy
      id="overseer-share"
      data={data}
      onShareClick={onShareClick}
    />
  }

  return <IconContainer
    className='!cursor-not-allowed !opacity-50'
    icon={<Share2 id="overseer-share" onClick={() => toast.error('Não é possível compartilhar um território sem dirigente ou data de expiração')} size={24} />}
  />


}