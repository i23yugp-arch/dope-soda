'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewOrderPage() {
  const router = useRouter()
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [cases, setCases] = useState(50)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getPrice = (c: number) => {
    if (c >= 500) return 18.0
    if (c >= 150) return 20.5
    return 23.0
  }

  const unitPrice = getPrice(cases)
  const total = (cases * unitPrice).toFixed(2)
  const tier =
    cases >= 500
      ? { label: 'Enterprise', color: '#e8c5ff' }
      : cases >= 150
        ? { label: 'Growth', color: '#b794f4' }
        : { label: 'Starter', color: 'rgba(232, 224, 245, 0.72)' }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setPartnerId(user.id)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!partnerId) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.from('orders').insert({
      partner_id: partnerId,
      cases,
      unit_price: unitPrice,
      notes: notes || null,
      status: 'pending',
    })

    if (error) {
      setError('Failed to place order. Please try again.')
      setLoading(false)
      return
    }

    router.push('/dashboard/orders?success=true')
  }

  return (
    <div style={{ maxWidth: '760px' }}>
      <div style={{ marginBottom: '40px' }}>
        <div className="dashboard-section-label">Partner Portal</div>
        <h1 className="dashboard-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}>
          PLACE NEW ORDER
        </h1>
        <p className="dashboard-copy">Arctic Rush - Flavor 001. 25g protein, 0g sugar.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '32px' }}>
          <label className="field-label">Number of Cases</label>
          <div className="surface-card" style={{ padding: '24px', marginBottom: '14px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div className="stat-value" style={{ fontSize: '3.6rem', marginBottom: '6px' }}>
                  {cases}
                </div>
                <div
                  className="faint-copy"
                  style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  cases x ${unitPrice.toFixed(2)} each
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="stat-label" style={{ marginBottom: '4px' }}>
                  Total
                </div>
                <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '2.2rem', letterSpacing: '0.04em' }}>
                  ${total}
                </div>
              </div>
            </div>

            <input
              type="range"
              min={50}
              max={1000}
              step={10}
              value={cases}
              onChange={e => setCases(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#b794f4', cursor: 'pointer' }}
            />
            <div
              className="faint-copy"
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginTop: '8px' }}
            >
              <span>50 cases</span>
              <span>1,000 cases</span>
            </div>
          </div>

          <div
            className="badge"
            style={{
              borderColor: tier.color,
              background: `${tier.color}15`,
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tier.color }} />
            <span
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: tier.color,
                fontWeight: 700,
              }}
            >
              {tier.label} Tier
            </span>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Or Enter Exact Number of Cases</label>
          <input
            className="field-input"
            type="number"
            min={50}
            max={10000}
            value={cases}
            onChange={e => setCases(Math.max(50, Number(e.target.value)))}
          />
        </div>

        <div className="field" style={{ marginBottom: '32px' }}>
          <label className="field-label">Order Notes (optional)</label>
          <textarea
            className="field-textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Delivery instructions, special requests..."
            rows={3}
          />
        </div>

        <div className="surface-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <div className="dashboard-section-label" style={{ marginBottom: '16px' }}>
            Order Summary
          </div>
          {[
            ['Product', 'Arctic Rush - Flavor 001'],
            ['Cases', `${cases} cases (${cases * 24} cans)`],
            ['Unit Price', `$${unitPrice.toFixed(2)} per case`],
            ['Total', `$${total}`],
            ['Payment', 'Net 30'],
            ['Est. Dispatch', '3-5 business days'],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '10px',
                fontSize: '0.875rem',
                flexWrap: 'wrap',
              }}
            >
              <span className="subtle-copy">{k}</span>
              <span style={{ color: '#f5efff', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {error && <div className="message message-error">{error}</div>}

        <div className="actions-row">
          <button type="submit" disabled={loading} className="primary-button" style={{ flex: 1 }}>
            {loading ? 'Placing Order...' : 'Confirm Order -&gt;'}
          </button>
          <button type="button" onClick={() => router.push('/dashboard/orders')} className="secondary-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
