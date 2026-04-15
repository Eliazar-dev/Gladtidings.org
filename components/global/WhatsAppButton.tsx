"use client"

import { useState, useEffect } from 'react'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setShowTooltip(true), 3000)
    const t2 = setTimeout(() => setShowTooltip(false), 7000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  if (!mounted) return null

  const quickMsgs = [
    "I&apos;d like to order a product",
    "I have a question about a remedy",
    "I need help with my order",
    "Tell me about your mission",
  ]

  const openWhatsApp = (text: string) => {
    const phone = "254723730980"
    const message = encodeURIComponent(text || msg || "Hello! I&apos;m interested in Gladtidings Health products.")
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
  }

  return (
    <div className="wa-fab">
      {open && (
        <div className="wa-chat">
          <div className="wa-chat-header">
            <div className="wa-chat-avatar">🌿</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Gladtidings Health</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>● Online · Typically replies instantly</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
          <div className="wa-chat-body">
            <div className="wa-bubble">
              👋 Hello! Welcome to Gladtidings Health.<br /><br />
              How can we help you today? Choose an option below or type your message.
            </div>
            {quickMsgs.map((m, i) => (
              <button key={i} className="wa-quick-btn" onClick={() => openWhatsApp(m)}>
                {m} →
              </button>
            ))}
          </div>
          <div className="wa-chat-footer">
            <input className="wa-chat-input" placeholder="Type a message..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && openWhatsApp(msg)} />
            <button className="wa-send" onClick={() => openWhatsApp(msg)}>→</button>
          </div>
        </div>
      )}

      {showTooltip && !open && (
        <div className="wa-tooltip">💬 Chat with us on WhatsApp</div>
      )}

      <button className="wa-btn" onClick={() => { setOpen(o => !o); setShowTooltip(false) }}>
        <div className="wa-ping" />
        <WhatsAppIcon size={28} color="#fff" />
      </button>
    </div>
  )
}
