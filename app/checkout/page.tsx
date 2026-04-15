"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { KES, buildWhatsAppMessage } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254740492907"

const counties = ["Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu","Machakos","Meru","Nyeri","Kilifi","Kwale","Kakamega","Bungoma","Siaya","Kisii","Migori","Homa Bay","Nandi","Trans Nzoia","Bomet","Kericho","Laikipia","Nyandarua","Murang'a","Kiambu","Kajiado","Makueni","Kitui","Embu","Tharaka-Nithi","Isiolo","Marsabit","Turkana","West Pokot","Samburu","Garissa","Mandera","Wajir","Tana River","Lamu","Taita-Taveta"]

const deliveryOptions = [
  { id:"standard", label:"Standard Delivery", desc:"3–5 business days", price:350, icon:"🚚" },
  { id:"express",  label:"Express Delivery",  desc:"1–2 business days", price:650, icon:"⚡" },
  { id:"pickup",   label:"Self Pickup",        desc:"Awendo, Migori - Skyrider House", price:0, icon:"🏪" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart, hasHydrated } = useCartStore()
  const [step, setStep] = useState(1)
  const [delivery, setDelivery] = useState("standard")
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [form, setForm] = useState({
    firstName:"", lastName:"", phone:"", email:"",
    address:"", city:"", county:"", notes:""
  })

  useEffect(() => {
    if (mounted && hasHydrated && items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router, mounted, hasHydrated])

  if (!mounted || !hasHydrated) {
    return null
  }

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e: any) => ({ ...e, [k]: "" }))
  }

  const subtotal = hasHydrated ? totalPrice() : 0
  const deliveryFee = subtotal >= 5000 && delivery !== "express" ? 0 : deliveryOptions.find(d => d.id === delivery)?.price || 0
  const discount = couponApplied ? Math.floor(subtotal * 0.1) : 0
  const total = subtotal + deliveryFee - discount

  const validate = () => {
    const e: any = {}
    if (!form.firstName.trim()) e.firstName = "Required"
    if (!form.lastName.trim()) e.lastName = "Required"
    if (!form.phone.trim()) e.phone = "Required"
    else if (!/^(\+?254|0)[17]\d{8}$/.test(form.phone.replace(/\s/g,""))) e.phone = "Enter a valid Kenyan number"
    if (!form.email.trim()) e.email = "Required"
    else if (!form.email.includes("@")) e.email = "Invalid email"
    if (delivery !== "pickup") {
      if (!form.address.trim()) e.address = "Required"
      if (!form.city.trim()) e.city = "Required"
      if (!form.county) e.county = "Required"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const applyCoupon = async () => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, subtotal })
      })
      const data = await res.json()
      if (data.success && data.data.valid) {
        setCouponApplied(true)
        setCouponError("")
      } else {
        setCouponError(data.data.message || "Invalid coupon code")
      }
    } catch (error) {
      console.error('Failed to validate coupon:', error)
      setCouponError("Failed to validate coupon")
    }
  }

  const placeOrder = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      const payload = {
        customerName: `${form.firstName} ${form.lastName}`,
        customerPhone: form.phone,
        customerEmail: form.email,
        deliveryMethod: delivery as any,
        address: delivery !== "pickup" ? form.address : undefined,
        city: delivery !== "pickup" ? form.city : undefined,
        county: delivery !== "pickup" ? form.county : undefined,
        notes: form.notes,
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          productImage: item.images?.[0],
          quantity: item.qty,
          unitPrice: item.price,
        })),
        subtotal,
        shipping: deliveryFee,
        discount,
        total,
        couponCode: couponApplied ? coupon : undefined,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      
      if (data.success) {
        clearCart()
        // Build WhatsApp message with order details
        const orderData = {
          id: data.orderId,
          customerName: `${form.firstName} ${form.lastName}`,
          customerPhone: form.phone,
          customerEmail: form.email,
          address: delivery !== "pickup" ? form.address : undefined,
          city: delivery !== "pickup" ? form.city : undefined,
          items: items.map(item => ({
            product_name: item.name,
            quantity: item.qty,
            unit_price: item.price,
            total_price: item.price * item.qty,
          })),
          subtotal,
          shipping: deliveryFee,
          discount,
          total,
        }
        const waMessage = buildWhatsAppMessage(orderData)
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`
        // Open WhatsApp with prefilled message
        window.open(waUrl, "_blank")
        // Redirect to success page
        router.push('/shop')
      } else {
        setCouponError(data.error || "Failed to place order")
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      setCouponError("Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{ paddingTop: "calc(66px + 36px)", minHeight: "100vh", background: "var(--cream)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 28px 80px" }}>

          {/* Header */}
          <div style={{ marginBottom:28 }}>
            <Link href="/cart" style={{ background:"none",border:"none",color:"var(--green3)",fontSize:13,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,marginBottom:14,textDecoration:"none" }}>← Back to Cart</Link>
            <h1 style={{ fontFamily:"var(--ff-h)",fontSize:"clamp(24px,4vw,38px)",color:"var(--green)" }}>Checkout</h1>
            <p style={{ fontSize:13,color:"var(--bark)",opacity:0.55,marginTop:5 }}>Your order will be confirmed via WhatsApp</p>

            {/* Steps */}
            <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:18,flexWrap:"wrap" }}>
              {[["1","Contact & Delivery"],["2","Review & Order"],["3","Done"]].map(([n,l],i) => (
                <div key={n} style={{ display:"flex",alignItems:"center" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                    <div style={{ width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0,background: step>i+1 ? "var(--lime)" : step===i+1 ? "var(--green)" : "var(--border)", color: step>=i+1 ? "#fff" : "var(--bark)" }}>
                      {step>i+1 ? "✓" : n}
                    </div>
                    <span style={{ fontSize:12,fontWeight:700,whiteSpace:"nowrap",color: step===i+1 ? "var(--green)" : "var(--bark)", opacity: step===i+1 ? 1 : 0.45 }}>{l}</span>
                  </div>
                  {i<2 && <div style={{ width:24,height:1,background:"var(--border)",margin:"0 6px",flexShrink:0 }}/>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 360px",gap:28,alignItems:"start" }}>
            {/* LEFT */}
            <div>
              {/* STEP 1: Contact */}
              {step === 1 && (
                <div style={{ animation:"scaleIn 0.4s ease both" }}>
                  <div style={{ background:"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:26,marginBottom:18 }}>
                    <div style={{ fontFamily:"var(--ff-h)",fontSize:20,color:"var(--green)",marginBottom:18,display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:28,height:28,background:"var(--green)",color:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0 }}>1</div>
                      Your Contact Details
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                      <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:14 }}>
                        <label style={{ fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--green)" }}>First Name *</label>
                        <input className={`fi ${errors.firstName?"error":""}`} placeholder="Grace" value={form.firstName} onChange={e=>set("firstName",e.target.value)} style={{ padding:"12px 14px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,color:"var(--bark)",background:"var(--white)",outline:"none",width:"100%" }}/>
                        {errors.firstName && <span style={{ fontSize:11,color:"var(--red)",fontWeight:600,marginTop:3 }}>{errors.firstName}</span>}
                      </div>
                      <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:14 }}>
                        <label style={{ fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--green)" }}>Last Name *</label>
                        <input className={`fi ${errors.lastName?"error":""}`} placeholder="Wanjiru" value={form.lastName} onChange={e=>set("lastName",e.target.value)} style={{ padding:"12px 14px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,color:"var(--bark)",background:"var(--white)",outline:"none",width:"100%" }}/>
                        {errors.lastName && <span style={{ fontSize:11,color:"var(--red)",fontWeight:600,marginTop:3 }}>{errors.lastName}</span>}
                      </div>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                      <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:14 }}>
                        <label style={{ fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--green)" }}>WhatsApp / Phone *</label>
                        <input className={`fi ${errors.phone?"error":""}`} placeholder="+254 700 123 456" value={form.phone} onChange={e=>set("phone",e.target.value)} style={{ padding:"12px 14px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,color:"var(--bark)",background:"var(--white)",outline:"none",width:"100%" }}/>
                        {errors.phone && <span style={{ fontSize:11,color:"var(--red)",fontWeight:600,marginTop:3 }}>{errors.phone}</span>}
                        <span style={{ fontSize:11,color:"var(--bark)",opacity:0.5 }}>This number receives order updates</span>
                      </div>
                      <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:14 }}>
                        <label style={{ fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--green)" }}>Email *</label>
                        <input className={`fi ${errors.email?"error":""}`} type="email" placeholder="grace@email.com" value={form.email} onChange={e=>set("email",e.target.value)} style={{ padding:"12px 14px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,color:"var(--bark)",background:"var(--white)",outline:"none",width:"100%" }}/>
                        {errors.email && <span style={{ fontSize:11,color:"var(--red)",fontWeight:600,marginTop:3 }}>{errors.email}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ background:"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:26,marginBottom:18 }}>
                    <div style={{ fontFamily:"var(--ff-h)",fontSize:20,color:"var(--green)",marginBottom:18,display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:28,height:28,background:"var(--green)",color:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0 }}>1</div>
                      Delivery Address
                    </div>

                    {/* Delivery method */}
                    {deliveryOptions.map(d => {
                      const isSelected = delivery === d.id
                      return (
                        <div key={d.id} style={{ 
                          border:"1.5px solid var(--border)",
                          borderRadius:9,
                          padding:"13px 16px",
                          display:"flex",
                          alignItems:"center",
                          gap:12,
                          cursor:"pointer",
                          transition:"all 0.32s cubic-bezier(0.4,0,0.2,1)",
                          marginBottom:9,
                          borderColor: isSelected ? "var(--green)" : "var(--border)",
                          background: isSelected ? "var(--mist)" : "var(--white)"
                        }} onClick={() => setDelivery(d.id)}>
                          <div style={{ 
                            width:16,
                            height:16,
                            borderRadius:"50%",
                            border:"2px solid var(--border)",
                            flexShrink:0,
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            transition:"border-color 0.32s cubic-bezier(0.4,0,0.2,1)",
                            borderColor: isSelected ? "var(--green)" : "var(--border)"
                          }}>
                            {isSelected && <div style={{ width:7,height:7,borderRadius:"50%",background:"var(--green)" }}/>}
                          </div>
                          <span style={{ fontSize:20 }}>{d.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:14,fontWeight:700,color:"var(--green)" }}>{d.label}</div>
                            <div style={{ fontSize:12,color:"var(--bark)",opacity:0.55 }}>{d.desc}</div>
                          </div>
                          <div style={{ fontFamily:"var(--ff-h)",fontSize:16,color:"var(--gold)",fontWeight:700,flexShrink:0 }}>
                            {d.price === 0 ? (subtotal >= 5000 && d.id==="standard" ? <span style={{ color:"var(--green3)" }}>Free</span> : "Free") : KES(d.price)}
                          </div>
                        </div>
                      )
                    })}

                    {delivery !== "pickup" && (
                      <div style={{ marginTop:16 }}>
                        <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:14 }}>
                          <label style={{ fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--green)" }}>Street Address *</label>
                          <input className={`fi ${errors.address?"error":""}`} placeholder="123 Ngong Road, Apt 4B" value={form.address} onChange={e=>set("address",e.target.value)} style={{ padding:"12px 14px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,color:"var(--bark)",background:"var(--white)",outline:"none",width:"100%" }}/>
                          {errors.address && <span style={{ fontSize:11,color:"var(--red)",fontWeight:600,marginTop:3 }}>{errors.address}</span>}
                        </div>
                        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                          <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:14 }}>
                            <label style={{ fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--green)" }}>City / Town *</label>
                            <input className={`fi ${errors.city?"error":""}`} placeholder="Nairobi" value={form.city} onChange={e=>set("city",e.target.value)} style={{ padding:"12px 14px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,color:"var(--bark)",background:"var(--white)",outline:"none",width:"100%" }}/>
                            {errors.city && <span style={{ fontSize:11,color:"var(--red)",fontWeight:600,marginTop:3 }}>{errors.city}</span>}
                          </div>
                          <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:14 }}>
                            <label style={{ fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--green)" }}>County *</label>
                            <select className={`fi ${errors.county?"error":""}`} value={form.county} onChange={e=>set("county",e.target.value)} style={{ padding:"12px 14px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,color:"var(--bark)",background:"var(--white)",outline:"none",width:"100%" }}>
                              <option value="">Select county</option>
                              {counties.map(c => <option key={c}>{c}</option>)}
                            </select>
                            {errors.county && <span style={{ fontSize:11,color:"var(--red)",fontWeight:600,marginTop:3 }}>{errors.county}</span>}
                          </div>
                        </div>
                        <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:14 }}>
                          <label style={{ fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--green)" }}>Order Notes (optional)</label>
                          <textarea className="fi" rows={3} placeholder="Any special instructions..." value={form.notes} onChange={e=>set("notes",e.target.value)} style={{ resize:"vertical",padding:"12px 14px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,color:"var(--bark)",background:"var(--white)",outline:"none",width:"100%" }}/>
                        </div>
                      </div>
                    )}

                    <button className="btn-p" style={{ width:"100%",marginTop:8,background:"var(--green)",color:"var(--cream)",border:"none",padding:"13px 28px",borderRadius:8,fontSize:13,fontWeight:700,letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center",cursor:"pointer" }} onClick={() => { if(validate()) setStep(2); }}>
                      Continue to Review →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Review */}
              {step === 2 && (
                <div style={{ animation:"scaleIn 0.4s ease both" }}>
                  <div style={{ background:"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:26,marginBottom:18 }}>
                    <div style={{ fontFamily:"var(--ff-h)",fontSize:20,color:"var(--green)",marginBottom:18,display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:28,height:28,background:"var(--green)",color:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0 }}>2</div>
                      Review Your Order
                    </div>

                    {/* Items */}
                    {items.map(item => (
                      <div style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)" }} key={item.id}>
                        <div style={{ width:48,height:48,borderRadius:7,overflow:"hidden",flexShrink:0,position:"relative" }}>
                          <Image src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} fill sizes="48px" unoptimized style={{ objectFit:"cover" }}/>
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14,fontWeight:700,color:"var(--green)" }}>{item.name}</div>
                          <div style={{ fontSize:12,color:"var(--bark)",opacity:0.55 }}>Qty: {item.qty}</div>
                        </div>
                        <div style={{ fontFamily:"var(--ff-h)",fontSize:16,color:"var(--gold)",fontWeight:700 }}>{KES(item.price*item.qty)}</div>
                      </div>
                    ))}

                    {/* Delivery confirmation */}
                    <div style={{ background:"var(--mist)",borderRadius:8,padding:"12px 14px",margin:"16px 0",fontSize:13 }}>
                      <div style={{ fontWeight:700,color:"var(--green)",marginBottom:4 }}>
                        {deliveryOptions.find(d=>d.id===delivery)?.icon} {deliveryOptions.find(d=>d.id===delivery)?.label}
                      </div>
                      <div style={{ color:"var(--bark)",opacity:0.65 }}>
                        {delivery === "pickup" ? "Pickup at Ngong Road, Nairobi" : `${form.address}, ${form.city}, ${form.county}`}
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div style={{ background:"var(--mist)",borderRadius:8,padding:"12px 14px",marginBottom:16,fontSize:13 }}>
                      <div style={{ fontWeight:700,color:"var(--green)",marginBottom:4 }}>📞 Contact</div>
                      <div style={{ color:"var(--bark)",opacity:0.65 }}>{form.firstName} {form.lastName} · {form.phone}</div>
                    </div>

                    {/* How WA checkout works */}
                    <div style={{ background:"#e8f5e9",borderRadius:10,padding:16,border:"1px solid rgba(37,211,102,0.2)",marginBottom:16 }}>
                      <div style={{ fontWeight:800,color:"#1b5e20",fontSize:13,marginBottom:10,display:"flex",alignItems:"center",gap:8 }}>
                        💬 How WhatsApp Checkout Works
                      </div>
                      {[
                        "Click \"Place Order via WhatsApp\" below",
                        "WhatsApp opens with your complete order details",
                        "Send the message to us — we read it instantly",
                        "We send you an M-Pesa payment request to your phone",
                        "Confirm payment on your phone — order dispatched within 24hrs!"
                      ].map((s,i) => (
                        <div key={i} style={{ display:"flex",gap:10,marginBottom:7,fontSize:12,color:"#1b3320" }}>
                          <div style={{ width:20,height:20,background:"var(--wa)",color:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,flexShrink:0,marginTop:1 }}>{i+1}</div>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display:"flex",gap:12 }}>
                      <button className="btn-o" style={{ flex:1,background:"transparent",color:"var(--green)",border:"2px solid var(--green)",padding:"11px 26px",borderRadius:8,fontSize:13,fontWeight:700,display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center",cursor:"pointer" }} onClick={() => setStep(1)}>← Back</button>
                      <button className="btn-wa" style={{ flex:2,background:"var(--wa)",color:"#fff",border:"none",padding:"16px 32px",borderRadius:10,fontSize:15,fontWeight:800,letterSpacing:"0.02em",display:"inline-flex",alignItems:"center",gap:12,justifyContent:"center",width:"100%",boxShadow:"0 8px 24px rgba(37,211,102,0.35)",cursor:"pointer" }} onClick={placeOrder} disabled={loading}>
                        {loading ? (
                          <span style={{ width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block" }}/>
                        ) : "💬"}
                        {loading ? "Saving order..." : "Place Order via WhatsApp"}
                      </button>
                    </div>
                    <div style={{ textAlign:"center",marginTop:12,fontSize:11,color:"var(--bark)",opacity:0.4 }}>
                      🔒 Your order is saved securely before WhatsApp opens
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Sticky Summary */}
            <div>
              <div style={{ background:"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:22,position:"sticky",top:90 }}>
                <h3 style={{ fontFamily:"var(--ff-h)",fontSize:19,color:"var(--green)",marginBottom:16 }}>Order Summary</h3>

                {items.map(item => (
                  <div style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)",fontSize:13 }} key={item.id}>
                    <div style={{ width:38,height:38,borderRadius:6,overflow:"hidden",flexShrink:0,position:"relative" }}>
                      <Image src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} fill sizes="38px" unoptimized style={{ objectFit:"cover" }}/>
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontWeight:700,color:"var(--green)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12 }}>{item.name}</div>
                      <div style={{ color:"var(--bark)",opacity:0.5,fontSize:11 }}>×{item.qty}</div>
                    </div>
                    <div style={{ fontWeight:700,color:"var(--gold)",flexShrink:0,fontSize:13 }}>{KES(item.price*item.qty)}</div>
                  </div>
                ))}

                {/* Coupon */}
                <div style={{ marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)" }}>
                  <div style={{ fontSize:12,fontWeight:700,color:"var(--green)",marginBottom:6 }}>Have a coupon?</div>
                  {couponApplied ? (
                    <div style={{ background:"var(--mist)",border:"1px solid rgba(64,145,108,0.3)",borderRadius:7,padding:"10px 13px",fontSize:12,color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:7,marginTop:8 }}>✓ MISSION10 applied — 10% off!</div>
                  ) : (
                    <>
                      <div style={{ display:"flex",gap:8,marginTop:12 }}>
                        <input style={{ flex:1,padding:"10px 13px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:13,outline:"none",transition:"border-color 0.32s cubic-bezier(0.4,0,0.2,1)" }} placeholder="Enter code..." value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError(""); }}
                          onKeyDown={e => e.key==="Enter" && applyCoupon()}/>
                        <button style={{ background:"var(--green)",color:"#fff",border:"none",padding:"10px 18px",borderRadius:8,fontSize:12,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer" }} onClick={applyCoupon}>Apply</button>
                      </div>
                      {couponError && <div style={{ fontSize:11,color:"var(--red)",fontWeight:600,marginTop:5 }}>{couponError}</div>}
                    </>
                  )}
                </div>

                {/* Totals */}
                <div style={{ marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14 }}><span>Subtotal</span><span>{KES(subtotal)}</span></div>
                  <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14 }}>
                    <span>Delivery</span>
                    <span style={{ color: deliveryFee===0 ? "var(--green3)" : "" }}>
                      {deliveryFee===0 ? "Free 🎉" : KES(deliveryFee)}
                    </span>
                  </div>
                  {couponApplied && (
                    <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14,color:"var(--green3)" }}>
                      <span>Discount (10%)</span><span>− {KES(discount)}</span>
                    </div>
                  )}
                  <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14,borderTop:"1px solid var(--border)",marginTop:6,paddingTop:14,fontWeight:800 }}>
                    <span>Total</span>
                    <span style={{ fontFamily:"var(--ff-h)",fontSize:22,color:"var(--green)" }}>{KES(total)}</span>
                  </div>
                </div>

                {subtotal < 5000 && delivery === "standard" && (
                  <div style={{ background:"var(--mist)",borderRadius:7,padding:"9px 12px",marginTop:12,fontSize:12,color:"var(--green)",fontWeight:600 }}>
                    💡 Add {KES(5000-subtotal)} more for free delivery!
                  </div>
                )}

                <div style={{ background:"linear-gradient(135deg,var(--mist),#e0f0e8)",borderRadius:8,padding:13,marginTop:14,fontSize:12,color:"var(--green)",lineHeight:1.65,textAlign:"center" }}>
                  🌍 <strong>10%</strong> of this order supports our free clinic programmes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
