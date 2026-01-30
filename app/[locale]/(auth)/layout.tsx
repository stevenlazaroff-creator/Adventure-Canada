import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-beige-100 flex flex-col">
      {/* Simple header with just logo */}
      <header className="py-6">
        <div className="container-wide">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo.png"
              alt="Adventure Canada"
              width={180}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Simple footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Adventure Canada. All rights reserved.</p>
      </footer>
    </div>
  )
}
