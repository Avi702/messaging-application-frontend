import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'

const API_URL = process.env.EXPO_PUBLIC_API_URL

type PublicUser = {
    _id: string
    displayName: string
    createdAt: string
    lastOnline: string
    isOnline: boolean
}

type AuthContextType = {
    user: PublicUser | null
    isAuthenticated: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }){
    const [user, setUser] = useState<PublicUser | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        checkAuth()
    },[])

    async function checkAuth(){
        try{
            const accessToken = await SecureStore.getItemAsync('accessToken')
            if(!accessToken){
                setUser(null)
                return
            }
            const valid = await authenticate(accessToken)
            if(!valid){
                // access token expired/corrupt -> try the refresh token
                await tryRefresh()
            }
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    // validates an access token against the backend and sets the user if good
    async function authenticate(accessToken: string){
        const res = await fetch(`${API_URL}/api/v1/authentication/authenticate`,{
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ accessToken })
        })
        if(!res.ok){
            return false
        }
        setUser(await res.json())
        return true
    }

    async function tryRefresh(){
        const refreshToken = await SecureStore.getItemAsync('refreshToken')
        if(!refreshToken){
            setUser(null)
            return
        }
        const res = await fetch(`${API_URL}/api/v1/authentication/refresh`,{
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ refreshToken })
        })
        if(!res.ok){
            await logout()
            return
        }
        const tokens = await res.json()
        await SecureStore.setItemAsync('accessToken', tokens.accessToken)
        await SecureStore.setItemAsync('refreshToken', tokens.refreshToken)
        await authenticate(tokens.accessToken)
    }

    async function login(email: string, password: string){
        const res = await fetch(`${API_URL}/api/v1/authentication/login`,{
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ email, password })
        })
        const body = await res.json()
        if(!res.ok){
            throw new Error(body?.error?.code || 'LOGIN_FAILED')
        }
        await SecureStore.setItemAsync('accessToken', body.accessToken)
        await SecureStore.setItemAsync('refreshToken', body.refreshToken)
        setUser(body.user)
    }

    async function logout(){
        await SecureStore.deleteItemAsync('accessToken')
        await SecureStore.deleteItemAsync('refreshToken')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
