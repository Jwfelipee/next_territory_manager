import { ShareMessageProps, ShareProps } from '@/components/Atoms/ShareCopy';

import { Period } from '@/enum/Period';

export type IUseHome = {
  search: string;
  territoryCards: ITerritoryCard[];
  actions: IActions;
  handleChangeSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  submitSearch: () => void;
};

export type ITerritoryCard = {
  territoryId: string;
  name: string;
  overseer: string;
  signature: {
    key: string | null;
    expirationDate: string;
  };
  hasRounds: boolean;
  positiveCompleted: {
    date: Date;
    period: Period;
  }[];
  negativeCompleted: number;
  shareData: ShareMessageProps;
  round: number;
};

export type IActions = {
  share: (territoryId: string) => Promise<void>;
  copyShare: (territoryId: string) => void;
  updateData: (event: React.ChangeEvent<HTMLInputElement>, territoryId: string) => void;
  updateDateTime: (event: React.ChangeEvent<HTMLInputElement>, territoryId: string) => void;
  revoke: (territoryId: string) => Promise<void>;
  blockNavigation: (territoryId: string) => void;
};
