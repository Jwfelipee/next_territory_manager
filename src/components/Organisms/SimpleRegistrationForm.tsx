import { streetGateway } from "@/infra/Gateway/StreetGateway";
import { Button, Card, Input, Option, Select, Typography } from "@material-tailwind/react";
import { use, useEffect, useState } from "react";
import toast from 'react-hot-toast';

const legendas = [
  { name: "Fundos" },
  { name: "Terreno" },
  { name: "Comércio" },
  { name: "Testemunha de Jeová" },
  { name: "Igreja" },
  { name: "Hospital" },
  { name: "Escola" },
  { name: "Residência" },
  { name: "Prédio" },
]

const dontVisitList = ["SIM", "NÃO"]

export function SimpleRegistrationForm({ blockOptions, form, addressOptions, handleClosed }) {
  const [blockSelected, setBlockSelected] = useState(blockOptions.find(b => b.name === form.block)?.name || "Quadra 1")
  const [streetSelected, setStreetSelected] = useState(addressOptions.find(b => b.id === form.addressId)?.name || "Rua 1")
  const [legendSelected, setLegendSelected] = useState(form.legend || "Residência")
  const [dontVisitSelected, setDontVisitSelected] = useState(form.dontVisit ? "SIM" : "NÃO")
  const [formState, setFormState] = useState(form)
  const [mode, setMode] = useState<"update" | "create">("create")

  const changeBlock = (value) => {
    setBlockSelected(value)
  }
  const changeLegend = (value) => {
    setLegendSelected(value)
  }
  const changeDontVisit = (value) => {
    setDontVisitSelected(value)
  }

  const changeStreet = (value) => {
    setStreetSelected(value)
  }

  const changeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, number: event.target.value })
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      ...formState,
      blockId: blockOptions.find(b => b.name === blockSelected)?.id,
      legend: legendSelected,
      dontVisit: dontVisitSelected === "SIM" ? true : false,
      addressId: addressOptions.find(b => b.name === streetSelected)?.id,
    }

    try {
      if (mode === "create") {
        const result = await streetGateway.createHouse({
          blockId: data.blockId,
          streetId: data.addressId,
          number: data.number,
          dontVisit: data.dontVisit,
          legend: data.legend,
          territoryId: data.territory,
        })
        if (result.status < 400) {
          toast.success("Casa criada com sucesso!")
          handleClosed()
        } else {
          throw new Error("Erro ao criar casa!")
        }
      } else {
        const result = await streetGateway.updateHouse({
          blockId: data.blockId,
          streetId: data.addressId,
          number: data.number,
          dontVisit: data.dontVisit,
          legend: data.legend,
          territoryId: data.territory,
        }, form.houseId)
        if (result.status < 400) {
          toast.success("Casa atualizada com sucesso!")
          handleClosed()
        } else {
          throw new Error("Erro ao atualizar casa!")
        }
      }
    } catch (error) {
      handleClosed()
      toast.error("Erro ao criar casa!")
    }
  }

  useEffect(() => {
    if (form.addressId) {
      setMode("update")
    }
  }
    , [form])

  return (
    <Card color="transparent" shadow={false} className="w-full">
      {/* adicionar botão de fechar */}
      <form className="w-full flex flex-col items-end" onSubmit={submitForm}>
        <div className="p-2 mb-1 flex w-full flex-col gap-6">
          {/* Linha 1 */}

          <div className="flex gap-2">
            <div className="mb-1 flex flex-col gap-6 w-2/3 pr-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Rua
              </Typography>
              <Select
                size="lg"
                onChange={changeStreet}
                value={streetSelected}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}

              >
                {addressOptions?.map((b, index) => (
                  // eslint-disable-next-line react/jsx-no-undef
                  <Option key={b.id} value={String(b.name)}>
                    {b.name}
                  </Option>
                ))}
              </Select >
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                N° Casa
              </Typography>
              <Input
                size="lg"
                placeholder="50"
                value={formState.number}
                onChange={changeNumber}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

          </div>
          {/* Linha 2 */}
          <div className="flex gap-6 w-full">

            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Legenda
              </Typography>
              <Select
                size="lg"
                onChange={changeLegend}
                value={legendSelected}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}

              >
                {legendas?.map((b, index) => (
                  // eslint-disable-next-line react/jsx-no-undef
                  <Option key={b.name} value={String(b.name)}>
                    {b.name}
                  </Option>
                ))}
              </Select >
            </div>


            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Não Bater
              </Typography>
              <Select
                size="lg"
                onChange={changeDontVisit}
                value={dontVisitSelected}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}

              >
                {dontVisitList?.map((b, index) => (
                  // eslint-disable-next-line react/jsx-no-undef
                  <Option key={b} value={String(b)}>
                    {b}
                  </Option>
                ))}
              </Select >
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Quadra
              </Typography>
              <Select
                size="lg"
                onChange={changeBlock}
                value={blockSelected}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}

              >
                {blockOptions?.map((b, index) => (
                  // eslint-disable-next-line react/jsx-no-undef
                  <Option key={b.id} value={String(b.name)}>
                    {b.name}
                  </Option>
                ))}
              </Select >
            </div>



          </div>

        </div>

        <Button className="m-4 mt-6 w-32 bg-primary" type="submit" >
          {mode === "create" ? "Criar" : "Atualizar"}
        </Button>

      </form>
    </Card>
  );
}