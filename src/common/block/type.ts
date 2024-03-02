export type IUseBlock = {
  block: IBlock;
  actions: IActions;
};

export type IActions = {
  goToStreet: (streetId: number) => void;
};

export type IBlock = {
  territoryId: string;
  territoryName: string;
  imageUrl?: string;
  blockId: string;
  blockName: string;
  addresses: IAddress[];
};

export type IAddress = {
  id: number;
  name: string;
  houses: House[];
};

export type House = string;
