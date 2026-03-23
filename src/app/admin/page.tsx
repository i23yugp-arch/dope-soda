'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Order = {
  id: string
  partner_id: string
  cases: number
  unit_price: number
  total: number
  status: string
  notes: string | null
  created_at: string
  // joined from profiles/auth if available
  partner_email?: string
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'rgba(232, 197, 255, 0.1)',  color: '#e8c5ff', label: 'Pending' },
  confirmed: { bg: 'rgba(183, 148, 244, 0.12)', color: '#b794f4', label: 'Confirmed' },
  shipped:   { bg: 'rgba(124, 92, 191, 0.16)',  color: '#9b7fd4', label: 'Shipped' },
  delivered: { bg: 'rgba(122, 176, 147, 0.14)', color: '#9ed6b1', label: 'Delivered' },
  rejected:  { bg: 'rgba(239, 68, 68, 0.1)',    color: '#fca5a5', label: 'Rejected' },
}

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'rejected'

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('pending')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setOrders(data || [])
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: 'confirmed' | 'rejected') {
    setUpdating(orderId)
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    }
    setUpdating(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.6)', marginBottom: '8px' }}>
          Manufacturer Admin
        </div>
        <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(2.4rem, 5vw, 4rem)', letterSpacing: '0.04em', color: '#f5efff', margin: 0, lineHeight: 1 }}>
          ORDER MANAGEMENT
        </h1>
        <p style={{ color: 'rgba(232,224,245,0.5)', fontSize: '0.875rem', marginTop: '10px' }}>
          Review and action wholesale orders from all partners.
        </p>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {([['all', 'All Orders'], ['pending', 'Pending'], ['confirmed', 'Confirmed'], ['rejected', 'Rejected']] as [FilterStatus, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              background: filter === key ? 'rgba(124,92,191,0.2)' : 'rgba(255,255,255,0.03)',
              border: filter === key ? '1px solid rgba(183,148,244,0.4)' : '1px solid rgba(255,255,255,0.06)',
              padding: '16px 20px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: filter === key ? '#b794f4' : '#f5efff', lineHeight: 1, marginBottom: '4px' }}>
              {counts[key]}
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(Object.keys(STATUS_STYLES) as FilterStatus[]).concat().map(key => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              background: filter === key ? 'rgba(124,92,191,0.15)' : 'none',
              border: filter === key ? '1px solid rgba(183,148,244,0.3)' : '1px solid transparent',
              color: filter === key ? '#b794f4' : 'rgba(255,255,255,0.3)',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {STATUS_STYLES[key].label}
            {counts[key as FilterStatus] > 0 && (
              <span style={{ marginLeft: '6px', opacity: 0.6 }}>({counts[key as FilterStatus]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
          Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '64px', textAlign: 'center', border: '1px solid rgba(124,92,191,0.12)', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
          No {filter === 'all' ? '' : filter} orders.
        </div>
      ) : (
        <div style={{ border: '1px solid rgba(124,92,191,0.15)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.8fr 0.8fr 0.8fr 1fr 0.9fr 1.2fr',
            padding: '10px 20px',
            background: 'rgba(124,92,191,0.08)',
            borderBottom: '1px solid rgba(124,92,191,0.15)',
            gap: '12px',
          }}>
            {['Order ID', 'Cases', 'Unit Price', 'Total', 'Status', 'Date', 'Actions'].map(h => (
              <div key={h} style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                {h}
              </div>
            ))}
          </div>

          {filtered.map((order, idx) => {
            const s = STATUS_STYLES[order.status] || STATUS_STYLES.pending
            const isPending = order.status === 'pending'
            const isUpdating = updating === order.id
            const date = new Date(order.created_at).toLocaleDateString('en-US', {
              day: 'numeric', month: 'short', year: 'numeric',
            })

            return (
              <div
                key={order.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 0.8fr 0.8fr 0.8fr 1fr 0.9fr 1.2fr',
                  padding: '16px 20px',
                  borderBottom: idx < filtered.length - 1 ? '1px solid rgba(124,92,191,0.08)' : 'none',
                  gap: '12px',
                  alignItems: 'center',
                  background: isUpdating ? 'rgba(124,92,191,0.05)' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#b794f4', fontFamily: 'monospace', marginBottom: '3px' }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
                    {order.partner_id.slice(0, 8)}...
                  </div>
                  {order.notes && (
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {order.notes}
                    </div>
                  )}
                </div>

                <div style={{ fontWeight: 700, color: '#f5efff', fontSize: '0.88rem' }}>{order.cases}</div>
                <div style={{ color: 'rgba(232,224,245,0.5)', fontSize: '0.88rem' }}>${order.unit_price?.toFixed(2)}</div>
                <div style={{ fontWeight: 700, color: '#f5efff', fontSize: '0.88rem' }}>${order.total?.toFixed(2)}</div>

                <div>
                  <span style={{ padding: '4px 10px', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </div>

                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>{date}</div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {isPending ? (
                    <>
                      <button
                        onClick={() => updateStatus(order.id, 'confirmed')}
                        disabled={isUpdating}
                        style={{
                          background: isUpdating ? 'rgba(183,148,244,0.1)' : 'rgba(183,148,244,0.15)',
                          border: '1px solid rgba(183,148,244,0.4)',
                          color: '#b794f4',
                          fontSize: '0.62rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          padding: '5px 10px',
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s',
                          opacity: isUpdating ? 0.5 : 1,
                        }}
                        onMouseEnter={e => !isUpdating && (e.currentTarget.style.background = 'rgba(183,148,244,0.25)')}
                        onMouseLeave={e => !isUpdating && (e.currentTarget.style.background = 'rgba(183,148,244,0.15)')}
                      >
                        {isUpdating ? '...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, 'rejected')}
                        disabled={isUpdating}
                        style={{
                          background: 'none',
                          border: '1px solid rgba(239,68,68,0.3)',
                          color: 'rgba(252,165,165,0.7)',
                          fontSize: '0.62rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          padding: '5px 10px',
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s',
                          opacity: isUpdating ? 0.5 : 1,
                        }}
                        onMouseEnter={e => !isUpdating && (e.currentTarget.style.color = '#fca5a5')}
                        onMouseLeave={e => !isUpdating && (e.currentTarget.style.color = 'rgba(252,165,165,0.7)')}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
                      —
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid rgba(124,92,191,0.15)', background: 'rgba(124,92,191,0.05)', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
              Showing {filtered.length} of {orders.length} orders
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
              Total cases (filtered):{' '}
              <span style={{ color: '#b794f4', fontWeight: 700 }}>
                {filtered.reduce((sum, o) => sum + o.cases, 0)}
              </span>
              {' · '}Total value:{' '}
              <span style={{ color: '#b794f4', fontWeight: 700 }}>
                ${filtered.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
