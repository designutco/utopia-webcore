'use client'

import { createContext, useContext } from 'react'

interface UserContextType {
  email: string
  name: string
  role: 'admin' | 'designer' | 'writer'
}

const UserContext = createContext<UserContextType>({ email: '', name: '', role: 'admin' })

export function UserProvider({ children, value }: { children: React.ReactNode; value: UserContextType }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
