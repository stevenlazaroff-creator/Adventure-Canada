import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DashboardNav } from './DashboardNav'

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Get operator profile
  const { data: operator } = await supabase
    .from('operators')
    .select('*, subscriptions(*)')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-wide">
          <div className="flex h-28 md:h-36 lg:h-44 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href={`/${locale}`}>
                <Image
                  src={locale === 'fr' ? '/images/logo-fr.jpg' : '/images/logo-en.png'}
                  alt="Adventure Canada"
                  width={500}
                  height={125}
                  className="h-24 md:h-32 lg:h-40 w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {operator?.business_name || user.email}
              </span>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container-wide py-8">
        <div className="flex gap-8">
          {/* Sidebar navigation */}
          <aside className="w-64 flex-shrink-0">
            <DashboardNav subscription={operator?.subscriptions?.[0]} />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
