import {S, MENU, ALL_ING, ING_NAME, COST} from "../core/state.js";
import {q} from "../utils/dom.js";
import {setHUD} from "../ui/hud.js";

export function spawnOrder(key=null, rapport=null){
  const keys=Object.keys(MENU);
  const k= key|| keys[(Math.random()*keys.length)|0];
  const r = rapport ?? (0.7 + Math.random()*0.3 - Math.min(S.heat,15)/80);
  S.orders.push({ id:Math.random().toString(36).slice(2), key:k, rapport:Math.max(0.4,Math.min(1.2,r)), t:Date.now(), src:"printer" });
  setHUD(); if(q("#panelOrders").style.display==="block") renderOrders();
}

export function tipFor(rapport){
  let tip=0.12*(0.5+0.5*Math.min(1,0.7+rapport));
  if(S.upg.amb) tip*=1.1;
  tip*= (1 - Math.min(S.heat,20)/90);
  return tip;
}

export function commonServe(rec, rapport, usedSet){
  for(const k of usedSet){ if(S.stock[k]>0) S.stock[k]--; }
  const sale = rec.price*(1+tipFor(rapport));
  S.money += sale; S.sales += sale;
  S.heat += 2 - (S.upg.prep?1:0);
  S.mShift = Math.min(12, S.mShift + 0.2);
  setHUD();
  return sale;
}

export function renderOrders(){
  q("#ordCount").textContent=S.orders.length;
  q("#invQuick").innerHTML = ALL_ING.map(k=>`${ING_NAME[k]}: <b>${S.stock[k]}</b>`).join(" · ");
  const list=q("#ordList"); list.innerHTML="";
  if(!S.selOrder && S.orders.length) S.selOrder = S.orders[0].id;
  S.orders.forEach(o=>{
    const rec=MENU[o.key];
    const div=document.createElement("div"); div.className="order"+(o.id===S.selOrder?" sel":"");
    const left=document.createElement("div"); left.innerHTML=`<b>${rec.name}</b><div class="tag">Rapport ${o.rapport.toFixed(2)} · ${o.src}</div>`;
    const right=document.createElement("div"); right.innerHTML=`<span class="chip">$${rec.price}</span>`;
    div.appendChild(left); div.appendChild(right);
    div.onclick=()=>{ S.selOrder=o.id; S.craftSel=new Set(); renderOrders(); };
    list.appendChild(div);
  });
  const ord=S.orders.find(x=>x.id===S.selOrder);
  if(!ord){ q("#craftTitle").textContent="No order selected"; q("#craftInfo").textContent=""; q("#ingGrid").innerHTML=""; return; }
  const rec=MENU[ord.key];
  q("#craftTitle").textContent=`${rec.name} — $${rec.price}`;
  q("#craftInfo").textContent=`Required: ${rec.req.map(r=>ING_NAME[r]).join(", ")}  |  Optional: ${(rec.opt||[]).map(o=>ING_NAME[o]).join(", ")||"—"}`;
  const grid=q("#ingGrid"); grid.innerHTML="";
  ALL_ING.forEach(ing=>{
    const count=S.stock[ing]||0;
    const isReq=rec.req.includes(ing), isOpt=(rec.opt||[]).includes(ing);
    const sel=S.craftSel.has(ing);
    const b=document.createElement("button");
    b.textContent=`${ING_NAME[ing]}  x${count}  ${isReq?"REQ":(isOpt?"OPT":"")}`.trim();
    b.disabled = (count<=0 && !sel);
    b.style.background = sel ? "#2f3c6a" : "#25182e";
    b.onclick=()=>{ if(sel){ S.craftSel.delete(ing); } else if(count>0){ S.craftSel.add(ing); } renderOrders(); };
    grid.appendChild(b);
  });
  q("#autoFill").onclick=()=>{ S.craftSel=new Set(rec.req.filter(k=>S.stock[k]>0)); renderOrders(); };
  q("#clearSel").onclick=()=>{ S.craftSel.clear(); renderOrders(); };
  q("#makeBtn").onclick=()=>makeDrinkFromPanel(ord);
  q("#compBtn").onclick=()=>compOrder(ord);
  q("#cancelBtn").onclick=()=>cancelOrder(ord);
  const canMake = rec.req.every(r=>S.craftSel.has(r) && S.stock[r]>0);
  q("#makeBtn").disabled = !canMake;
}

export function makeDrinkFromPanel(ord){
  const rec=MENU[ord.key];
  const sale=commonServe(rec, ord.rapport, S.craftSel);
  removeOrderAndMaybeQueue(ord);
  toast(`Served ${rec.name}  +$${sale.toFixed(2)}`);
  S.selOrder = S.orders[0]?.id || null;
  renderOrders();
}

export function compOrder(ord){
  const rec=MENU[ord.key];
  S.money = Math.max(0, S.money - rec.price);
  S.karma += 1;
  S.mShift = Math.min(12, S.mShift + 0.5);
  removeOrderAndMaybeQueue(ord);
  toast(`Comped ${rec.name}`);
  S.selOrder = S.orders[0]?.id || null;
  renderOrders(); setHUD();
}

export function cancelOrder(ord){
  S.karma = Math.max(0, S.karma - 1);
  S.mShift = Math.max(0, S.mShift - 0.5);
  S.L += 0.02;
  removeOrderAndMaybeQueue(ord);
  toast(`Canceled ${MENU[ord.key].name}`);
  S.selOrder = S.orders[0]?.id || null;
  renderOrders(); setHUD();
}

function removeOrderAndMaybeQueue(ord){
  S.orders = S.orders.filter(o=>o.id!==ord.id);
  const idx=S.queue.findIndex(c=>c.desired===ord.key);
  if(idx!==-1) S.queue.splice(idx,1);
}

export function renderSupply(){
  const grid=q("#supGrid"); grid.innerHTML="";
  ALL_ING.forEach(k=>{
    const card=document.createElement("div"); card.className="card";
    card.innerHTML = `<h3>${ING_NAME[k]}</h3>
      <div class="kv"><span>In stock</span><b>${S.stock[k]}</b></div>
      <div class="kv"><span>Cost per</span><b>$${COST[k]}</b></div>
      <div class="list">
        <button ${S.money<COST[k]?"disabled":""} data-k="${k}" data-q="1">Buy +1 ($${COST[k]})</button>
        <button ${S.money<COST[k]*5?"disabled":""} data-k="${k}" data-q="5">Buy +5 ($${COST[k]*5})</button>
      </div>`;
    grid.appendChild(card);
  });
  grid.querySelectorAll("button[data-k]").forEach(b=>{
    b.onclick=()=>{ const k=b.getAttribute("data-k"); const qn=+b.getAttribute("data-q");
      const cost=COST[k]*qn; if(S.money>=cost){ S.money-=cost; S.stock[k]+=qn; setHUD(); renderSupply(); if(q("#panelOrders").style.display==="block") renderOrders(); }};
  });
}

function toast(msg){ const h=q("#hint"); const old=h.textContent; h.textContent=msg; setTimeout(()=>{ h.textContent=old; },1300); }
