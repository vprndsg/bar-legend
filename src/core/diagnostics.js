// Diagnostics to verify core functionality at startup
import {S, MENU} from "./state.js";
import {spawnOrder} from "../game/orders.js";
import {beginService, canMake, finalizeDrink} from "../game/service.js";

/**
 * Run a series of self tests to ensure that key game systems operate.
 * Populates S.diag.failed and S.diag.errors accordingly. These tests
 * validate inventory presence, order spawning, service flow and
 * drink finalization. If any assertion fails, the diagnostics will
 * mark the run as failed.
 */
export function runSelfTests() {
  const errs = [];
  const ok = (cond, msg) => {
    if (!cond) errs.push(msg);
  };
  try {
    // Verify inventory exists for gin
    const before = S.stock.gin;
    if (before === undefined) throw new Error("stock missing");
    ok(before >= 0, "stock exists");

    // Order spawning should add an order
    const n0 = S.orders.length;
    spawnOrder("gnt", 0.8);
    ok(S.orders.length === n0 + 1, "order spawn");

    // Test service flow: create a customer wanting a martini
    S.queue = [];
    const c = { id: "t1", desired: "martini" };
    S.queue = [c];
    beginService(c, 0.3);
    // Ensure required ingredients exist in stock
    MENU.martini.req.forEach(k => {
      S.stock[k] = Math.max(1, S.stock[k]);
    });
    // Select required ingredients
    S.service.sel = new Set(MENU.martini.req);
    ok(canMake("martini") === true, "can make martini");
    finalizeDrink();
    ok(!S.service, "finalize clears");
  } catch (e) {
    errs.push("runtime " + e.message);
  }
  S.diag.failed = errs.length > 0;
  S.diag.errors = errs;
}