import { useCallback, useEffect, useState } from "react"
import { useRecoilState } from "recoil"

import { ITerritoryCard, IUseHome } from "@/common/territory/type"
import { TerritoryGateway } from "@/infra/Gateway/TerritoryGateway"
import { loadState } from "@/states/load"
import { navigatorShare } from "@/utils/share"

export const useTerritory = (): IUseHome => {
  const [_, _setLoadState] = useRecoilState(loadState)
  const [search, setSearch] = useState<string>('')
  const [territoryCards, setTerritoryCards] = useState<ITerritoryCard[]>([])

  const getTerritoryCards = useCallback(async (): Promise<void> => {
      _setLoadState({ loader: 'spiral', message: 'Carregando territórios' })
      const { status, data } = await TerritoryGateway.in().get()
      if (status > 299) {
         alert('Erro ao buscar os territórios')
         return
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setTerritoryCards(data)
      _setLoadState({ loader: 'none', message: '' })
   }, [_setLoadState])
  
  useEffect(() => {
     getTerritoryCards()
  }, [getTerritoryCards])

  const changeRound = async (id: number): Promise<void> => {
     const territory = territoryCards.find(territory => territory.territoryId === id)
     if (!territory) {
        alert('Território não encontrado')
        return
     }
     if (territory.hasRounds) {
        void await finishRound(id)
     } else {
        void await startRound(id)
     }

     void getTerritoryCards()
  }

  const finishRound = async (id: number): Promise<void> => {
     const { status } = await TerritoryGateway.in().finishRound(id)
     if (status > 299) {
        alert('Erro ao fechar rodada do território')
        return
     }
  }

  const startRound = async (id: number): Promise<void> => {
     const { status } = await TerritoryGateway.in().startRound(id)
     if (status > 299) {
        alert('Erro ao abrir rodada do território')
        return
     }
  }

  const share = async (territoryId: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
     e.preventDefault()
     e.stopPropagation()
     const territory = territoryCards.find(territory => territory.territoryId === territoryId)
     if (!territory) {
        alert('Território não encontrado')
        return
     }
     const input = {
        overseer: territory.overseer,
        expirationTime: territory.expirationTime,
     }
     const { data, status } = await TerritoryGateway.in().signInTerritory(input, territoryId)
     if (status > 299) {
        alert('Erro ao compartilhar o território')
        return
     }
     const { signature } = data
     const origin = window.location.origin

     const toShare = {
        title: `Território para trabalhar até ${new Date(territory.expirationTime + ' GMT-3').toLocaleDateString()}`,
        url: `${origin}/territorio/${signature}`,
        text: `Prezado irmão *_${territory.overseer}_*\nsegue o link para o território *${territory.name}* que você irá trabalhar até ${new Date(territory.expirationTime + ' GMT-3').toLocaleDateString()} \n\n\r`
     }
     await navigatorShare(toShare)
  }

  const updateData = (event: React.ChangeEvent<HTMLInputElement>, territoryId: number): void => {
     const { name, value } = event.target
     const territory = territoryCards.find(territory => territory.territoryId === territoryId)
     if (!territory) {
        alert('Território não encontrado')
        return
     }
     setTerritoryCards(old => old.map(territory => {
        if (territory.territoryId === territoryId) {
           // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
           (territory as any)[name] = value
        }
        return territory
     }))
  }

  const revoke = async (territoryId: number): Promise<void> => {
     const territory = territoryCards.find(territory => territory.territoryId === territoryId)
     if (!territory) {
        alert('Território não encontrado')
        return
     }
     const { status } = await TerritoryGateway.in().revoke(territoryId)
     if (status > 299) {
        alert('Erro ao revogar o território')
        return
     }

     void getTerritoryCards()

     setTerritoryCards(old => old.map(territory => {
        if (territory.territoryId === territoryId) {
           territory.expirationTime = ''
           territory.overseer = ''
        }
        return territory
     }))
  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
     setSearch(event.target.value)
  }

  const submitSearch = async (): Promise<void> => {
     _setLoadState({ loader: 'spiral', message: 'Buscando territórios' })
     const { status, data } = await TerritoryGateway.in().get(search)
     if (status > 299) {
        alert('Erro ao buscar os territórios')
        return
     }
     setTerritoryCards(data)
     _setLoadState({ loader: 'none', message: '' })
  }

  return {
     search,
     territoryCards,
     actions: {
        changeRound,
        share,
        updateData,
        revoke
     },
     handleChangeSearch,
     submitSearch: () => void submitSearch(),
  }
}
