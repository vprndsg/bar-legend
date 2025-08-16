import {S} from "./state.js";
import {q} from "../utils/dom.js";
import {setHUD} from "../ui/hud.js";

export function telTick(tag, dm=0, dk=0, dL=0, dH=0){
  S.time+=1;
  S.tel.mins.push(S.time);
  S.tel.Ls.push(S.L);
  S.tel.heats.push(S.heat);
  S.tel.money.push(S.money);
  S.tel.karma.push(S.karma);
  S.tel.morale.push(S.mShift+S.mJ+S.mM+S.mT);
  S.tel.decisions.push({t:S.time,tag,dm,dk,dl:dL,dh:dH});
  if(S.upg.train) S.mShift=Math.min(12,S.mShift+0.2);
  S.tel.heatIntegral+=Math.max(0,S.heat);
  const Lh=Math.max(0,S.heat)*0.0008; S.L=Math.min(0.999,S.L+Lh); S.tel.LFromHeat+=Lh;
  setHUD();
}

export function fillTel(){
  const Lpm = S.tel.heatIntegral>0 ? (S.tel.LFromHeat / (S.tel.heatIntegral/60)).toFixed(3) : "0.000";
  q("#tv_Lpm").textContent=Lpm;
  const hrs=(Date.now()-S.tel.start)/3600000;
  q("#tv_Kph").textContent=(S.karma/Math.max(hrs,0.001)).toFixed(2);
  q("#tv_Mloss").textContent=S.tel.seededMoraleLoss.toFixed(2);
  const base=320, last=S.tel.money[S.tel.money.length-1]??S.money; const mDelta=(last-base);
  q("#tv_Money").textContent=((mDelta>=0?"+":"")+mDelta.toFixed(2));
  q("#tv_list").innerHTML=S.tel.decisions.map(d=>`<div>t${String(d.t).padStart(2,"0")} ${d.tag} Δ$${d.dm} K${d.dk} L${d.dl.toFixed(2)} H${d.dh.toFixed(1)}</div>`).join("");
}

q("#tv_export").onclick=()=>{
  const data={mins:S.tel.mins,L:S.tel.Ls,heat:S.tel.heats,money:S.tel.money,karma:S.tel.karma,morale:S.tel.morale,decisions:S.tel.decisions};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="telemetry.json"; a.click(); URL.revokeObjectURL(a.href);
};