import * as React from 'react';
import { useState } from "react";
import { Check, Copy, Share2 } from "react-feather";
import toast from 'react-hot-toast';

import { IconContainer } from '@/components/Atoms/IconContainer';

export interface ShareMessageProps {
  title: string;
  text: string;
  url: string;
}

export interface ShareProps {
  signatureKey?: string;
  message: ShareMessageProps
}

interface ShareCopyProps extends React.ComponentPropsWithoutRef<'div'> {
  data: ShareProps
  onShareClick: () => void;
}

export const ShareCopy = ({ className, data, onShareClick, ...rest }: ShareCopyProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  async function copyToClipboard() {
    setCopySuccess(true);
    navigate()
    setTimeout(() => {
      setCopySuccess(false);
    }, 7000)
  };

  // Como comunicar componente pai que o usuário clicou no botão de compartilhar?
  const navigate = async () => {
    try {
      console.log('navigator', data)
      const can = navigator.canShare(data.message);
      if (!can) {
        toast.error('Não foi possível compartilhar');
        return;
      }
      await navigator.share(data.message);
    } catch (error: any) {
      console.log(`Error sharing: ${error?.message}`);
    }
  }

  if (data.signatureKey) {
    return (
      <IconContainer
        icon={<CopyComponent copySuccess={copySuccess} onClick={copyToClipboard} />}
        {...rest}
      />
    )
  }

  return (
    <IconContainer
      icon={<Share2 onClick={onShareClick} size={24} />}
      {...rest}
    />
  )
}

const CopyComponent = ({ copySuccess, onClick }: { copySuccess: boolean, onClick }) => {
  return (
    copySuccess ? (
      <Check className='text-primary' />
    ) : (
      <Copy className='text-gray-700' onClick={onClick} />
    )

  );
}