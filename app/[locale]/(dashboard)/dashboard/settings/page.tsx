'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    phone: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: operator } = await supabase
        .from('operators')
        .select('*')
        .eq('id', user.id)
        .single()

      if (operator) {
        setFormData({
          business_name: operator.business_name || '',
          email: operator.email || user.email || '',
          phone: operator.phone || '',
        })
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in' })
      setIsSaving(false)
      return
    }

    // Update operator profile
    const { error } = await supabase
      .from('operators')
      .update({
        business_name: formData.business_name,
        phone: formData.phone || null,
      })
      .eq('id', user.id)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully' })
      router.refresh()
    }

    setIsSaving(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPasswordMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      setIsChangingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      setIsChangingPassword(false)
      return
    }

    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    })

    if (error) {
      setPasswordMessage({ type: 'error', text: error.message })
    } else {
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }

    setIsChangingPassword(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-lg font-semibold">Profile Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <Input
              label="Business Name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              hint="Contact support to change your email address"
            />

            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Password Settings */}
      <Card>
        <form onSubmit={handlePasswordSubmit}>
          <CardHeader>
            <h2 className="text-lg font-semibold">Change Password</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {passwordMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="At least 8 characters"
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm your new password"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="primary" isLoading={isChangingPassword}>
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="danger">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
