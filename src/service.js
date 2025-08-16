import {S, MENU} from "../core/state.js";
import {commonServe} from "./orders.js";
import {setHUD} from "../ui/hud.js";

export function beginService(head, carryRapport=0){
  const req=MENU[head.desired];
  S.service={ id:head.id, requested:req.key, sel:new Set(), alt:null, rapport:carryRapport };
}
export function cancelService(){ S.service=null; }
export function toggleSel(ing){ if(!S.service) return; if((S.stock[ing]||0)<=0) return; const s=S.service.sel; if(s.has(ing)) s.delete(ing); else s.add(ing); }
export function canMake(reqKey){ const r=MENU[reqKey]; return r.req.every(k=>S.service.sel.has(k)); }

export function finalizeDrink(){
  const s=S.service; if(!s) return; const rec=MENU[s.requested]; if(!canMake(s.requested)) return;
  const sale=commonServe(rec, s.rapport, s.sel);
  const idx=S.queue.findIndex(c=>c.id===s.id);
  if(idx!==-1) S.queue.splice(idx,1);
  const oidx=S.orders.findIndex(o=>o.key===rec.key && o.src==="queue"); if(oidx!==-1) S.orders.splice(oidx,1);
  cancelService();
  toast(`Served ${rec.name}  +$${sale.toFixed(2)}`);
  setHUD();
}

function toast(msg){ const h=document.querySelector("#hint"); const old=h.textContent; h.textContent=msg; setTimeout(()=>{ h.textContent=old; },1300); }