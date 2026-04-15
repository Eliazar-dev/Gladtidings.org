"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { KES } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const statusConfig: any = {
  pending_whatsapp: { label:"Pending WhatsApp", color:"#e65100", bg:"#fff3e0" },
  payment_sent:     { label:"Payment Sent", color:"#0d47a1", bg:"#e3f2fd" },
  paid:             { label:"Paid", color:"var(--green)", bg:"var(--mist)" },
  completed:        { label:"Completed", color:"#4a148c", bg:"#f3e5f5" },
  cancelled:        { label:"Cancelled", color:"var(--red)", bg:"#ffebee" },
}

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, signOut } = useAuthStore()
  const [tab, setTab] = useState("orders")
  const [orders, setOrders] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', avatar: '' })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    setProfileForm({
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
      avatar: user?.user_metadata?.avatar_url || '',
    })
  }, [user, router])

  useEffect(() => {
    async function fetchData() {
      if (!user) return
      try {
        // Fetch orders
        const ordersRes = await fetch(`/api/orders?userId=${user.id}`)
        const ordersData = await ordersRes.json()
        if (ordersData.success) {
          setOrders(ordersData.data || [])
        }

        // Fetch wishlist
        const wishlistRes = await fetch('/api/wishlist')
        const wishlistData = await wishlistRes.json()
        if (wishlistData.success) {
          setWishlist(wishlistData.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch account data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const tabs = [
    { id:"orders", icon:"📦", l:"My Orders" },
    { id:"profile", icon:"👤", l:"Profile" },
    { id:"wishlist", icon:"❤️", l:"Wishlist" },
  ]

  const saveProfile = async () => {
    // TODO: Implement profile update via API
    setEditingProfile(false)
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      setWishlist(w => w.filter(i => i.product_id !== productId))
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div style={{ minHeight:"100vh",padding:"40px 20px",background:"var(--cream)" }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"var(--ff-h)",fontSize:36,color:"var(--green)",marginBottom:8 }}>My Account</h1>
          <p style={{ fontSize:16,color:"var(--bark)",opacity:0.6 }}>Manage your orders, profile, and preferences</p>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"280px 1fr",gap:32,alignItems:"start" }}>
          {/* Sidebar */}
          <div style={{ background:"#fff",borderRadius:16,padding:20,border:"1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:16,paddingBottom:20,borderBottom:"1px solid var(--border)",marginBottom:20 }}>
              <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                <Image src={profileForm.avatar || '/placeholder.jpg'} alt={profileForm.name} fill sizes="64px" className="object-cover rounded-full" unoptimized />
              </div>
              <div>
                <div style={{ fontWeight:700,fontSize:16,color:"var(--bark)",marginBottom:4 }}>{profileForm.name}</div>
                <div style={{ fontSize:13,color:"var(--bark)",opacity:0.6 }}>{profileForm.email}</div>
              </div>
            </div>

            {tabs.map(t => (
              <div key={t.id} style={{ 
                display:"flex",
                alignItems:"center",
                gap:12,
                padding:"12px 16px",
                borderRadius:10,
                fontSize:14,
                fontWeight:600,
                color:tab===t.id?"var(--green)":"var(--bark)",
                cursor:"pointer",
                transition:"all 0.32s cubic-bezier(0.4,0,0.2,1)",
                marginBottom:4,
                background:tab===t.id?"var(--mist)":"transparent"
              }} onClick={() => setTab(t.id)}>
                <span style={{ fontSize:18 }}>{t.icon}</span>{t.l}
              </div>
            ))}

            <button onClick={handleSignOut} style={{ 
              width:"100%",
              padding:"12px 16px",
              borderRadius:10,
              fontSize:14,
              fontWeight:600,
              border:"none",
              cursor:"pointer",
              transition:"all 0.32s cubic-bezier(0.4,0,0.2,1)",
              marginTop:20,
              background:"var(--red)",
              color:"#fff"
            }}>
              Sign Out
            </button>
          </div>

          {/* Main Content */}
          <div style={{ background:"#fff",borderRadius:16,padding:32,border:"1px solid rgba(0,0,0,0.06)" }}>
            {loading ? (
              <div style={{ textAlign:"center",padding:"60px 20px" }}>
                <div style={{ fontSize:18,color:"var(--green)" }}>Loading account data...</div>
              </div>
            ) : (
              <>
            {/* ORDERS TAB */}
            {tab==="orders" && (
              <>
                <h2 style={{ fontFamily:"var(--ff-h)",fontSize:24,color:"var(--green)",marginBottom:24 }}>My Orders</h2>
                
                {orders.length === 0 ? (
                  <div style={{ textAlign:"center",padding:"60px 20px" }}>
                    <div style={{ fontSize:52,marginBottom:16,opacity:0.3 }}>📦</div>
                    <div style={{ fontSize:16,color:"var(--bark)",opacity:0.6,marginBottom:16 }}>You have no orders yet</div>
                    <button style={{ background:"var(--green)",color:"#fff",border:"none",padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer" }}>
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                    {orders.map(order => (
                      <div key={order.id} style={{ border:"1px solid var(--border)",borderRadius:12,padding:20 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:16,borderBottom:"1px solid var(--border)" }}>
                          <div>
                            <div style={{ fontWeight:700,fontSize:16,color:"var(--bark)",marginBottom:4 }}>{order.id}</div>
                            <div style={{ fontSize:13,color:"var(--bark)",opacity:0.5 }}>{new Date(order.date).toLocaleDateString("en-KE",{dateStyle:"full",timeStyle:"short"})}</div>
                          </div>
                          <span style={{ 
                            display:"inline-flex",
                            alignItems:"center",
                            gap:5,
                            padding:"6px 14px",
                            borderRadius:20,
                            fontSize:12,
                            fontWeight:700,
                            letterSpacing:"0.06em",
                            textTransform:"uppercase",
                            background: statusConfig[order.status]?.bg,
                            color: statusConfig[order.status]?.color
                          }}>
                            {statusConfig[order.status]?.label}
                          </span>
                        </div>

                        <div style={{ marginBottom:16 }}>
                          {(order.items || []).map((item: any, i: number) => (
                            <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14 }}>
                              <span>{item.product_name} ×{item.quantity}</span>
                              <span style={{ fontWeight:700,color:"var(--gold)" }}>{KES(item.total_price)}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,borderTop:"1px solid var(--border)" }}>
                          <div style={{ fontSize:14,color:"var(--bark)",opacity:0.6 }}>Total</div>
                          <div style={{ fontFamily:"var(--ff-h)",fontSize:20,color:"var(--gold)",fontWeight:700 }}>{KES(order.total)}</div>
                        </div>

                        <div style={{ marginTop:16,display:"flex",gap:12 }}>
                          <button style={{ padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:700,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",transition:"all 0.32s cubic-bezier(0.4,0,0.2,1)" }}>
                            View Details
                          </button>
                          {order.status !== "cancelled" && order.status !== "completed" && (
                            <button style={{ padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:700,border:"none",background:"var(--mist)",color:"var(--green)",cursor:"pointer",transition:"all 0.32s cubic-bezier(0.4,0,0.2,1)" }}>
                              Track Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* PROFILE TAB */}
            {tab==="profile" && (
              <>
                <h2 style={{ fontFamily:"var(--ff-h)",fontSize:24,color:"var(--green)",marginBottom:24 }}>Profile Settings</h2>
                
                <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:32 }}>
                  <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                    <Image src={profileForm.avatar || '/placeholder.jpg'} alt={profileForm.name} fill sizes="100px" className="object-cover rounded-full" unoptimized />
                  </div>
                  <div>
                    <button style={{ padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:700,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",marginBottom:8 }}>
                      Change Photo
                    </button>
                    <div style={{ fontSize:12,color:"var(--bark)",opacity:0.5 }}>JPG, PNG or GIF. Max size 2MB</div>
                  </div>
                </div>

                {editingProfile ? (
                  <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
                    <div>
                      <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8 }}>Full Name</label>
                      <input style={{ width:"100%",padding:"12px 16px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,outline:"none",transition:"border-color 0.32s cubic-bezier(0.4,0,0.2,1)" }} value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8 }}>Email</label>
                      <input type="email" style={{ width:"100%",padding:"12px 16px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,outline:"none",transition:"border-color 0.32s cubic-bezier(0.4,0,0.2,1)" }} value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8 }}>Phone</label>
                      <input style={{ width:"100%",padding:"12px 16px",border:"1.5px solid var(--border)",borderRadius:8,fontSize:14,outline:"none",transition:"border-color 0.32s cubic-bezier(0.4,0,0.2,1)" }} value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                    </div>
                    <div style={{ display:"flex",gap:12,marginTop:8 }}>
                      <button onClick={saveProfile} style={{ padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:700,border:"none",background:"var(--green)",color:"#fff",cursor:"pointer" }}>
                        Save Changes
                      </button>
                      <button onClick={() => { setEditingProfile(false); setProfileForm({...profileForm}); }} style={{ padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:700,border:"1px solid var(--border)",background:"transparent",cursor:"pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",padding:"16px 0",borderBottom:"1px solid var(--border)" }}>
                      <span style={{ fontSize:14,color:"var(--bark)",opacity:0.6 }}>Full Name</span>
                      <span style={{ fontSize:14,fontWeight:600,color:"var(--bark)" }}>{profileForm.name}</span>
                    </div>
                    <div style={{ display:"flex",justifyContent:"space-between",padding:"16px 0",borderBottom:"1px solid var(--border)" }}>
                      <span style={{ fontSize:14,color:"var(--bark)",opacity:0.6 }}>Email</span>
                      <span style={{ fontSize:14,fontWeight:600,color:"var(--bark)" }}>{profileForm.email}</span>
                    </div>
                    <div style={{ display:"flex",justifyContent:"space-between",padding:"16px 0",borderBottom:"1px solid var(--border)" }}>
                      <span style={{ fontSize:14,color:"var(--bark)",opacity:0.6 }}>Phone</span>
                      <span style={{ fontSize:14,fontWeight:600,color:"var(--bark)" }}>{profileForm.phone}</span>
                    </div>
                    <button onClick={() => setEditingProfile(true)} style={{ padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:700,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",marginTop:8,width:"fit-content" }}>
                      Edit Profile
                    </button>
                  </div>
                )}
              </>
            )}

            {/* WISHLIST TAB */}
            {tab==="wishlist" && (
              <>
                <h2 style={{ fontFamily:"var(--ff-h)",fontSize:24,color:"var(--green)",marginBottom:24 }}>My Wishlist</h2>
                
                {wishlist.length === 0 ? (
                  <div style={{ textAlign:"center",padding:"60px 20px" }}>
                    <div style={{ fontSize:52,marginBottom:16,opacity:0.3 }}>❤️</div>
                    <div style={{ fontSize:16,color:"var(--bark)",opacity:0.6,marginBottom:16 }}>Your wishlist is empty</div>
                    <button style={{ background:"var(--green)",color:"#fff",border:"none",padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer" }}>
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
                    {wishlist.map(item => (
                      <div key={item.product_id} style={{ border:"1px solid var(--border)",borderRadius:12,padding:16,textAlign:"center" }}>
                        <div style={{ position: 'relative', width: '100%', height: 180, marginBottom: 12 }}>
                          <Image src={item.product?.images?.[0] || '/placeholder.jpg'} alt={item.product?.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover rounded-lg" unoptimized />
                        </div>
                        <div style={{ fontWeight:700,fontSize:14,color:"var(--bark)",marginBottom:8,height:40,overflow:"hidden" }}>{item.product?.name}</div>
                        <div style={{ fontFamily:"var(--ff-h)",fontSize:18,color:"var(--gold)",fontWeight:700,marginBottom:12 }}>{KES(item.product?.price || 0)}</div>
                        <div style={{ display:"flex",gap:8,justifyContent:"center" }}>
                          <button style={{ flex:1,padding:"10px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:"var(--green)",color:"#fff",cursor:"pointer" }}>
                            Add to Cart
                          </button>
                          <button onClick={() => removeFromWishlist(item.product_id)} style={{ padding:"10px 12px",borderRadius:6,fontSize:12,fontWeight:700,border:"1px solid var(--border)",background:"transparent",cursor:"pointer" }}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
