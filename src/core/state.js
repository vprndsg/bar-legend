// global state and constants
export const MENU = {
  gnt:{key:'gnt',name:'Gin and Tonic',price:12,req:['gin','tonic'],opt:['lime']},
  martini:{key:'martini',name:'Martini',price:14,req:['gin','vermouth'],opt:['olive']},
  vsoda:{key:'vsoda',name:'Vodka Soda',price:10,req:['vodka','soda'],opt:['lime']}
};
export const ALL_ING=['gin','tonic','lime','vermouth','olive','vodka','soda'];
export const ING_NAME={gin:'Gin',tonic:'Tonic',lime:'Lime',vermouth:'Vermouth',olive:'Olive',vodka:'Vodka',soda:'Soda'};
export const COST={gin:3,tonic:1,lime:1,vermouth:2,olive:1,vodka:3,soda:1};

// map and world
export const MAP=[
"########################",
"#     ============     #",
"#     =          =     #",
"#     =    T     =    D#",
"#     =          =     #",
"#     ===========B=    #",
"#   L    t   M         #",
"#            P         #",
"#            P         #",
"########################"];
export const solids=new Set(["#","=","T","t"]);
export const npcNames={B:"Jules",L:"Mina",M:"Theo",P:"Customer"};
export const tile=32;

// canvas arena zones
export const Z={ door:{x:120,y:160}, queue:{x:180,y:180}, bar:{x:420,y:180} };

// unified state
export const S={
  day:1,time:0,money:320,karma:2,L:0,heat:0,authority:1,sales:0,
  trust:0,pride:0,compromise:0,debt:0,memory:0,
  mShift:8,mJ:10,mM:10,mT:10,
  upg:{prep:0,pos:0,train:0,amb:0},
  abil:{deesc:false,timebox:false},
  tel:{mins:[],Ls:[],heats:[],money:[],karma:[],morale:[],decisions:[],start:Date.now(),heatIntegral:0,LFromHeat:0,seededMoraleLoss:0},
  inputDelayMs:0,lastInputAt:0,

  stock:{ gin:4, tonic:6, lime:5, vermouth:3, olive:3, vodka:5, soda:6 },
  orders:[], selOrder:null, craftSel:new Set(), orderSpawnMs: 9000, orderTimer:0,

  running:false, paused:false, queue:[], nextSpawn:1.2,
  cooldowns:{greet:{cd:0,active:0}, check:{cd:0}, prio:{cd:0}, comp:{cd:0}, brk:{cd:0}},
  talk:null, service:null,

  player:{x:8.5,y:6.7,dir:1,spd:3},
  npcs:[],
  ui:{talk:[],svc:[],overlay:[]},

  diag:{failed:false,errors:[]},
  scenarioActive:true,
  shiftSec:360
};

// simple randoms
export const randRI=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
export const choice=arr=>arr[(Math.random()*arr.length)|0];
