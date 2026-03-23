'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || user.app_metadata?.is_admin !== true) {
        router.replace('/login')
        return
      }
      setChecking(false)
    })
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#08060f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Verifying access...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08060f', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: '60px',
        borderBottom: '1px solid rgba(124,92,191,0.2)',
        background: 'rgba(17,24,39,0.8)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b794f4', letterSpacing: '0.1em' }}>DOPE</span>
          <span style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(239,68,68,0.7)',
            border: '1px solid rgba(239,68,68,0.3)',
            padding: '2px 8px',
          }}>
            Admin
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="/" style={{ fontSize: '0.72rem', color: 'rgba(183,148,244,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
            ← Website
          </a>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '48px 40px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  )
}
