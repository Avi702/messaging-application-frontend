import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'

const API_URL = process.env.EXPO_PUBLIC_API_URL

// The logged in user's own record, including private fields only they can see
type PrivateUser = {
    _id: string
    displayName: string
    bio: string
    createdAt: string
    lastOnline: string
    isOnline: boolean
    email: string
    birthDate: string
}

type AuthContextType = {
    user: PrivateUser | null
    isAuthenticated: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    updateProfile: (displayName: string, bio: string) => Promise<void>
    // authenticated POST that refreshes the access token once if it has expired
    authFetch: (path: string, body?: any) => Promise<Response>
    // gets a usable access token, refreshing it first if it has expired
    getValidToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }){
    const [user, setUser] = useState<PrivateUser | null>(null)
    const [loading, setLoading] = useState(true)
    // holds an in flight refresh so simultaneous 401s only refresh once
    const refreshing = useRef<Promise<string | null> | null>(null)


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
        const accessToken = await refreshTokens()
        if(!accessToken){
            return
        }
        await authenticate(accessToken)
    }

    // swaps the refresh token for a new pair; returns the new access token or null.
    // shared through a ref so several 401s at once only cause one refresh
    async function refreshTokens(): Promise<string | null> {
        if(refreshing.current){
            return await refreshing.current
        }
        refreshing.current = (async () => {
            const refreshToken = await SecureStore.getItemAsync('refreshToken')
            if(!refreshToken){
                return null
            }
            const res = await fetch(`${API_URL}/api/v1/authentication/refresh`,{
                method:'POST',
                headers:{ 'Content-Type':'application/json' },
                body: JSON.stringify({ refreshToken })
            })
            if(!res.ok){
                return null
            }
            const tokens = await res.json()
            await SecureStore.setItemAsync('accessToken', tokens.accessToken)
            await SecureStore.setItemAsync('refreshToken', tokens.refreshToken)
            return tokens.accessToken as string
        })()
        const accessToken = await refreshing.current
        refreshing.current = null
        if(!accessToken){
            // the refresh token is gone or expired too, so the session is over
            await logout()
        }
        return accessToken
    }

    function postWithToken(path: string, body: any, token: string | null){
        return fetch(`${API_URL}${path}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body ?? {})
        })
    }

    // this used for every locked route instead of fetch
    async function authFetch(path: string, body?: any): Promise<Response> {
        const token = await SecureStore.getItemAsync('accessToken')
        const res = await postWithToken(path, body, token)
        if(res.status !== 401){
            return res
        }
        // the access token expired, so refresh once and try the request again
        const newToken = await refreshTokens()
        if(!newToken){
            return res
        }
        return await postWithToken(path, body, newToken)
    }

    // the socket authenticates on connect, so it needs a token known to be good
    async function getValidToken(): Promise<string | null> {
        const accessToken = await SecureStore.getItemAsync('accessToken')
        if(!accessToken){
            return null
        }
        const res = await fetch(`${API_URL}/api/v1/authentication/authenticate`,{
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ accessToken })
        })
        if(res.ok){
            return accessToken
        }
        return await refreshTokens()
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

    async function updateProfile(displayName: string, bio: string){
        const res = await authFetch('/api/v1/users/updateProfile', { displayName, bio })
        if(!res.ok){
            const body = await res.json()
            throw new Error(body?.error?.code || 'UPDATE_FAILED')
        }
        setUser(prev => prev ? { ...prev, displayName, bio } : prev)
    }

    async function logout(){
        await SecureStore.deleteItemAsync('accessToken')
        await SecureStore.deleteItemAsync('refreshToken')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, updateProfile, authFetch, getValidToken }}>
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
