'use server'

import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            const status = error.status ?? -1
            const isNetworkError = status === 0
                || status >= 500
                || error.message?.toLowerCase().includes('fetch')
            redirect(isNetworkError
                ? '/login?error=auth_unavailable'
                : '/login?error=invalid_credentials'
            )
        }
    } catch (error) {
        // redirect() throws a special error — let it propagate
        if (isRedirectError(error)) throw error

        const code = getErrorCode(error)
        if (code === 'UND_ERR_CONNECT_TIMEOUT') {
            redirect('/login?error=auth_unavailable')
        }

        redirect('/login?error=auth_unavailable')
    }

    revalidatePath('/', 'layout')
    redirect('/overview')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

function getErrorCode(error: unknown): string | undefined {
    if (!error || typeof error !== 'object') return undefined

    const code = Reflect.get(error, 'code')
    if (typeof code === 'string') return code

    const cause = Reflect.get(error, 'cause')
    if (cause && typeof cause === 'object') {
        const causeCode = Reflect.get(cause, 'code')
        if (typeof causeCode === 'string') return causeCode
    }

    return undefined
}
