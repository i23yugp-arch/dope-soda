'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserName(user?.user_metadata?.first_name || 'Partner')
    })
  }, [])

  const statCards = [
    { label: 'Total Orders', value: '0', sub: 'All time' },
    { label: 'Cases Ordered', value: '0', sub: 'All time' },
    { label: 'Partner Tier', value: 'Starter', sub: 'Current tier' },
    { label: 'Account Status', value: 'Pending', sub: 'Awaiting approval' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '48px' }}>
        <div className="dashboard-section-label">Partner Dashboard</div>
        <h1 className="dashboard-title">WELCOME BACK, {userName || 'PARTNER'}.</h1>
        <p className="dashboard-copy">Your Arctic Rush inventory pipeline is ready to move.</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: '48px' }}>
        {statCards.map(card => (
          <div key={card.label} className="surface-card stat-card">
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-sub">{card.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '48px' }}>
        <div className="stat-label" style={{ marginBottom: '20px' }}>
          Quick Actions
        </div>
        <div className="actions-row">
          <a href="/dashboard/orders/new" className="primary-button">
            Place New Order -&gt;
          </a>
          <a href="/dashboard/orders" className="secondary-button">
            View Orders
          </a>
        </div>
      </div>

      <div className="surface-card" style={{ padding: '48px', textAlign: 'center' }}>
        <div className="subtle-copy" style={{ fontSize: '0.92rem', marginBottom: '16px' }}>
          No orders yet. Ready to stock your first cases of Arctic Rush?
        </div>
        <a href="/dashboard/orders/new" className="text-link" style={{ letterSpacing: '0.1em' }}>
          Place your first order -&gt;
        </a>
      </div>
    </div>
  )
}
