'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    const destination = data.user?.app_metadata?.is_admin === true ? '/admin' : '/dashboard'
    router.push(destination)
  }

  return (
    <main className="auth-shell">
      <div className="auth-card auth-card-sm">
        <div className="brand-mark" style={{ marginBottom: '10px' }}>
          DOPE
        </div>
        <div className="eyebrow" style={{ marginBottom: '32px' }}>
          Partner Login
        </div>

        <p className="subtle-copy" style={{ fontSize: '0.92rem', marginBottom: '32px' }}>
          Access your wholesale account, review orders, and place new Arctic Rush restocks.
        </p>

        <form onSubmit={handleLogin}>
          <div className="field" style={{ marginBottom: '16px' }}>
            <label className="field-label">Business Email</label>
            <input
              className="field-input"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@yourbusiness.com"
            />
          </div>

          <div className="field" style={{ marginBottom: '24px' }}>
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          {error && <div className="message message-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
            style={{ width: '100%', marginBottom: '24px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: '0.78rem',
          }}
        >
          <a href="/signup" className="text-link">
            Not a partner yet? Request access -&gt;
          </a>
          <a href="#" className="faint-copy" style={{ textDecoration: 'none' }}>
            Forgot password?
          </a>
        </div>
      </div>
    </main>
  )
}
