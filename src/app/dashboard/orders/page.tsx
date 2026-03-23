'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Order = {
  id: string
  cases: number
  unit_price: number
  total: number
  status: string
  notes: string | null
  created_at: string
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'rgba(232, 197, 255, 0.1)',  color: '#e8c5ff', label: 'Pending' },
  confirmed: { bg: 'rgba(183, 148, 244, 0.12)', color: '#b794f4', label: 'Confirmed' },
  shipped:   { bg: 'rgba(124, 92, 191, 0.16)',  color: '#9b7fd4', label: 'Shipped' },
  delivered: { bg: 'rgba(122, 176, 147, 0.14)', color: '#9ed6b1', label: 'Delivered' },
  rejected:  { bg: 'rgba(239, 68, 68, 0.1)',    color: '#fca5a5', label: 'Rejected' },
}

function OrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const justPlaced = searchParams.get('success') === 'true'
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function handleDelete(orderId: string) {
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (!error) {
      setOrders(prev => prev.filter(o => o.id !== orderId))
    }
    setConfirmDeleteId(null)
    setDeleting(false)
  }

  return (
    <div>
      <div
        style={{
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className="dashboard-section-label">Partner Portal</div>
          <h1 className="dashboard-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}>
            ORDER HISTORY
          </h1>
          <p className="dashboard-copy">All your Arctic Rush wholesale orders in one place.</p>
        </div>
        <button onClick={() => router.push('/dashboard/orders/new')} className="primary-button">
          + New Order
        </button>
      </div>

      {justPlaced && (
        <div
          className="message message-success"
          style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{ color: '#b794f4', fontSize: '0.8rem', fontWeight: 800 }}>OK</div>
          <div>
            <div style={{ fontWeight: 700, color: '#f5efff', fontSize: '0.875rem' }}>
              Order placed successfully
            </div>
            <div className="faint-copy" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
              Our team will confirm within 24 hours. Estimated dispatch: 3-5 business days.
            </div>
          </div>
        </div>
      )}

      {/* Status legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_STYLES).map(([key, s]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
            <span className="stat-label" style={{ marginBottom: 0 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="surface-card" style={{ padding: '48px', textAlign: 'center' }}>
          <div className="subtle-copy">Loading orders...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="surface-card" style={{ padding: '64px 48px', textAlign: 'center' }}>
          <div className="subtle-copy" style={{ fontSize: '0.92rem', marginBottom: '16px' }}>
            No orders yet. Ready to stock your first cases of Arctic Rush?
          </div>
          <button onClick={() => router.push('/dashboard/orders/new')} className="primary-button">
            Place First Order -&gt;
          </button>
        </div>
      ) : (
        <div className="surface-card table-shell">
          <div className="table-header">
            {['Order ID', 'Cases', 'Unit Price', 'Total', 'Status', 'Date', ''].map((h, i) => (
              <div key={i} className="table-column-label">{h}</div>
            ))}
          </div>

          {orders.map(order => {
            const s = STATUS_STYLES[order.status] || STATUS_STYLES.pending
            const isPending = order.status === 'pending'
            const date = new Date(order.created_at).toLocaleDateString('en-US', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            const isConfirming = confirmDeleteId === order.id

            return (
              <div key={order.id} className="table-row">
                <div>
                  <div className="mono" style={{ fontSize: '0.76rem', color: '#b794f4', marginBottom: '2px' }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  {order.notes && (
                    <div className="faint-copy" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                      {order.notes}
                    </div>
                  )}
                </div>

                <div style={{ fontWeight: 700, color: '#f5efff', fontSize: '0.88rem' }}>{order.cases}</div>
                <div className="subtle-copy" style={{ fontSize: '0.88rem' }}>${order.unit_price?.toFixed(2)}</div>
                <div style={{ fontWeight: 700, color: '#f5efff', fontSize: '0.88rem' }}>${order.total?.toFixed(2)}</div>

                <div>
                  <span style={{ padding: '4px 12px', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </div>

                <div className="faint-copy" style={{ fontSize: '0.8rem' }}>{date}</div>

                {/* Delete column */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isPending && !isConfirming && (
                    <button
                      onClick={() => setConfirmDeleteId(order.id)}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: 'rgba(252,165,165,0.6)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.7)'
                        e.currentTarget.style.color = '#fca5a5'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
                        e.currentTarget.style.color = 'rgba(252,165,165,0.6)'
                      }}
                    >
                      Delete
                    </button>
                  )}

                  {isPending && isConfirming && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                        Sure?
                      </span>
                      <button
                        onClick={() => handleDelete(order.id)}
                        disabled={deleting}
                        style={{
                          background: 'rgba(239,68,68,0.15)',
                          border: '1px solid rgba(239,68,68,0.5)',
                          color: '#fca5a5',
                          fontSize: '0.65rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        {deleting ? '...' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        style={{
                          background: 'none',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: '0.65rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', padding: '16px 24px', borderTop: '1px solid rgba(124, 92, 191, 0.18)', background: 'rgba(124, 92, 191, 0.08)' }}>
            <div className="faint-copy" style={{ fontSize: '0.75rem' }}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} total
            </div>
            <div className="faint-copy" style={{ fontSize: '0.75rem' }}>
              Total cases ordered:{' '}
              <span style={{ color: '#b794f4', fontWeight: 700 }}>
                {orders.reduce((sum, o) => sum + o.cases, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="subtle-copy" style={{ padding: '48px' }}>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  )
}
