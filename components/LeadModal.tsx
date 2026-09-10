'use client';
import { FormEvent, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export default function LeadModal({open,onClose}:{open:boolean,onClose:()=>void}){
 const [email,setEmail]=useState(''); const [skill,setSkill]=useState(''); const [sent,setSent]=useState(false);
 function submit(e:FormEvent){e.preventDefault(); if(!email||!email.includes('@'))return; localStorage.setItem('ratatune_demo_lead',JSON.stringify({email,skill,createdAt:new Date().toISOString()})); setSent(true)}
 return <AnimatePresence>{open&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><motion.div className="modal" initial={{y:30,scale:.97}} animate={{y:0,scale:1}} exit={{y:20,scale:.98}} transition={{duration:.35,ease:[.22,1,.36,1]}}>
 <button className="close" onClick={onClose} aria-label="Close">×</button>
 {!sent?<><div className="eyebrow" style={{color:'#8a6a1f'}}>Ratatune / early access</div><h3 className="serif">Hear what your bends are really doing.</h3><p>We’re pre-launch. Leave an email and, if useful, tell us the bend you work on most. That’s it.</p><form onSubmit={submit}><div className="field"><label htmlFor="email">Email</label><input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div><div className="field"><label htmlFor="skill">Optional: most-used bend</label><select id="skill" value={skill} onChange={e=>setSkill(e.target.value)}><option value="">Choose one</option><option>2 draw</option><option>3 draw</option><option>4 draw</option><option>5 draw</option><option>Other</option></select></div><button className="btn btn-primary" style={{width:'100%',justifyContent:'center',border:0}}>Get Early Access ↗</button></form><div className="form-note">No price. No “start free trial”. This is an early-access list.</div></>:<div className="success"><div className="eyebrow" style={{color:'#8a6a1f'}}>You’re on the list</div><strong>Good. Keep playing.</strong><p>For this demo, your details are stored locally in the browser.</p><button className="btn btn-primary" onClick={onClose}>Back to the page</button></div>}
 </motion.div></motion.div>}</AnimatePresence>
}
