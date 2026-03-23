'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    const cursor = document.getElementById('dope-cursor')
    const ring   = document.getElementById('dope-ring')
    if (!cursor || !ring) return
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      cursor.style.left = mx + 'px'
      cursor.style.top  = my + 'px'
    }
    document.addEventListener('mousemove', onMove)
    let raf: number
    const animate = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      raf = requestAnimationFrame(animate)
    }
    animate()
    const grow   = () => { cursor.style.width = '20px'; cursor.style.height = '20px'; ring.style.width = '60px'; ring.style.height = '60px' }
    const shrink = () => { cursor.style.width = '12px'; cursor.style.height = '12px'; ring.style.width = '36px'; ring.style.height = '36px' }
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            (entry.target as HTMLElement).style.opacity = '1'
            ;(entry.target as HTMLElement).style.transform = 'translateY(0)'
          }, i * 100)
        }
      })
    }, { threshold: 0.15 })
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { background:#08060f; color:#e8e0f5; font-family:'Syne',sans-serif; overflow-x:hidden; cursor:none; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#08060f; }
        ::-webkit-scrollbar-thumb { background:#7c5cbf; }

        #dope-cursor { width:12px; height:12px; background:#b794f4; border-radius:50%; position:fixed; top:0; left:0; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:width .2s,height .2s; mix-blend-mode:difference; }
        #dope-ring   { width:36px; height:36px; border:1.5px solid #b794f4; border-radius:50%; position:fixed; top:0; left:0; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); opacity:.5; transition:width .3s,height .3s; }

        .dope-nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:24px 60px; background:linear-gradient(to bottom,rgba(8,6,15,.97),transparent); backdrop-filter:blur(4px); }
        .nav-logo { font-family:'Bebas Neue',sans-serif; font-size:2rem; letter-spacing:.15em; color:#b794f4; text-decoration:none; cursor:pointer; background:none; border:none; }
        .nav-links { display:flex; gap:40px; list-style:none; }
        .nav-links button { color:rgba(232,224,245,.5); background:none; border:none; font-size:.8rem; font-weight:600; font-family:'Syne',sans-serif; letter-spacing:.15em; text-transform:uppercase; cursor:pointer; transition:color .2s; }
        .nav-links button:hover { color:#b794f4; }
        .nav-cta { background:#7c5cbf; color:#f0ebff; padding:10px 24px; font-family:'Syne',sans-serif; font-weight:700; font-size:.75rem; letter-spacing:.15em; text-transform:uppercase; text-decoration:none; display:inline-block; transition:background .2s,transform .2s; }
        .nav-cta:hover { background:#9b7fd4; transform:translateY(-1px); }

        .hero { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; align-items:center; position:relative; overflow:hidden; padding:0 60px; }
        .hero-bg { position:absolute; inset:0; background: radial-gradient(ellipse 60% 80% at 70% 50%,rgba(124,92,191,.12) 0%,transparent 60%), radial-gradient(ellipse 40% 60% at 20% 80%,rgba(183,148,244,.07) 0%,transparent 50%), #08060f; }
        .hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(124,92,191,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,191,.04) 1px,transparent 1px); background-size:80px 80px; }
        .hero-left { position:relative; z-index:2; padding-top:80px; }

        .hero-tag { display:inline-flex; align-items:center; gap:10px; background:rgba(124,92,191,.1); border:1px solid rgba(124,92,191,.25); padding:8px 16px; font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; color:#b794f4; margin-bottom:40px; }
        .hero-tag::before { content:''; width:6px; height:6px; background:#b794f4; border-radius:50%; animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

        .hero-h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(5rem,9vw,9rem); line-height:.92; letter-spacing:.02em; margin-bottom:8px; }
        .line-purple { color:#b794f4; }
        .line-light  { color:#e8c5ff; }

        .hero-sub { font-size:1.05rem; color:rgba(232,224,245,.55); line-height:1.7; max-width:420px; margin:32px 0 48px; font-weight:400; }
        .hero-actions { display:flex; align-items:center; gap:24px; }

        .btn-primary { background:#7c5cbf; color:#f0ebff; padding:16px 36px; font-family:'Syne',sans-serif; font-weight:800; font-size:.8rem; letter-spacing:.15em; text-transform:uppercase; border:none; cursor:pointer; position:relative; overflow:hidden; transition:all .2s; display:inline-block; text-decoration:none; }
        .btn-primary::after { content:''; position:absolute; inset:0; background:#9b7fd4; transform:translateX(-101%); transition:transform .3s; }
        .btn-primary:hover::after { transform:translateX(0); }
        .btn-primary span { position:relative; z-index:1; }

        .btn-ghost { color:#e8e0f5; font-size:.8rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; border:none; border-bottom:1px solid rgba(232,224,245,.3); background:none; cursor:pointer; padding-bottom:2px; transition:color .2s,border-color .2s; }
        .btn-ghost:hover { color:#b794f4; border-color:#b794f4; }

        .hero-stats { display:flex; gap:48px; margin-top:64px; padding-top:40px; border-top:1px solid rgba(124,92,191,.2); }
        .stat-num   { font-family:'Bebas Neue',sans-serif; font-size:2.5rem; color:#b794f4; line-height:1; }
        .stat-label { font-size:.7rem; color:rgba(232,224,245,.4); letter-spacing:.12em; text-transform:uppercase; margin-top:4px; }

        .hero-right { position:relative; z-index:2; display:flex; align-items:center; justify-content:center; min-height:100vh; }
        .can-wrapper { position:relative; animation:float 6s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-28px) rotate(-2deg)} }
        .can-glow { position:absolute; width:360px; height:360px; background:radial-gradient(circle,rgba(124,92,191,.3) 0%,transparent 70%); top:50%; left:50%; transform:translate(-50%,-50%); filter:blur(40px); animation:glowPulse 4s ease-in-out infinite; }
        @keyframes glowPulse { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.12)} }
        .can-photo { width:820px; height:auto; position:relative; z-index:2; filter:drop-shadow(0 40px 80px rgba(124,92,191,.5)); }
        .can-badge { position:absolute; top:8%; right:20%; background:#e8c5ff; color:#2d1a5e; width:90px; height:90px; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; animation:spin 15s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .badge-num  { font-size:2rem; line-height:1; }
        .badge-text { font-size:.55rem; letter-spacing:.1em; }
        .flavor-chip { position:absolute; bottom:22%; left:10%; background:rgba(124,92,191,.15); border:1px solid rgba(124,92,191,.3); backdrop-filter:blur(10px); padding:14px 20px; min-width:160px; }
        .chip-label { font-size:.6rem; letter-spacing:.15em; text-transform:uppercase; color:#b794f4; margin-bottom:4px; }
        .chip-value { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:.05em; color:#e8e0f5; }

        .marquee-section { padding:20px 0; background:#7c5cbf; overflow:hidden; }
        .marquee-track   { display:flex; gap:60px; animation:marquee 20s linear infinite; white-space:nowrap; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-item { font-family:'Bebas Neue',sans-serif; font-size:1rem; color:#f0ebff; letter-spacing:.2em; display:flex; align-items:center; gap:60px; flex-shrink:0; }
        .marquee-dot  { width:6px; height:6px; background:#e8c5ff; border-radius:50%; opacity:.6; }

        .dope-section { padding:120px 60px; }
        .section-label { font-size:.65rem; letter-spacing:.25em; text-transform:uppercase; color:#b794f4; margin-bottom:20px; display:flex; align-items:center; gap:12px; }
        .section-label::before { content:''; width:30px; height:1px; background:#b794f4; }
        .section-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(3rem,5vw,5.5rem); line-height:1; letter-spacing:.02em; }
        .fade-up { opacity:0; transform:translateY(40px); transition:opacity .7s ease,transform .7s ease; }

        .why-section { background:#0e0a1f; position:relative; overflow:hidden; }
        .why-section::before { content:''; position:absolute; top:-200px; right:-200px; width:600px; height:600px; background:radial-gradient(circle,rgba(124,92,191,.08) 0%,transparent 70%); }
        .why-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; margin-top:60px; }
        .matrix-title { font-size:.7rem; letter-spacing:.15em; text-transform:uppercase; color:rgba(232,224,245,.4); margin-bottom:24px; }
        .matrix-table { width:100%; border-collapse:collapse; }
        .matrix-table th { padding:12px 16px; font-size:.65rem; letter-spacing:.12em; text-transform:uppercase; color:rgba(232,224,245,.4); text-align:left; border-bottom:1px solid rgba(124,92,191,.15); }
        .matrix-table td { padding:14px 16px; font-size:.85rem; border-bottom:1px solid rgba(124,92,191,.1); vertical-align:middle; color:rgba(232,224,245,.7); }
        .matrix-table tr.dope-row td { background:rgba(124,92,191,.1); color:#b794f4; font-weight:700; }
        .matrix-table tr.dope-row td:first-child { font-family:'Bebas Neue',sans-serif; font-size:1.1rem; letter-spacing:.05em; }
        .check { color:#b794f4; }
        .cross { color:rgba(232,224,245,.2); }
        .why-points { display:flex; flex-direction:column; gap:32px; }
        .why-point { display:flex; gap:20px; padding:28px; background:rgba(124,92,191,.06); border:1px solid rgba(124,92,191,.15); transition:border-color .3s,transform .3s; cursor:default; }
        .why-point:hover { border-color:rgba(183,148,244,.4); transform:translateX(6px); }
        .point-num   { font-family:'Bebas Neue',sans-serif; font-size:3rem; color:rgba(124,92,191,.2); line-height:1; min-width:50px; }
        .point-title { font-weight:700; font-size:1rem; margin-bottom:6px; color:#e8e0f5; }
        .point-desc  { font-size:.85rem; color:rgba(232,224,245,.5); line-height:1.6; }

        .product-section { background:#08060f; position:relative; overflow:hidden; }
        .product-layout  { display:grid; grid-template-columns:1fr 1.2fr; gap:80px; align-items:center; margin-top:60px; }
        .product-visual  { position:relative; display:flex; align-items:center; justify-content:center; }
        .product-bg-circle { position:absolute; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(124,92,191,.12) 0%,transparent 70%); border:1px solid rgba(124,92,191,.12); }
        .product-can-photo { width:820px; height:auto; position:relative; z-index:2; filter:drop-shadow(0 30px 60px rgba(124,92,191,.4)); animation:float 6s ease-in-out infinite; }
        .product-info    { padding-left:20px; }
        .flavor-name     { font-family:'Bebas Neue',sans-serif; font-size:clamp(3.5rem,6vw,6rem); color:#b794f4; line-height:1; margin:12px 0 8px; }
        .flavor-subtitle { font-size:.85rem; color:rgba(232,224,245,.4); letter-spacing:.08em; text-transform:uppercase; margin-bottom:32px; }
        .flavor-desc     { font-size:1rem; color:rgba(232,224,245,.65); line-height:1.75; margin-bottom:40px; }
        .nutrition-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(124,92,191,.2); border:1px solid rgba(124,92,191,.2); margin-bottom:40px; }
        .nutrition-item  { background:#0e0a1f; padding:16px 12px; text-align:center; }
        .nutrition-val   { font-family:'Bebas Neue',sans-serif; font-size:1.8rem; color:#b794f4; line-height:1; }
        .nutrition-key   { font-size:.6rem; letter-spacing:.12em; text-transform:uppercase; color:rgba(232,224,245,.3); margin-top:4px; }
        .cert-row        { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:40px; }
        .cert-tag        { padding:6px 14px; border:1px solid rgba(124,92,191,.25); font-size:.65rem; letter-spacing:.15em; text-transform:uppercase; color:rgba(232,224,245,.5); }

        .wholesale-section { background:#0e0a1f; position:relative; overflow:hidden; }
        .tier-cards { display:flex; flex-direction:column; gap:20px; }
        .tier-card { padding:28px 32px; border:1px solid rgba(124,92,191,.2); background:rgba(124,92,191,.05); display:flex; align-items:center; gap:24px; transition:all .3s; cursor:pointer; position:relative; overflow:hidden; }
        .tier-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:#b794f4; transform:scaleY(0); transition:transform .3s; transform-origin:bottom; }
        .tier-card:hover::before { transform:scaleY(1); }
        .tier-card:hover { border-color:rgba(183,148,244,.35); transform:translateX(4px); }
        .tier-card.featured { border-color:rgba(183,148,244,.4); background:rgba(124,92,191,.1); }
        .tier-card.featured::before { transform:scaleY(1); }
        .tier-label   { font-family:'Bebas Neue',sans-serif; font-size:.9rem; letter-spacing:.15em; color:rgba(232,224,245,.35); min-width:70px; }
        .tier-moq     { flex:1; font-weight:700; font-size:1.05rem; color:#e8e0f5; }
        .tier-moq span { display:block; font-size:.7rem; font-weight:400; color:rgba(232,224,245,.35); letter-spacing:.1em; text-transform:uppercase; margin-bottom:2px; }
        .tier-benefit { font-size:.8rem; color:#b794f4; font-weight:600; text-align:right; }

        .about-section { background:#08060f; position:relative; overflow:hidden; }
        .about-layout  { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; margin-top:60px; }
        .founder-img-frame { width:100%; aspect-ratio:1/1; position:relative; overflow:hidden; border:1px solid rgba(124,92,191,.2); }
        .founder-accent { position:absolute; bottom:0; right:0; background:#7c5cbf; padding:16px 20px; text-align:center; }
        .accent-label { font-size:.55rem; letter-spacing:.1em; text-transform:uppercase; color:#e8c5ff; font-weight:700; }
        .accent-name  { font-family:'Bebas Neue',sans-serif; font-size:1.2rem; color:#f0ebff; line-height:1.1; }
        .about-quote  { font-family:'Space Mono',monospace; font-style:italic; font-size:1.05rem; color:#b794f4; line-height:1.7; border-left:2px solid #7c5cbf; padding-left:24px; margin-bottom:32px; }
        .about-text   { font-size:.95rem; color:rgba(232,224,245,.6); line-height:1.8; margin-bottom:20px; }
        .milestones   { display:flex; flex-direction:column; margin-top:40px; }
        .milestone    { display:flex; gap:20px; padding:20px 0; border-bottom:1px solid rgba(124,92,191,.12); align-items:flex-start; }
        .milestone-year { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; color:rgba(124,92,191,.5); min-width:60px; line-height:1; }
        .milestone-text { font-size:.875rem; color:rgba(232,224,245,.6); line-height:1.5; }
        .milestone-text strong { color:#e8e0f5; }

        .team-section { background:#0e0a1f; padding-bottom:140px; }
        .team-photo-banner { width:100%; height:320px; position:relative; overflow:hidden; margin-top:60px; margin-bottom:48px; border:1px solid rgba(124,92,191,.15); }
        .team-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .team-card { background:rgba(124,92,191,.06); border:1px solid rgba(124,92,191,.15); padding:32px 28px; transition:all .3s; position:relative; overflow:hidden; }
        .team-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#7c5cbf,#e8c5ff); transform:scaleX(0); transition:transform .3s; transform-origin:left; }
        .team-card:hover::after { transform:scaleX(1); }
        .team-card:hover { border-color:rgba(183,148,244,.3); transform:translateY(-4px); }
        .team-avatar { width:70px; height:70px; border-radius:50%; background:#1a1033; display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:1.5rem; color:#b794f4; margin-bottom:20px; border:2px solid rgba(124,92,191,.3); }
        .team-name { font-weight:700; font-size:1.05rem; margin-bottom:4px; color:#e8e0f5; }
        .team-role { font-size:.7rem; color:#b794f4; letter-spacing:.12em; text-transform:uppercase; margin-bottom:16px; }
        .team-bio  { font-size:.82rem; color:rgba(232,224,245,.45); line-height:1.65; }

        .dope-footer   { background:#08060f; border-top:1px solid rgba(124,92,191,.15); padding:60px; }
        .footer-top    { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:60px; margin-bottom:60px; }
        .footer-brand  { font-family:'Bebas Neue',sans-serif; font-size:3rem; color:#b794f4; letter-spacing:.1em; margin-bottom:16px; }
        .footer-tagline { font-size:.85rem; color:rgba(232,224,245,.3); line-height:1.7; max-width:260px; }
        .footer-col-title { font-size:.65rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(232,224,245,.25); margin-bottom:20px; }
        .footer-links  { list-style:none; display:flex; flex-direction:column; gap:12px; }
        .footer-links a { font-size:.875rem; color:rgba(232,224,245,.4); text-decoration:none; transition:color .2s; }
        .footer-links a:hover { color:#b794f4; }
        .footer-bottom { border-top:1px solid rgba(124,92,191,.12); padding-top:32px; display:flex; align-items:center; justify-content:space-between; }
        .footer-copy   { font-size:.75rem; color:rgba(232,224,245,.2); letter-spacing:.05em; }
        .footer-legal  { display:flex; gap:24px; }
        .footer-legal a { font-size:.72rem; color:rgba(232,224,245,.2); text-decoration:none; transition:color .2s; }
        .footer-legal a:hover { color:#b794f4; }

        .testimonial-avatar { width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid rgba(124,92,191,.3); flex-shrink:0; }
        .testimonial-avatar-placeholder { width:48px; height:48px; border-radius:50%; background:rgba(124,92,191,.2); border:2px solid rgba(124,92,191,.3); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:1.1rem; color:#b794f4; }


        @media(max-width:900px){
          .dope-nav { padding:20px 24px; }
          .nav-links { display:none; }
          .hero { grid-template-columns:1fr; padding:0 24px; text-align:center; }
          .hero-right { display:none; }
          .hero-stats { justify-content:center; }
          .dope-section { padding:80px 24px; }
          .why-grid,.product-layout,.about-layout { grid-template-columns:1fr; gap:40px; }
          .team-grid { grid-template-columns:1fr; }
          .footer-top { grid-template-columns:1fr 1fr; }
          .dope-footer { padding:40px 24px; }
        }
      `}</style>

      <div id="dope-cursor" />
      <div id="dope-ring"   />

      {/* NAV */}
      <nav className="dope-nav">
        <button className="nav-logo" onClick={() => scrollTo('hero')}>DOPE</button>
        <ul className="nav-links">
          <li><button onClick={() => scrollTo('why')}>Why Dope</button></li>
          <li><button onClick={() => scrollTo('product')}>Product</button></li>
          <li><button onClick={() => scrollTo('wholesale')}>Wholesale</button></li>
          <li><button onClick={() => scrollTo('about')}>About</button></li>
          <li><button onClick={() => scrollTo('team')}>Team</button></li>
        </ul>
        <a href="/signup" className="nav-cta">Partner With Us</a>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-left">
          <div className="hero-tag">New Category — Zero Competition</div>
          <h1 className="hero-h1">
            <div>HAVE</div>
            <div className="line-purple">LIMITS?</div>
            <div>TRY</div>
            <div className="line-light">DOPE.</div>
          </h1>
          <p className="hero-sub">
            The world&apos;s first protein soda built for businesses that refuse to stock
            the same six brands. One flavor. Three years in the making. Zero shelf competition.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo('wholesale')}>
              <span>Request Wholesale Access</span>
            </button>
            <button className="btn-ghost" onClick={() => scrollTo('why')}>See the gap →</button>
          </div>
          <div className="hero-stats">
            <div><div className="stat-num">25G</div><div className="stat-label">Protein per can</div></div>
            <div><div className="stat-num">0G</div><div className="stat-label">Added sugar</div></div>
            <div><div className="stat-num">001</div><div className="stat-label">Flavor. Perfected.</div></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="can-wrapper">
            <div className="can-glow" />
            <img src="/images/can.png" alt="DOPE Arctic Rush protein soda" className="can-photo" />
            <div className="can-badge">
              <span className="badge-num">25</span>
              <span className="badge-text">G PROTEIN</span>
            </div>
            <div className="flavor-chip">
              <div className="chip-label">Fresh Flavor</div>
              <div className="chip-value">Arctic Rush™</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[1,2].map(n => (
            <div className="marquee-item" key={n}>
              25G PROTEIN PER CAN <span className="marquee-dot" />
              ZERO SUGAR <span className="marquee-dot" />
              ZERO COMPETITORS <span className="marquee-dot" />
              ONE FLAVOR. PERFECTED. <span className="marquee-dot" />
              B2B WHOLESALE ONLY <span className="marquee-dot" />
              HAVE LIMITS? TRY DOPE. <span className="marquee-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* WHY DOPE */}
      <section id="why" className="dope-section why-section">
        <div className="section-label">The Market Gap</div>
        <h2 className="section-title fade-up">THE SHELF SPACE<br />NOBODY IS FILLING.</h2>
        <div className="why-grid">
          <div className="fade-up">
            <div className="matrix-title">Competitive landscape — where does DOPE sit?</div>
            <table className="matrix-table">
              <thead>
                <tr><th>Brand</th><th>Great Taste</th><th>Real Protein</th><th>Clean Label</th></tr>
              </thead>
              <tbody>
                <tr><td>Energy Drinks</td><td className="check">✓</td><td className="cross">✗</td><td className="cross">✗</td></tr>
                <tr><td>Protein Shakes</td><td className="cross">✗</td><td className="check">✓</td><td className="cross">✗</td></tr>
                <tr><td>Sports Drinks</td><td className="check">✓</td><td className="cross">✗</td><td className="cross">✗</td></tr>
                <tr><td>RTD Protein</td><td className="cross">✗</td><td className="check">✓</td><td className="check">✓</td></tr>
                <tr className="dope-row"><td>DOPE</td><td className="check">✓</td><td className="check">✓</td><td className="check">✓</td></tr>
              </tbody>
            </table>
          </div>
          <div className="why-points fade-up">
            {[
              { n:'01', t:'A Category of One',                   d:"We didn't enter a crowded market. We identified the empty quadrant — great taste, real protein, clean label — and built the only brand living there." },
              { n:'02', t:'First-Mover Advantage for Your Shelf',d:"Your competitors don't carry this. That's the point. Stocking Dope means owning a category before anyone else on your block does." },
              { n:'03', t:'One SKU. Maximum Margin.',            d:"Simple inventory, easy restocking, predictable sell-through. One perfect product beats ten mediocre ones — for you and your customers." },
            ].map(p => (
              <div className="why-point" key={p.n}>
                <div className="point-num">{p.n}</div>
                <div>
                  <div className="point-title">{p.t}</div>
                  <div className="point-desc">{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT */}
      <section id="product" className="dope-section product-section">
        <div className="section-label">Our Product</div>
        <div className="product-layout">
          <div className="product-visual fade-up">
            <div className="product-bg-circle" />
            <img src="/images/can.png" alt="DOPE Arctic Rush" className="product-can-photo" />
          </div>
          <div className="product-info fade-up">
            <div className="section-label">Flavor 001</div>
            <div className="flavor-name">ARCTIC<br />RUSH™</div>
            <div className="flavor-subtitle">The only flavor you&apos;ll ever need to carry.</div>
            <p className="flavor-desc">
              Clean, crisp, and completely unlike anything on your shelf today. Arctic Rush
              delivers the refreshing punch of a premium soda with 25 grams of clean whey
              isolate protein — no chalky aftertaste, no compromise.
            </p>
            <div className="nutrition-grid">
              {[['50','Calories'],['25G','Protein'],['0G','Sugar'],['3G','Carbs']].map(([v,k]) => (
                <div className="nutrition-item" key={k}>
                  <div className="nutrition-val">{v}</div>
                  <div className="nutrition-key">{k}</div>
                </div>
              ))}
            </div>
            <div className="cert-row">
              {['Non-GMO','Gluten Free','Whey Isolate','FDA Compliant','Third-Party Tested'].map(c => (
                <div className="cert-tag" key={c}>{c}</div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => scrollTo('wholesale')}>
              <span>Request Wholesale Pricing →</span>
            </button>
          </div>
        </div>
      </section>

      {/* WHOLESALE */}
      <section id="wholesale" className="dope-section wholesale-section">
        <div className="section-label">Partner Access</div>
        <h2 className="section-title fade-up">JOIN THE FIRST<br />50 PARTNERS.</h2>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', marginTop:'60px', alignItems:'start' }}>

          {/* LEFT — tiers + CTA */}
          <div className="fade-up">
            <p style={{ color:'rgba(232,224,245,.5)', fontSize:'1.05rem', lineHeight:1.75, marginBottom:'40px' }}>
              We&apos;re not open to everyone. We&apos;re selectively partnering with gyms,
              specialty retailers, hotel chains, and corporate wellness programs who want
              to own a category before it explodes.
            </p>

            <div className="tier-cards" style={{ marginBottom:'40px' }}>
              {[
                { label:'STARTER',    moq:'50 Cases',   benefit:'Standard margin',              featured:false },
                { label:'GROWTH',     moq:'150 Cases',  benefit:'+12% margin',                  featured:true  },
                { label:'ENTERPRISE', moq:'500+ Cases', benefit:'Custom pricing + exclusivity', featured:false },
              ].map(t => (
                <div className={`tier-card${t.featured ? ' featured' : ''}`} key={t.label}>
                  <div className="tier-label">{t.label}</div>
                  <div className="tier-moq"><span>Min. Order</span>{t.moq}</div>
                  <div className="tier-benefit">{t.benefit}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:'24px', background:'rgba(124,92,191,.07)', border:'1px solid rgba(124,92,191,.2)', marginBottom:'48px' }}>
              <div style={{ fontSize:'.7rem', letterSpacing:'.15em', textTransform:'uppercase', color:'#b794f4', marginBottom:'8px' }}>
                Included with every partner
              </div>
              <div style={{ fontSize:'.85rem', color:'rgba(232,224,245,.5)', lineHeight:1.8 }}>
                ✓ &nbsp;POS display materials &amp; shelf kits<br />
                ✓ &nbsp;Co-branded digital assets<br />
                ✓ &nbsp;Dedicated account manager<br />
                ✓ &nbsp;Net 30 payment terms<br />
                ✓ &nbsp;Freight included on orders 150+ cases
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'24px' }}>
              <a href="/signup" className="btn-primary"><span>Become a Partner →</span></a>
              <a href="/login" style={{
                color:'rgba(232,224,245,.4)', fontSize:'.8rem', textDecoration:'none',
                letterSpacing:'.1em', textTransform:'uppercase',
                borderBottom:'1px solid rgba(232,224,245,.2)', paddingBottom:'2px'
              }}>
                Already a partner? Login
              </a>
            </div>
          </div>

          {/* RIGHT — testimonials */}
          <div className="fade-up">

            {/* Header */}
            <div style={{ marginBottom:'32px' }}>
              <div className="section-label" style={{ marginBottom:'8px' }}>What Partners Say</div>
              <div style={{ fontSize:'.85rem', color:'rgba(232,224,245,.35)' }}>
                From the first 50 who said yes before anyone else did.
              </div>
            </div>

            {/* Testimonial cards */}
            {[
              {
                quote: "We added DOPE to our gym fridge on a trial basis. It sold out in 11 days. We&apos;ve reordered three times since. Our members ask for it by name now.",
                name:  "Reyansh Sinha",
                role:  "Gym Owner, Levels Fitness — Nagpur",
                stat:  "3× reorders in 60 days",
                img:   "/images/partner1.jpg",
                initials: "P1"
              },
              {
                quote: "I&apos;ve stocked every major protein brand. DOPE is the first one customers actually come back specifically for. The margin is better too — it&apos;s a no-brainer.",
                name:  "Navjot Bhatia",
                role:  "Retailer, Health & Fitness — Mumbai",
                stat:  "↑ 22% avg basket size",
                img:   "/images/partner2.jpeg",
                initials: "P2"
              },
              {
                quote: "We put it in our corporate wellness fridges as an experiment. Within a week, employees were asking HR to make it a permanent fixture. Done.",
                name:  "Daksh Galgotia",
                role:  "Corporate Wellness Manager — Delhi",
                stat:  "100% retention rate",
                img:   "/images/partner3.jpeg",
                initials: "P3"
              },
            ].map((t, i) => (
              <div key={i} style={{
                padding:'28px',
                background:'rgba(124,92,191,.06)',
                border:'1px solid rgba(124,92,191,.15)',
                marginBottom:'20px',
                position:'relative',
                transition:'border-color .3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(183,148,244,.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(124,92,191,.15)')}
              >
                {/* Quote mark */}
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:'4rem', lineHeight:1,
                  color:'rgba(124,92,191,.2)',
                  position:'absolute', top:'16px', right:'20px'
                }}>
                  &ldquo;
                </div>

                {/* Quote text */}
                <p style={{
                  fontSize:'.875rem',
                  color:'rgba(232,224,245,.65)',
                  lineHeight:1.75,
                  marginBottom:'20px',
                  fontStyle:'italic',
                  paddingRight:'32px'
                }}
                  dangerouslySetInnerHTML={{ __html: t.quote }}
                />

                {/* Bottom row — avatar + name + stat */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>

                    {/* Avatar — shows image if available, falls back to initials */}
                    <div className="testimonial-avatar-placeholder">
                      <img src={t.img} alt={t.name} className="testimonial-avatar" />
                    </div>

                    <div>
                      <div style={{ fontWeight:700, fontSize:'.875rem', color:'#e8e0f5', marginBottom:'2px' }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize:'.72rem', color:'rgba(232,224,245,.35)', letterSpacing:'.05em' }}>
                        {t.role}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding:'6px 14px',
                    background:'rgba(124,92,191,.15)',
                    border:'1px solid rgba(124,92,191,.25)',
                    fontSize:'.65rem',
                    letterSpacing:'.12em',
                    textTransform:'uppercase',
                    color:'#b794f4',
                    fontWeight:700,
                    whiteSpace:'nowrap'
                  }}>
                    {t.stat}
                  </div>
                </div>
              </div>
            ))}


            {/* Trust bar */}
            <div style={{
              display:'flex', gap:'32px',
              padding:'20px 24px',
              background:'rgba(124,92,191,.04)',
              border:'1px solid rgba(124,92,191,.1)',
              marginTop:'8px'
            }}>
              {[
                { num:'50+', label:'Active Partners' },
                { num:'48h', label:'Onboarding Time' },
                { num:'98%', label:'Reorder Rate'    },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center', flex:1 }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', color:'#b794f4', lineHeight:1 }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(232,224,245,.3)', marginTop:'4px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="dope-section about-section">
        <div className="section-label">Our Story</div>
        <div className="about-layout">
          <div className="fade-up" style={{ position:'relative' }}>
            <div className="founder-img-frame">
              <img
                src="/images/founder.jpeg"
                alt="Yug Patil — Founder, DOPE Protein Soda"
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
              />
              <div className="founder-accent">
                <span className="accent-label">Founder &amp;</span>
                <span className="accent-name">CEO</span>
                <span className="accent-name">DOPE</span>
              </div>
            </div>
          </div>
          <div className="fade-up">
            <h2 className="section-title" style={{ marginBottom:'32px' }}>BUILT FROM<br />FRUSTRATION.</h2>
            <blockquote className="about-quote">
              &ldquo;If Yug can beat Bolt, imagine what DOPE can do for your shelf.
              We didn&apos;t come here to compete. We came to make the competition irrelevant.&rdquo;
            </blockquote>
            <p className="about-text">
              The legend says Yug Patil — founder of DOPE — once beat Usain Bolt in a 100m race.
              The secret? Not genetics. Not years of training. A cold can of Arctic Rush and the
              kind of focus that comes from 25 grams of clean protein, zero sugar, and
              absolutely zero compromise.
            </p>
            <p className="about-text">
              Jokes aside, the frustration was real. Every gym fridge looked identical.
              Every protein drink tasted like chalk. Three years, 40+ formulas, and one
              obsessively perfected flavor later — DOPE was born to fill the shelf space
              nobody else was standing on.
            </p>
            <div className="milestones">
              {[
                { year:'2022', text:<><strong>The Idea.</strong> Yug sketches the first formula on a napkin after yet another undrinkable post-workout shake.</> },
                { year:'2023', text:<><strong>R&amp;D Phase.</strong> 40+ iterations tested. 200+ gym-goers surveyed. Arctic Rush formula locked.</> },
                { year:'2024', text:<><strong>Manufacturing.</strong> FDA-compliant facility locked in. Third-party certifications complete.</> },
                { year:'2025', text:<><strong>Wholesale Launch.</strong> First 50 partner slots open. The shelf is empty. Not for long.</> },
              ].map(m => (
                <div className="milestone" key={m.year}>
                  <div className="milestone-year">{m.year}</div>
                  <div className="milestone-text">{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="dope-section team-section">
        <div className="section-label">The People</div>
        <h2 className="section-title fade-up">SMALL TEAM.<br />MASSIVE VISION.</h2>
        <div className="team-photo-banner fade-up">
          <img
            src="/images/team.jpg"
            alt="DOPE team"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 20%' }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(14,10,31,.8) 0%,transparent 60%)' }} />
        </div>
        <div className="team-grid">
          {[
            { initials:'YP', name:'Yug Patil',        img: "/images/yug.jpg", role:'Founder & CEO',        bio:"Beat Bolt. Built DOPE. Yug spent years in the fitness industry watching the same six brands fill every fridge. He decided the empty quadrant needed an owner — so he became one." },
            { initials:'AB', name:'Anshul Bhalsakle', img: "/images/anshul.jpeg", role:'Head of Formulation',   bio:"The scientist behind Arctic Rush. Anshul spent three years and 40+ formula iterations building a protein soda that actually tastes like a soda. No chalk. No compromise." },
            { initials:'YA', name:'Yash Anup',        img: "/images/yash.jpeg", role:'VP of Sales & Finance', bio:"The dealmaker. Yash brings the network and the numbers — building wholesale partnerships and making sure DOPE's margins are as clean as its label." },
          ].map(m => (
            <div className="team-card fade-up" key={m.initials}>
              <div style={{ width:'70px', height:'70px', borderRadius:'50%', overflow:'hidden', marginBottom:'20px', border:'2px solid rgba(124,92,191,.3)', flexShrink:0 }}>
                <img
                  src={m.img}
                  alt={m.name}
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = 'none'
                    if (target.parentElement) {
                      target.parentElement.style.background = '#1a1033'
                      target.parentElement.style.display = 'flex'
                      target.parentElement.style.alignItems = 'center'
                      target.parentElement.style.justifyContent = 'center'
                      target.parentElement.innerHTML = `<span style="font-family:'Bebas Neue',sans-serif;font-size:1.5rem;color:#b794f4">${m.initials}</span>`
                    }
                  }}
                />
              </div>

              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
              <div className="team-bio">{m.bio}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dope-footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand">DOPE</div>
            <div className="footer-tagline">Have limits? Try Dope. One flavor. One category. Built for businesses that want to be first.</div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              {[['About Us','#about'],['Team','#team'],['Careers','#'],['Press','#']].map(([l,h]) => <li key={l}><a href={h}>{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Trade</div>
            <ul className="footer-links">
              {[['Wholesale','#wholesale'],['Product','#product'],['Partner Portal','/login'],['Logistics','#']].map(([l,h]) => <li key={l}><a href={h}>{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              {[['trade@dopesoda.com','#'],['+91 98765 43210','#'],['LinkedIn','#'],['Instagram','#']].map(([l,h]) => <li key={l}><a href={h}>{l}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 DOPE Protein Soda. All rights reserved.</div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </>
  )
}
