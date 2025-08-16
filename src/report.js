import {S} from "../core/state.js";
import {q} from "../utils/dom.js";
import {openPanel} from "../ui/hud.js";

export function openReport(){
  q("#rp_money").textContent=S.money.toFixed(2);
  q("#rp_karma").textContent=S.karma;
  q("#rp_auth").textContent=S.authority.toFixed(1);
  q("#rp_hmax").textContent=Math.max(...S.tel.heats.concat([0])).toFixed(0);
  q("#rp_L").textContent=S.L.toFixed(2);
  q("#rp_mtot").textContent=(S.mShift+S.mJ+S.mM+S.mT).toFixed(1);
  q("#rp_cnt").textContent=S.tel.decisions.length;
  q("#rp_note").textContent = S.L<0.4 ? "Stable seven days earns the confrontation path." : "L is high. Favor integrity, planning, or late tools.";
  openPanel("#panelReport");
}