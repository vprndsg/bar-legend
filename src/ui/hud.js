import {S, ALL_ING, ING_NAME} from "../core/state.js";
import {q} from "../utils/dom.js";

const elClock=q("#clock"), elMoney=q("#money"), elKarma=q("#karma"),
      elMorale=q("#morale"), elHeat=q("#heat"), elAuth=q("#auth"), elDiag=q("#diag");

export function setHUD(){
  const ts=()=>{const hr=Math.floor(S.time/60),min=S.time%60|0; return `${String(hr).padStart(2,"0")}:${String(min).padStart(2,"0")}`;};
  elClock.textContent=`${ts()} Day ${S.day}`;
  elMoney.textContent=`Money ${S.money.toFixed(2)}`;
  elKarma.textContent=`Karma ${S.karma}`;
  const total=S.mShift+S.mJ+S.mM+S.mT, max=8+10+10+10;
  let pct=Math.round(total/max*100); if(pct>100)pct=100;
  elMorale.textContent=`Morale ${pct}%`;
  elHeat.textContent=`Heat ${Math.round(S.heat)}`;
  elAuth.textContent=`Authority ${S.authority.toFixed(1)}`;
  q("#btnOrders").textContent=`Orders ${S.orders.length}`;
  document.body.classList.remove("drift1","drift2","drift3");
  if(S.L>=0.85) document.body.classList.add("drift3");
  else if(S.L>=0.60) document.body.classList.add("drift2");
  else if(S.L>=0.30) document.body.classList.add("drift1");
  elDiag.textContent=S.diag.failed?"Diag FAIL":"Diag OK";
  elDiag.style.background=S.diag.failed? "#3a1518":"#1e1930";
}

export function openPanel(id){ q(id).style.display="block"; fillPanels(); }
export function closePanel(id){ q(id).style.display="none"; }
document.querySelectorAll(".close").forEach(b=>b.addEventListener("click",()=>closePanel(b.getAttribute("data-close"))));

export function fillPanels(){
  q("#ps_money").textContent=S.money.toFixed(2);
  q("#ps_karma").textContent=S.karma;
  q("#ps_heat").textContent=Math.round(S.heat);
  q("#ps_auth").textContent=S.authority.toFixed(1);
  q("#ps_L").textContent=S.L.toFixed(2);
  q("#ps_sales").textContent=S.sales.toFixed(2);
  q("#ps_mshift").textContent=S.mShift.toFixed(1);
  q("#ps_mj").textContent=S.mJ.toFixed(1);
  q("#ps_mm").textContent=S.mM.toFixed(1);
  q("#ps_mt").textContent=S.mT.toFixed(1);
  q("#ps_trust").textContent=S.trust;
  q("#ps_pride").textContent=S.pride;
  q("#ps_comp").textContent=S.compromise;
  q("#ps_debt").textContent=S.debt;
  q("#ps_mem").textContent=S.memory;
  q("#ps_inv").innerHTML = ALL_ING.map(k=>`${ING_NAME[k]}: <b>${S.stock[k]}</b>`).join(" · ");
  q("#buyPrep").disabled=!!S.upg.prep || S.money<25;
  q("#buyPOS").disabled=!!S.upg.pos || S.money<30;
  q("#buyTrain").disabled=!!S.upg.train || S.money<20;
  q("#buyAmb").disabled=!!S.upg.amb || S.money<15;
  q("#buyDeEsc").disabled=S.abil.deesc || S.karma<1;
  q("#useDeEsc").disabled=!S.abil.deesc;
  q("#buyTimebox").disabled=S.abil.timebox || S.karma<1;
}

// upgrades and abilities bindings
q("#buyPrep").onclick=()=>{ if(S.money>=25&&!S.upg.prep){ S.money-=25; S.upg.prep=1; toast("Prep station online"); setHUD(); fillPanels(); }};
q("#buyPOS").onclick=()=>{ if(S.money>=30&&!S.upg.pos){ S.money-=30; S.upg.pos=1; toast("POS faster"); setHUD(); fillPanels(); }};
q("#buyTrain").onclick=()=>{ if(S.money>=20&&!S.upg.train){ S.money-=20; S.upg.train=1; toast("Training active"); setHUD(); fillPanels(); }};
q("#buyAmb").onclick=()=>{ if(S.money>=15&&!S.upg.amb){ S.money-=15; S.upg.amb=1; toast("Ambience improved"); setHUD(); fillPanels(); }};
q("#buyDeEsc").onclick=()=>{ if(S.karma>=1&&!S.abil.deesc){ S.karma-=1; S.abil.deesc=true; toast("Deescalate learned"); setHUD(); fillPanels(); }};
q("#useDeEsc").onclick=()=>{ if(S.abil.deesc){ const cut=Math.min(6,S.heat*0.4); S.heat=Math.max(0,S.heat-cut); S.L=Math.max(0,S.L-0.015); S.mShift=Math.min(12,S.mShift+1); toast("Room cools"); setHUD(); }};
q("#buyTimebox").onclick=()=>{ if(S.karma>=1&&!S.abil.timebox){ S.karma-=1; S.abil.timebox=true; toast("Timebox learned"); setHUD(); fillPanels(); }};

function toast(msg){
  const h=q("#hint"); const old=h.textContent; h.textContent=msg; setTimeout(()=>{ h.textContent=old; },1300);
}
