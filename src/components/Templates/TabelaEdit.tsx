/* eslint-disable react/jsx-no-undef */
import {
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  IconButton,
  Input,
  Option,
  Select,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Search } from "react-feather";

import image from '@/assets/territory_green_1.jpg';
import { Mode, RootModeScreen } from "@/common/loading";
import { DialogForm } from "@/common/territory/components/DialogForm";
import { TerritoryGateway } from "@/infra/Gateway/TerritoryGateway";
import { streetGateway } from "@/infra/Gateway/StreetGateway";

export interface Territory {
  name: string;
  typeName: string;
  imageURL: null;
  totalHouse: number;
  house: House[];
  historyOverseer: HistoryOverseer[];
  pagination: Pagination;
}

export interface HistoryOverseer {
  overseer: string;
  finished: boolean;
  initialDate: Date;
  expirationDate: Date;
  roundNumber: number;
}

export interface House {
  id: number;
  dontVisit: boolean;
  legend: string;
  number: string;
  street: string;
  observations: null;
  order: number;
}

export interface Pagination {
  totalHouses: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface IHeaderHomeProps {
  search: string;
  handleChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

let timeout: NodeJS.Timeout;

export function SortableTable() {
  const { query } = useRouter()
  const { territory_id: territoryId } = query as { territory_id: string };
  const [isLoading, setIsLoading] = useState<Mode>('loading');
  const [open, setOpen] = useState<number | boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [territory, serTerritory] = useState<Omit<Territory, 'house' | 'pagination'> & { id: number }>()
  const [blockSelected, setBlockSelected] = useState("");
  const [blockOptions, setBlock] = useState<{ id: number, name: string }[]>([]);
  const [house, setHouse] = useState<{ data: House[], pagination: Pagination }>({ data: [], pagination: { currentPage: 1, pageSize: 10, totalHouses: 0, totalPages: 1 } })

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      getHouse({
        block: blockSelected,
        search: e.target.value,
        page: String(1)
      })
    }, 1500)
  }

  const navigate = () => {
    setOpen(true)
  }

  async function getHouse({
    block,
    search,
    page
  }: {
    block: string,
    search: string,
    page: string
  }) {
    setIsLoading('loading')
    const query = new URLSearchParams({
      blockId: block,
      streetFilter: search,
      page: page,
      pageSize: "10"
    });

    const { data } = await TerritoryGateway.in().getTerritoryEditById<Territory>(+territoryId, query.toString());
    if (!data) return;

    serTerritory({
      id: +territoryId,
      name: data.name,
      imageURL: data.imageURL,
      historyOverseer: data.historyOverseer,
      totalHouse: data.totalHouse,
      typeName: data.typeName
    })

    setHouse({ data: data.house, pagination: data.pagination });
    setIsLoading('screen')
  }

  async function getData() {
    await TerritoryGateway.in().getTerritoryBlocks<{ id: number; name: string; }[]>(+territoryId).then(async (result) => {
      if (result.status !== 200) return;
      if (!result.data?.length) return;
      const selected = result.data[0].id;
      setBlock(result.data);
      setBlockSelected(String(selected));

      await getHouse({
        block: String(selected),
        search: "",
        page: "1"
      })
    })
  }

  useEffect(() => {
    setIsLoading('loading')
    getData()
    return () => {
      setBlock([])
      setBlockSelected("")
      setHouse({ data: [], pagination: { currentPage: 1, pageSize: 10, totalHouses: 0, totalPages: 1 } })
      serTerritory(undefined)
    }
  }, [territoryId])

  const changeBlock = (value?: string) => {
    if (!value) return;
    getHouse({
      block: value,
      search: "",
      page: String(house.pagination.currentPage)
    })
    setSearch("")
    setBlockSelected(value)
  }

  const nextPage = () => {
    getHouse({
      block: blockSelected,
      search: search,
      page: String(house.pagination.currentPage + 1)
    })
  }

  const previousPage = () => {
    getHouse({
      block: blockSelected,
      search: search,
      page: String(house.pagination.currentPage - 1)
    })
  }

  const handleEdit = (houseId: number) => {
    setOpen(houseId)
  }

  const deleteHouse = async (houseId: number) => {
    await streetGateway.deleteHouse(houseId)
    setSearch("")
    await getData()
  }

  return (
    // container
    <RootModeScreen mode={isLoading}>
      <DialogForm
        territory={territory}
        open={open}
        setOpen={setOpen}
        blockOptions={blockOptions}
        getData={getData}
      />
      <div className='m-auto p-4 px-10 max-w-[1480px]'>
        {/* titulo + image */}
        <div className='flex items-center gap-4 py-3'>
          <div className='w-[50px] overflow-hidden rounded-full '>
            <Image src={image} alt='logo' className='w-full' />
          </div>
          <Typography
            variant="h3"
            className="flex items-center justify-between gap-2 font-normal leading-none p-2"
          >
            {territory?.name}
          </Typography>
        </div>

        {/* search */}
        <div className="flex justify-between">

          <div className="w-[400px] laptop:w-[600px] mini:w-60 py-3">
            <Input
              id="admin-filter-search"
              label='Pesquise o território'
              className='shadow-md w-full'
              value={search}
              onChange={handleChangeSearch}
              icon={<Search size={16} />}
              autoFocus
            />
          </div>

          {/* Filtros */}
          <div className='py-3 flex gap-4'>
            <div className="flex gap-2">
              <Select
                label="Quadras"
                onChange={changeBlock}
                value={blockSelected}
                containerProps={{ className: "!min-w-[120px]" }}
              >
                {blockOptions?.map((b, index) => (
                  <Option key={index} value={String(b.id)}>
                    {b.name}
                  </Option>
                ))}
              </Select >
            </div>
            <Button variant="filled" className="bg-primary flex items-center gap-2" size="sm" onClick={navigate}>
              <Typography variant="small" color="white">
                Novo
              </Typography>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

        </div>
        {/* Tabela */}
        {house?.data?.length ? (
          <Card className="h-full w-full py-2">

            <CardBody className="overflow-scroll p-0">
              <table className=" w-full table-auto text-left">

                <TableHead />
                <tbody>
                  {house?.data.map(({ street, dontVisit, id, legend, number }, index) => {
                    const isLast = house?.data?.length && index === house?.data?.length - 1;
                    const classes = isLast
                      ? "p-3"
                      : "p-3 border-b border-blue-gray-50";
                    // fazer uma linha cinza claro e outra branco

                    const linha = index % 2 === 0 ? "bg-white" : "bg-gray-100";

                    return (
                      <tr key={street} className={linha}>

                        {/* Nome da Rua */}
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {street}
                              </Typography>
                            </div>
                          </div>
                        </td>

                        {/* Numero da casa */}
                        <td className={classes}>
                          <div className="flex flex-col justify-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {number}
                            </Typography>
                          </div>
                        </td>

                        {/* Complemento */}
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {legend}
                          </Typography>
                        </td>

                        {/* Nao Bater */}
                        <td className={classes}>
                          <div className="w-max text-center">
                            {dontVisit && (
                              <Chip
                                variant="ghost"
                                size="sm"
                                value="SIM"
                                color="red"
                              />
                            )}
                          </div>
                        </td>

                        {/* Editar */}
                        <td className={classes} onClick={() => handleEdit(id)}>
                          <Tooltip content="Edit User">
                            <IconButton variant="text" >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                        {/* Excluir */}
                        <td className={classes} onClick={() => deleteHouse(id)} >
                          <Tooltip content="Delete User">
                            <IconButton variant="text">
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>

                      </tr>
                    );
                  },
                  )}
                </tbody>
              </table>
            </CardBody>

            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Typography variant="small" color="blue-gray" className="font-normal">
                Pagina {house?.pagination?.currentPage} de {house?.pagination?.totalPages}
              </Typography>
              <div className="flex gap-2">
                {
                  house?.pagination?.currentPage === 1 ? (
                    <Button className="cursor-not-allowed opacity-40" variant="filled" size="sm" disabled>
                      Anterior
                    </Button>
                  ) : (
                    <Button className="bg-primary" variant="filled" size="sm" onClick={previousPage}>
                      Anterior
                    </Button>
                  )
                }
                {
                  house?.pagination?.currentPage === house?.pagination.totalPages ? (
                    <Button className="cursor-not-allowed opacity-40" variant="filled" size="sm" disabled>
                      Próximo
                    </Button>
                  ) : (
                    <Button className="bg-primary" variant="filled" size="sm" onClick={nextPage}>
                      Próximo
                    </Button>
                  )
                }
              </div>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex justify-center items-center h-[400px]">
            <Typography variant="h6" color="blue-gray" className="font-normal">
              Nenhum registro encontrado
            </Typography>
          </div>
        )}


      </div>
    </RootModeScreen>
  );
}

function TableHead() {
  return (
    <thead>
      <tr>
        <th
          className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50"
        >
          <Typography
            variant="small"
            color="blue-gray"
            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
          >
            Nome da Rua
            {/* <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" /> */}
          </Typography>
        </th>
        <th
          className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50"
        >
          <Typography
            variant="small"
            color="blue-gray"
            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
          >
            N° da Casa
            {/* <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" /> */}
          </Typography>
        </th>
        <th
          className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50"
        >
          <Typography
            variant="small"
            color="blue-gray"
            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
          >
            Legenda
            {/* <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" /> */}
          </Typography>
        </th>
        <th
          className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50"
        >
          <Typography
            variant="small"
            color="blue-gray"
            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
          >
            Não Bater
            {/* <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" /> */}
          </Typography>
        </th>
        <th
          className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50"
        >
          <Typography
            variant="small"
            color="blue-gray"
            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
          >
            Editar
            {/* <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" /> */}
          </Typography>
        </th>

        <th
          className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50"
        >
          <Typography
            variant="small"
            color="blue-gray"
            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
          >
            Excluir
            {/* <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" /> */}
          </Typography>
        </th>
      </tr>
    </thead>
  );
}