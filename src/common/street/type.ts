export type IUseStreet = {
  street: Street;
  actions: IActions;
};

export type IActions = {
  mark: (id: string) => Promise<void>;
};

export type Street = {
  streetName: string;
  territoryName: string;
  blockName: string;
  houses: House[];
};

export type House = {
  id: string;
  number: string;
  complement: string | null;
  order: string;
  legend: string;
  status: boolean;
  dontVisit: boolean;
};

export type IMessage = {
  type: string;
  data: any;
};
// build
