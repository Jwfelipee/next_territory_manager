/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { parseCookies } from "nookies";
import { atom } from "recoil";

import { env } from '@/constant/env'


type AuthState = {
   token: string
   overseer?: string
   territoryId: number
   blockId?: number
   expirationTime: number
   signatureId?: string
   mode?: string
   roles?: Partial<Roles>[]
}
 
type Roles = 'admin' | 'publisher' | 'overseer'

const { token } = env.storage
const { [token]: tokenCookies } = parseCookies()

export const authState = atom<AuthState>({
   key: 'authState',
   default: {
      token: tokenCookies || '',
      overseer: '',
      territoryId: 0,
      blockId: 0,
      expirationTime: 0,
      signatureId: '',
      mode: '',
      roles: (() => {
         const storage =  '' as string
         if (!storage) return []
         const roles: Partial<Roles>[] = storage?.includes(',') ? storage.split(',') as any : [storage]
         return roles
      })(),
   },
});