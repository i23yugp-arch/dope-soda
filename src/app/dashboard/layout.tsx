'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Place Order', href: '/dashboard/orders/new' },
  { label: 'Order History', href: '/dashboard/orders' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUserName(user.user_metadata?.first_name || 'Partner')
    })
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="portal-shell">
      <aside className="dashboard-sidebar">
        <div style={{
        padding: '0 28px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
        <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#b794f4',
            letterSpacing: '0.1em',
            transition: 'color 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8c5ff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#b794f4')}
            >
            DOPE
            </div>
        </a>
        <div style={{
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: '4px'
        }}>
            Partner Portal
        </div>
        <a href="/" style={{
            display: 'inline-block',
            marginTop: '8px',
            fontSize: '0.65rem',
            color: 'rgba(183,148,244,0.5)',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'color 0.2s'
        }}
            onMouseEnter={e => (e.currentTarget.style.color = '#b794f4')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(183,148,244,0.5)')}
        >
            ← Back to Website
        </a>
        </div>

        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(124, 92, 191, 0.16)',
            fontSize: '0.84rem',
            color: 'rgba(232, 224, 245, 0.48)',
          }}
        >
          Welcome back,{' '}
          <span style={{ color: '#b794f4', fontWeight: 700 }}>
            {userName}
          </span>
        </div>

        <nav style={{ flex: 1, padding: '18px 0' }}>
          {navItems.map(item => {
            const active = pathname === item.href

            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '14px 28px',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: active ? '#f5efff' : 'rgba(232, 224, 245, 0.52)',
                  borderLeft: active ? '2px solid #b794f4' : '2px solid transparent',
                  background: active ? 'rgba(124, 92, 191, 0.12)' : 'transparent',
                }}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(124, 92, 191, 0.16)' }}>
          <button onClick={handleSignOut} className="secondary-button" style={{ width: '100%' }}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  )
}
