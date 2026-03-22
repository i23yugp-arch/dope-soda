'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: object) => string
      reset: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
    }
  }
}

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string>('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    businessType: '',
  })

  // Load Turnstile script
  useEffect(() => {
  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
  script.async = true
  script.defer = true

  script.onload = () => {
    // Small delay to ensure the ref div is mounted
    setTimeout(() => {
      if (!turnstileRef.current) {
        console.log('Turnstile ref not found')
        return
      }
      console.log('Rendering Turnstile widget...')
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          theme: 'dark',
          callback: (token: string) => {
            console.log('Turnstile token received:', token ? 'YES' : 'NO')
            setTurnstileToken(token)
          },
          'expired-callback': () => {
            console.log('Turnstile expired')
            setTurnstileToken('')
          },
          'error-callback': () => {
            console.log('Turnstile error')
            setTurnstileToken('')
          },
        })
        console.log('Widget rendered, ID:', widgetIdRef.current)
        setTurnstileReady(true)
      } catch (err) {
        console.log('Turnstile render error:', err)
      }
    }, 300)
  }

  document.head.appendChild(script)
  return () => {
    if (document.head.contains(script)) {
      document.head.removeChild(script)
    }
  }
  }, [])



  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!turnstileToken) {
      setError('Please complete the security check.')
      return
    }

    setLoading(true)

    // Step 1 — verify CAPTCHA token
    const verifyRes = await fetch('/api/turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: turnstileToken })
    })

    if (!verifyRes.ok) {
      setError('Security check failed. Please try again.')
      window.turnstile.reset(widgetIdRef.current)
      setTurnstileToken('')
      setLoading(false)
      return
    }

    // Step 2 — create Supabase account
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          company: form.company,
          business_type: form.businessType,
        }
      }
    })

    if (error) {
      setError(error.message)
      window.turnstile.reset(widgetIdRef.current)
      setTurnstileToken('')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f5f0e8',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '8px'
  }

  const fieldStyle = { marginBottom: '20px' }

  // ── Success screen ──
  if (success) {
    return (
      <main style={{
        minHeight: '100vh', background: '#08060f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: '100%', maxWidth: '420px', padding: '48px',
          border: '1px solid rgba(124,92,191,0.3)',
          background: '#111827', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#b794f4' }}>✓</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#b794f4', marginBottom: '12px' }}>
            Application Received
          </div>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '32px' }}>
            Check your email to verify your address. Our team will review your
            application and reach out within 48 hours.
          </div>
          <a href="/login" style={{
            display: 'block', padding: '14px',
            background: '#7c5cbf', color: '#f0ebff',
            fontWeight: 800, fontSize: '0.8rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            textDecoration: 'none'
          }}>
            Go to Login →
          </a>
        </div>
      </main>
    )
  }

  // ── Signup form ──
  return (
    <main style={{
      minHeight: '100vh', background: '#08060f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', padding: '40px 20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '480px', padding: '48px',
        border: '1px solid rgba(124,92,191,0.15)',
        background: '#111827'
      }}>

        {/* Logo */}
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#b794f4', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'sans-serif' }}>
          DOPE
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Create Your Partner Account
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginBottom: '40px' }}>
          Join the DOPE wholesale network
        </div>

        <form onSubmit={handleSignup}>

          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input name="firstName" type="text" required placeholder="Alex" value={form.firstName} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input name="lastName" type="text" required placeholder="Johnson" value={form.lastName} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Email */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Business Email</label>
            <input name="email" type="email" required placeholder="alex@yourbusiness.com" value={form.email} onChange={handleChange} style={inputStyle} />
          </div>

          {/* Company */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Company / Business Name</label>
            <input name="company" type="text" required placeholder="Your Business Ltd." value={form.company} onChange={handleChange} style={inputStyle} />
          </div>

          {/* Business Type */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Business Type</label>
            <select name="businessType" required value={form.businessType} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer', background: '#111827', color: '#f5f0e8', colorScheme: 'dark' } as React.CSSProperties}>
              <option value="">Select type</option>
              {['Gym / Fitness Studio','Specialty Retailer','Hotel / Hospitality','Corporate Wellness','Distributor','Other'].map(o => (
                <option key={o} value={o.toLowerCase()} style={{ background: '#111827', color: '#f5f0e8' }}>{o}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Create Password</label>
            <input name="password" type="password" required placeholder="Min. 8 characters" value={form.password} onChange={handleChange} style={inputStyle} />
          </div>

          {/* Confirm Password */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input name="confirmPassword" type="password" required placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} style={inputStyle} />
          </div>

          {/* Turnstile CAPTCHA */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>
              Security Check
            </div>
            <div ref={turnstileRef} />
            {!turnstileReady && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
                Loading security check...
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: '0.8rem'
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !turnstileToken}
            style={{
              width: '100%', padding: '14px',
              background: loading || !turnstileToken ? 'rgba(124,92,191,0.4)' : '#7c5cbf',
              color: '#f0ebff', fontWeight: 800, fontSize: '0.8rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              border: 'none',
              cursor: loading || !turnstileToken ? 'not-allowed' : 'pointer',
              marginBottom: '24px',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

          {/* Link to login */}
          <div style={{ textAlign: 'center', fontSize: '0.75rem' }}>
            <a href="/login" style={{ color: '#b794f4', textDecoration: 'none' }}>
              Already a partner? Sign in
            </a>
          </div>

        </form>
      </div>
    </main>
  )
}


