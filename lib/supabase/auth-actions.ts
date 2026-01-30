'use server'

import { createClient } from './server'
import { createAdminClient } from './admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type AuthResult = {
  error?: string
  success?: boolean
  message?: string
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const businessName = formData.get('businessName') as string
  const phone = formData.get('phone') as string | null

  // Validation
  if (!email || !password || !businessName) {
    return { error: 'Email, password, and business name are required' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        business_name: businessName,
        phone: phone || null,
      },
    },
  })

  if (error) {
    console.error('Signup error:', error)
    return { error: error.message }
  }

  if (data.user) {
    // Create operator profile using admin client
    const adminClient = createAdminClient()

    const { error: profileError } = await adminClient
      .from('operators')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        business_name: businessName,
        phone: phone || null,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail signup if profile creation fails - Edge Function will retry
    }

    // Create free subscription
    const { error: subError } = await adminClient
      .from('subscriptions')
      .insert({
        operator_id: data.user.id,
        tier: 'free',
      })

    if (subError) {
      console.error('Subscription creation error:', subError)
    }
  }

  return {
    success: true,
    message: 'Check your email to confirm your account'
  }
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return { error: 'Invalid email or password' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    return { error: error.message }
  }

  return {
    success: true,
    message: 'Check your email for a password reset link'
  }
}

export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password) {
    return { error: 'Password is required' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error('Password update error:', error)
    return { error: error.message }
  }

  return {
    success: true,
    message: 'Password updated successfully'
  }
}
