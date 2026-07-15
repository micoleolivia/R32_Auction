// ============================================
// FIREBASE SETUP
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, deleteField }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyApfMg-55DRSjQcWtq4Ml2B1yGh3MvZ_TM",
  authDomain: "worldcup2026-a5bd7.firebaseapp.com",
  projectId: "worldcup2026-a5bd7",
  storageBucket: "worldcup2026-a5bd7.firebasestorage.app",
  messagingSenderId: "358912564554",
  appId: "1:358912564554:web:5ae46c7c186a4918f2b5b3"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ============================================
// PLAYERS
// ============================================
const PLAYERS = [
  { name: 'Micole',   icon: '🍓' },
  { name: 'Eve',      icon: '🍐' },
  { name: 'Zac',      icon: '🍎' },
  { name: 'Sean',     icon: '🍍' },
];

const STARTING_COINS = 120;
const MIN_BID         = 5;
const COUNTDOWN_SECONDS = 10;
const BID_SECONDS     = 20;
const REVEAL_SECONDS  = 10;

// ============================================
// ROUND OF 32 SLOTS
// ============================================
const slots = [
  { id:'s1',  name:'South Africa',    flag:'🇿🇦', confirmed:true,  group:'A' },
  { id:'s2',  name:'Canada',          flag:'🇨🇦', confirmed:true,  group:'B' },
  { id:'s3',  name:'Netherlands',     flag:'🇳🇱', confirmed:true,  group:'F' },
  { id:'s4',  name:'Morocco',         flag:'🇲🇦', confirmed:true,  group:'C' },
  { id:'s5',  name:'Germany',         flag:'🇩🇪', confirmed:true,  group:'E' },
  { id:'s6',  name:'Paraguay',        flag:'🇵🇾', confirmed:true,  group:'D' },
  { id:'s7',  name:'France',          flag:'🇫🇷', confirmed:true,  group:'I' },
  { id:'s8',  name:'Sweden',          flag:'🇸🇪', confirmed:true,  group:'F' },
  { id:'s9',  name:'Belgium',         flag:'🇧🇪', confirmed:true,  group:'G' },
  { id:'s10', name:'Senegal',         flag:'🇸🇳', confirmed:true,  group:'I' },
  { id:'s11', name:'USA',             flag:'🇺🇸', confirmed:true,  group:'D' },
  { id:'s12', name:'Bosnia & Herz.',  flag:'🇧🇦', confirmed:true,  group:'B' },
  { id:'s13', name:'Spain',           flag:'🇪🇸', confirmed:true,  group:'H' },
  { id:'s14', name:'Austria',         flag:'🇦🇹', confirmed:true,  group:'J' },
  { id:'s15', name:'Portugal',        flag:'🇵🇹', confirmed:true,  group:'K' },
  { id:'s16', name:'Croatia',         flag:'🇭🇷', confirmed:true,  group:'L' },
  { id:'s17', name:'Brazil',          flag:'🇧🇷', confirmed:true,  group:'C' },
  { id:'s18', name:'Japan',           flag:'🇯🇵', confirmed:true,  group:'F' },
  { id:'s19', name:'Ivory Coast',     flag:'🇨🇮', confirmed:true,  group:'E' },
  { id:'s20', name:'Norway',          flag:'🇳🇴', confirmed:true,  group:'I' },
  { id:'s21', name:'Mexico',          flag:'🇲🇽', confirmed:true,  group:'A' },
  { id:'s22', name:'Ecuador',         flag:'🇪🇨', confirmed:true,  group:'E' },
  { id:'s23', name:'England',         flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', confirmed:true,  group:'L' },
  { id:'s24', name:'DR Congo',        flag:'🇨🇩', confirmed:true,  group:'K' },
  { id:'s25', name:'Switzerland',     flag:'🇨🇭', confirmed:true,  group:'B' },
  { id:'s26', name:'Algeria',         flag:'🇩🇿', confirmed:true,  group:'J' },
  { id:'s27', name:'Colombia',        flag:'🇨🇴', confirmed:true,  group:'K' },
  { id:'s28', name:'Ghana',           flag:'🇬🇭', confirmed:true,  group:'L' },
  { id:'s29', name:'Australia',       flag:'🇦🇺', confirmed:true,  group:'D' },
  { id:'s30', name:'Egypt',           flag:'🇪🇬', confirmed:true,  group:'G' },
  { id:'s31', name:'Argentina',       flag:'🇦🇷', confirmed:true,  group:'J' },
  { id:'s32', name:'Cabo Verde',      flag:'🇨🇻', confirmed:true,  group:'K' },

]; 

const r32Matches = [
  { id:'r32-1',  slotA:'s1',  slotB:'s2'  },
  { id:'r32-2',  slotA:'s3',  slotB:'s4'  },
  { id:'r32-3',  slotA:'s5',  slotB:'s6'  },
  { id:'r32-4',  slotA:'s7',  slotB:'s8'  },
  { id:'r32-5',  slotA:'s9',  slotB:'s10' },
  { id:'r32-6',  slotA:'s11', slotB:'s12' },
  { id:'r32-7',  slotA:'s13', slotB:'s14' },
  { id:'r32-8',  slotA:'s15', slotB:'s16' },
  { id:'r32-9',  slotA:'s17', slotB:'s18' },
  { id:'r32-10', slotA:'s19', slotB:'s20' },
  { id:'r32-11', slotA:'s21', slotB:'s22' },
  { id:'r32-12', slotA:'s23', slotB:'s24' },
  { id:'r32-13', slotA:'s25', slotB:'s26' },
  { id:'r32-14', slotA:'s27', slotB:'s28' },
  { id:'r32-15', slotA:'s29', slotB:'s30' },
  { id:'r32-16', slotA:'s31', slotB:'s32' },
];

const r16Matches = [
  { id:'r16-1', slotA:'s2',  slotB:'s4'  },
  { id:'r16-2', slotA:'s7',  slotB:'s6'  },
  { id:'r16-3', slotA:'s11', slotB:'s9'  },
  { id:'r16-4', slotA:'s13', slotB:'s15' },
  { id:'r16-5', slotA:'s17', slotB:'s20' },
  { id:'r16-6', slotA:'s23', slotB:'s21' },
  { id:'r16-7', slotA:'s25', slotB:'s27' },
  { id:'r16-8', slotA:'s30', slotB:'s31' },
  { id:'r16-9', slotA:'s7', slotB:'s4' },
  { id:'r16-10', slotA:'s13', slotB:'s9' },
  { id:'r16-11', slotA:'s23', slotB:'s20' },
  { id:'r16-31', slotA:'s31', slotB:'s25' },
  { id:'r16-32', slotA:'s13', slotB:'s7' },
  { id:'r16-33', slotA:'s23', slotB:'s31' },


];

// ============================================
// STATE
// ============================================
let currentUser = null;
let state = {
  liveAuction: {
    status: 'not_started',
    matchIndex: 0,
    phaseStartedAt: null,
  },
  bids:         {},
  bidTimestamps:{},
  owners:       {},
  collection:   {},
  matchResults: {},
  slotOverrides:{},
  revealFeed:   [],
  r32Snapshot:  null,
};

let unsubscribe = null;
let tickInterval = null;
let lastRenderedKey = null;

// ============================================
// FIREBASE
// ============================================
async function saveToFirebase(data) {
  try {
    await setDoc(doc(db,'worldcup2026_r32','shared'), data, { merge:true });
  } catch(e) { showToast('Save failed','error'); }
}

async function loadFromFirebase() {
  try {
    const snap = await getDoc(doc(db,'worldcup2026_r32','shared'));
    return snap.exists() ? snap.data() : {};
  } catch(e) { return {}; }
}

function startLiveListener() {
  if (unsubscribe) unsubscribe();
  unsubscribe = onSnapshot(doc(db,'worldcup2026_r32','shared'), snap => {
    if (snap.exists()) {
      const d = snap.data();
      state.liveAuction   = d.liveAuction   || state.liveAuction;
      state.bids          = d.bids          || {};
      state.bidTimestamps = d.bidTimestamps || {};
      state.owners        = d.owners        || {};
      state.collection    = d.collection    || {};
      state.matchResults  = d.matchResults  || {};
      state.slotOverrides = d.slotOverrides || {};
      state.revealFeed    = d.revealFeed    || [];
      state.r32Snapshot   = d.r32Snapshot   || state.r32Snapshot;
      refreshAll();
    }
  });
}

function refreshAll() {
  updateHeader();
  if (!document.getElementById('auction').classList.contains('hidden'))     renderAuction();
  if (!document.getElementById('mypicks').classList.contains('hidden'))     renderMyPicks();
  if (!document.getElementById('leaderboard').classList.contains('hidden')) renderLeaderboard();
  if (!document.getElementById('results').classList.contains('hidden'))     renderResults();
}

// ============================================
// HELPERS
// ============================================
function getSlot(slotId) {
  const base = slots.find(s => s.id === slotId);
  if (!base) return null;
  const ov = state.slotOverrides[slotId];
  return ov ? { ...base, name:ov.name, flag:ov.flag, confirmed:true } : base;
}

function getCoinsSpent(username) {
  let spent = 0;
  Object.values(state.owners).forEach(o => { if (o.username === username) spent += o.coins; });
  return spent;
}

function getCoinsRemaining(username) {
  return STARTING_COINS - getCoinsSpent(username);
}

function getEffState() {
  return (currentUser !== 'Micole' && state.r32Snapshot) ? state.r32Snapshot : state;
}

function getCollection(username) {
  return getEffState().collection[username] || [];
}

function getTotalTeams(username) {
  return getCollection(username).length;
}

function getCurrentHolder(slotId) {
  for (const [username, col] of Object.entries(getEffState().collection)) {
    if (col.find(c => c.slotId === slotId)) return username;
  }
  return null;
}

function updateHeader() {
  const el = document.getElementById('welcome-msg');
  if (!el || !currentUser) return;
  const remaining = getCoinsRemaining(currentUser);
  const teams = getTotalTeams(currentUser);
  el.textContent = `${currentUser} · 💰 ${remaining} coins · ${teams} teams`;
}

// ============================================
// LOGIN / LOGOUT
// ============================================
async function login(name) {
  showLoading(true);
  const d = await loadFromFirebase();
  state.liveAuction   = d.liveAuction   || state.liveAuction;
  state.bids          = d.bids          || {};
  state.bidTimestamps = d.bidTimestamps || {};
  state.owners        = d.owners        || {};
  state.collection    = d.collection    || {};
  state.matchResults  = d.matchResults  || {};
  state.slotOverrides = d.slotOverrides || {};
  state.revealFeed    = d.revealFeed    || [];
  state.r32Snapshot   = d.r32Snapshot   || state.r32Snapshot;

  currentUser = name;
  const isAdmin = name === 'Micole';

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('reset-btn').classList.toggle('hidden', !isAdmin);
  document.getElementById('nav-results').classList.toggle('hidden', !isAdmin);
  document.getElementById('snapshot-btn').classList.toggle('hidden', !isAdmin);
  document.getElementById('unfreeze-btn').classList.toggle('hidden', !isAdmin);

  updateHeader();
  renderRules();
  renderAuction();
  renderMyPicks();
  renderLeaderboard();
  if (isAdmin) renderResults();

  showSection('leaderboard', { target: document.getElementById('nav-leaderboard') });
  startLiveListener();
  startTicker();
  showLoading(false);
}

function logout() {
  if (unsubscribe) unsubscribe();
  if (tickInterval) clearInterval(tickInterval);
  document.removeEventListener('visibilitychange', forceCatchUp);
  window.removeEventListener('focus', forceCatchUp);
  window.removeEventListener('pageshow', forceCatchUp);
  currentUser = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}
window.login  = login;
window.logout = logout;

// ============================================
// NAVIGATION
// ============================================
function showSection(id, e) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (e && e.target) e.target.classList.add('active');
  if (id === 'auction')     renderAuction();
  if (id === 'mypicks')     renderMyPicks();
  if (id === 'leaderboard') renderLeaderboard();
  if (id === 'results')     renderResults();
  if (id === 'trial')       initTrial();
}
window.showSection = showSection;

// ============================================
// LIVE AUCTION ENGINE
// ============================================
function startTicker() {
  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(() => {
    const auctionSection = document.getElementById('auction');
    if (auctionSection && !auctionSection.classList.contains('hidden')) {
      renderAuctionTimer();
      renderCountdownNumber();
      if (currentUser === 'Micole') checkPhaseTransition();
    }
  }, 1000);

  document.addEventListener('visibilitychange', forceCatchUp);
  window.addEventListener('focus', forceCatchUp);
  window.addEventListener('pageshow', forceCatchUp);
}

async function forceCatchUp() {
  if (document.visibilityState && document.visibilityState !== 'visible') return;
  if (!currentUser) return;
  lastRenderedKey = null;
  try {
    const fresh = await loadFromFirebase();
    state.liveAuction   = fresh.liveAuction   || state.liveAuction;
    state.bids          = fresh.bids          || state.bids;
    state.bidTimestamps = fresh.bidTimestamps || state.bidTimestamps;
    state.owners        = fresh.owners        || state.owners;
    state.collection    = fresh.collection    || state.collection;
    state.matchResults  = fresh.matchResults  || state.matchResults;
    state.slotOverrides = fresh.slotOverrides || state.slotOverrides;
    state.revealFeed    = fresh.revealFeed    || state.revealFeed;
    state.r32Snapshot   = fresh.r32Snapshot   || state.r32Snapshot;
  } catch(e) { /* listener will catch up shortly */ }
  refreshAll();
}

function getPhaseElapsedSeconds() {
  if (!state.liveAuction.phaseStartedAt) return 0;
  return (Date.now() - new Date(state.liveAuction.phaseStartedAt).getTime()) / 1000;
}

async function checkPhaseTransition() {
  const la = state.liveAuction;
  if (la.status === 'countdown') {
    if (getPhaseElapsedSeconds() >= COUNTDOWN_SECONDS) {
      state.liveAuction = { status:'bidding', matchIndex:0, phaseStartedAt:new Date().toISOString() };
      await saveToFirebase({ liveAuction: state.liveAuction });
      renderAuction();
    }
  } else if (la.status === 'bidding') {
    if (getPhaseElapsedSeconds() >= BID_SECONDS) {
      await closeBiddingPhase();
    }
  } else if (la.status === 'reveal') {
    if (getPhaseElapsedSeconds() >= REVEAL_SECONDS) {
      await advanceToNextMatch();
    }
  }
}

window.startLiveAuction = async function() {
  if (!confirm('Start the live auction? A 10 second countdown will begin for everyone right now!')) return;
  state.liveAuction = { status:'countdown', matchIndex:0, phaseStartedAt:new Date().toISOString() };
  await saveToFirebase({ liveAuction: state.liveAuction });
  showToast('⏳ Countdown started!','success');
  renderAuction();
};

async function closeBiddingPhase() {
  const la = state.liveAuction;
  const match = r32Matches[la.matchIndex];
  if (!match) return;

  [match.slotA, match.slotB].forEach(slotId => {
    if (state.owners[slotId]) return;
    const bids = state.bids[slotId] || {};
    const timestamps = (state.bidTimestamps && state.bidTimestamps[slotId]) || {};
    const entries = Object.entries(bids).sort(([userA,a],[userB,b]) => {
      if (b !== a) return b - a;
      return (timestamps[userA] || 0) - (timestamps[userB] || 0);
    });
    if (entries.length === 0) return;
    const [winner, coins] = entries[0];
    state.owners[slotId] = { username: winner, coins };
    if (!state.collection[winner]) state.collection[winner] = [];
    state.collection[winner].push({ slotId, how:'original' });
  });

  state.liveAuction = { ...la, status:'reveal', phaseStartedAt:new Date().toISOString() };
  await saveToFirebase({ liveAuction: state.liveAuction, owners: state.owners, collection: state.collection });
  renderAuction();
}

async function advanceToNextMatch() {
  const la = state.liveAuction;
  const nextIndex = la.matchIndex + 1;
  if (nextIndex >= r32Matches.length) {
    state.liveAuction = { ...la, status:'finished', phaseStartedAt:new Date().toISOString() };
    await saveToFirebase({ liveAuction: state.liveAuction });
    showToast('🏁 Live auction complete!','success');
  } else {
    state.liveAuction = { status:'bidding', matchIndex: nextIndex, phaseStartedAt:new Date().toISOString() };
    await saveToFirebase({ liveAuction: state.liveAuction });
  }
  renderAuction();
}

window.forceAdvance = async function() {
  const la = state.liveAuction;
  if (la.status === 'bidding') await closeBiddingPhase();
  else if (la.status === 'reveal') await advanceToNextMatch();
};

// ============================================
// RENDER LIVE AUCTION
// ============================================
function renderAuction() {
  const container = document.getElementById('auction-container');
  if (!container) return;
  const la = state.liveAuction;
  const isAdmin = currentUser === 'Micole';
  const renderKey = `${la.status}-${la.matchIndex}`;

  if (renderKey === lastRenderedKey && (la.status === 'bidding' || la.status === 'reveal')) {
    renderAuctionPhase();
    return;
  }
  if (renderKey === lastRenderedKey && la.status === 'countdown') {
    renderCountdownNumber();
    return;
  }
  lastRenderedKey = renderKey;

  if (la.status === 'not_started') {
    container.innerHTML = `
      <div class="live-waiting">
        <div class="live-waiting-icon">⏳</div>
        <div class="live-waiting-title">Waiting for the auction to start...</div>
        <div class="live-waiting-sub">💰 You have ${getCoinsRemaining(currentUser)} coins ready to bid</div>
        ${isAdmin ? `<button class="cta-btn" style="margin-top:24px" onclick="startLiveAuction()">🔥 Start Live Auction</button>` : ''}
      </div>`;
    return;
  }

  if (la.status === 'countdown') {
    container.innerHTML = `
      <div class="live-waiting">
        <div class="live-waiting-title" style="margin-bottom:4px">Get ready!</div>
        <div class="live-waiting-sub">The auction is about to begin</div>
        <div id="countdown-number" class="countdown-number">${COUNTDOWN_SECONDS}</div>
      </div>`;
    renderCountdownNumber();
    return;
  }

  if (la.status === 'finished') {
    container.innerHTML = `
      <div class="live-waiting">
        <div class="live-waiting-icon">🏁</div>
        <div class="live-waiting-title">Auction Complete!</div>
        <div class="live-waiting-sub">Check My Squad to see your teams</div>
      </div>`;
    return;
  }

  const match = r32Matches[la.matchIndex];
  const slotA = getSlot(match.slotA);
  const slotB = getSlot(match.slotB);

  container.innerHTML = `
    <div class="live-progress">Match ${la.matchIndex + 1} of ${r32Matches.length}</div>
    <div class="live-coins">💰 ${getCoinsRemaining(currentUser)} coins available</div>
    <div class="live-matchup">
      <div class="live-team">
        <div class="live-flag">${slotA?.flag}</div>
        <div class="live-name">${slotA?.name}</div>
        ${!slotA?.confirmed ? `<div class="live-placeholder">TBA: ${slots.find(s=>s.id===match.slotA)?.placeholder}</div>` : ''}
      </div>
      <div class="live-vs">VS</div>
      <div class="live-team">
        <div class="live-flag">${slotB?.flag}</div>
        <div class="live-name">${slotB?.name}</div>
        ${!slotB?.confirmed ? `<div class="live-placeholder">TBA: ${slots.find(s=>s.id===match.slotB)?.placeholder}</div>` : ''}
      </div>
    </div>
    <div id="live-timer-zone"></div>
    <div id="live-phase-zone"></div>
    ${isAdmin ? `<button class="bid-remove-btn" style="margin:20px auto;display:block" onclick="forceAdvance()">⏭ Force Advance (admin)</button>` : ''}
  `;

  renderAuctionTimer();
  renderAuctionPhase();
}

function renderAuctionTimer() {
  const zone = document.getElementById('live-timer-zone');
  if (!zone) return;
  const la = state.liveAuction;
  if (la.status !== 'bidding' && la.status !== 'reveal') return;

  const total = la.status === 'bidding' ? BID_SECONDS : REVEAL_SECONDS;
  const elapsed = getPhaseElapsedSeconds();
  const remaining = Math.max(0, Math.ceil(total - elapsed));
  const pct = Math.max(0, Math.min(100, (remaining/total)*100));

  zone.innerHTML = `
    <div class="live-timer-bar-wrap">
      <div class="live-timer-bar" style="width:${pct}%; background:${la.status==='bidding'?'var(--gold)':'var(--teal)'}"></div>
    </div>
    <div class="live-timer-num">${remaining}s</div>`;
}

function renderCountdownNumber() {
  const el = document.getElementById('countdown-number');
  if (!el) return;
  const la = state.liveAuction;
  if (la.status !== 'countdown') return;
  const elapsed = getPhaseElapsedSeconds();
  const remaining = Math.max(0, Math.ceil(COUNTDOWN_SECONDS - elapsed));
  el.textContent = remaining > 0 ? remaining : 'GO!';
}

function renderAuctionPhase() {
  const zone = document.getElementById('live-phase-zone');
  if (!zone) return;
  const la = state.liveAuction;
  const match = r32Matches[la.matchIndex];

  if (la.status === 'bidding') {
    const myBidAExisting = (state.bids[match.slotA]||{})[currentUser];
    const myBidBExisting = (state.bids[match.slotB]||{})[currentUser];
    const inputA = document.getElementById(`live-bid-${match.slotA}`);
    const inputB = document.getElementById(`live-bid-${match.slotB}`);
    const userIsTyping = (inputA && document.activeElement === inputA) || (inputB && document.activeElement === inputB);
    if (userIsTyping && myBidAExisting === undefined && myBidBExisting === undefined) return;

    const coinsLeft = getCoinsRemaining(currentUser);
    const myBidA = (state.bids[match.slotA]||{})[currentUser];
    const myBidB = (state.bids[match.slotB]||{})[currentUser];
    const slotA = getSlot(match.slotA);
    const slotB = getSlot(match.slotB);
    const hasBidOnEither = myBidA !== undefined || myBidB !== undefined;

    function buildBidBox(slot, slotId, myBid, otherBid) {
      if (myBid !== undefined) {
        return `<div class="live-bid-locked">✅ Bid locked: ${myBid} coins</div>
                <button class="bid-remove-btn" style="margin-top:8px;width:100%" onclick="switchLiveBid('${slotId}')">↺ Switch team</button>`;
      } else if (otherBid !== undefined) {
        return `<div class="live-bid-disabled">🚫 You've already bid on the other team</div>`;
      } else {
        return `<div class="bid-row"><input type="number" min="0" max="${coinsLeft}" id="live-bid-${slotId}" class="bid-input" placeholder="0"/>
                 <button class="bid-btn" onclick="lockLiveBid('${slotId}')">Lock 🔒</button></div>`;
      }
    }

    zone.innerHTML = `
      <div class="live-bid-title">🔒 Place your blind bid${hasBidOnEither ? ' — locked in!' : ''}</div>
      <div class="live-bid-grid">
        <div class="live-bid-box">
          <div class="live-bid-team">${slotA?.flag} ${slotA?.name}</div>
          ${buildBidBox(slotA, match.slotA, myBidA, myBidB)}
        </div>
        <div class="live-bid-box">
          <div class="live-bid-team">${slotB?.flag} ${slotB?.name}</div>
          ${buildBidBox(slotB, match.slotB, myBidB, myBidA)}
        </div>
      </div>
      <div class="live-bid-hint">Bids are blind — nobody can see what you bid. You can only back ONE team per match — choose wisely! Minimum bid is ${MIN_BID} coins (or 0 to skip this match).</div>`;
  } else if (la.status === 'reveal') {
    const slotA = getSlot(match.slotA);
    const slotB = getSlot(match.slotB);
    const ownerA = state.owners[match.slotA];
    const ownerB = state.owners[match.slotB];
    const myA = ownerA?.username === currentUser;
    const myB = ownerB?.username === currentUser;
    const myBidA = (state.bids[match.slotA]||{})[currentUser];
    const myBidB = (state.bids[match.slotB]||{})[currentUser];

    let resultHTML = '';
    [
      { slot: slotA, owner: ownerA, mine: myA, myBid: myBidA },
      { slot: slotB, owner: ownerB, mine: myB, myBid: myBidB },
    ].forEach(({ slot, owner, mine, myBid }) => {
      if (mine) {
        resultHTML += `<div class="live-result-row live-result-win">🎉 You won ${slot?.flag} ${slot?.name}! (${owner.coins} coins)</div>`;
      } else if (myBid !== undefined) {
        resultHTML += `<div class="live-result-row live-result-lose">❌ You lost ${slot?.flag} ${slot?.name}</div>`;
      } else {
        resultHTML += `<div class="live-result-row live-result-skip">⏭️ You didn't bid on ${slot?.flag} ${slot?.name}</div>`;
      }
    });

    const nextMatch = r32Matches[la.matchIndex+1];
    const nextHTML = nextMatch
      ? (() => { const nA=getSlot(nextMatch.slotA), nB=getSlot(nextMatch.slotB);
          return `<div class="live-next-preview">⏭️ Next up: ${nA?.flag} ${nA?.name} vs ${nB?.flag} ${nB?.name}</div>`; })()
      : `<div class="live-next-preview">🏁 That was the last match!</div>`;

    zone.innerHTML = `
      <div class="live-reveal-title">Results</div>
      ${resultHTML}
      <div class="live-balance">💰 ${getCoinsRemaining(currentUser)} coins remaining</div>
      ${nextHTML}`;
  }
}

window.lockLiveBid = async function(slotId) {
  const input = document.getElementById(`live-bid-${slotId}`);
  const amount = parseInt(input?.value);
  if (isNaN(amount) || amount < 0) { showToast('Enter a valid bid (0 or more)!','error'); return; }
  if (amount > 0 && amount < MIN_BID) { showToast(`Minimum bid is ${MIN_BID} coins (or 0 to skip)!`,'error'); return; }

  const match = r32Matches[state.liveAuction.matchIndex];
  const otherSlot = match.slotA === slotId ? match.slotB : match.slotA;
  const myOtherBid = (state.bids[otherSlot]||{})[currentUser];

  if (myOtherBid !== undefined) {
    showToast(`You've already bid on the other team! Switch first if you want to change.`,'error');
    return;
  }

  const coinsAvailable = getCoinsRemaining(currentUser);
  if (amount > coinsAvailable) { showToast(`Not enough coins! Only ${coinsAvailable} available.`,'error'); return; }

  if (!state.bids[slotId]) state.bids[slotId] = {};
  state.bids[slotId][currentUser] = amount;
  if (!state.bidTimestamps) state.bidTimestamps = {};
  if (!state.bidTimestamps[slotId]) state.bidTimestamps[slotId] = {};
  state.bidTimestamps[slotId][currentUser] = Date.now();
  await saveToFirebase({ bids: state.bids, bidTimestamps: state.bidTimestamps });
  showToast(`Bid locked: ${amount} coins 🔒`,'success');
  renderAuctionPhase();
};

window.switchLiveBid = async function(slotId) {
  if (!confirm('Switch teams? Your current bid will be cleared so you can bid on the other team instead.')) return;
  if (state.bids[slotId]) delete state.bids[slotId][currentUser];
  if (state.bidTimestamps && state.bidTimestamps[slotId]) delete state.bidTimestamps[slotId][currentUser];
  await saveToFirebase({ bids: state.bids, bidTimestamps: state.bidTimestamps });
  showToast('Bid cleared — pick your team!', '');
  renderAuctionPhase();
};

// ============================================
// ADMIN: PLACEHOLDER OVERRIDES
// ============================================
window.confirmSlotTeam = async function(slotId) {
  const name = document.getElementById(`override-name-${slotId}`)?.value?.trim();
  const flag = document.getElementById(`override-flag-${slotId}`)?.value?.trim() || '🏳️';
  if (!name) { showToast('Enter the team name!','error'); return; }
  if (!confirm(`Confirm this slot is ${flag} ${name}?`)) return;
  if (!state.slotOverrides) state.slotOverrides = {};
  state.slotOverrides[slotId] = { name, flag };
  await saveToFirebase({ slotOverrides: state.slotOverrides });
  showToast(`Slot updated to ${name}!`,'success');
  renderAuction();
};

// ============================================
// MY SQUAD
// ============================================
function renderMyPicks() {
  const container = document.getElementById('mypicks-container');
  if (!container) return;
  container.innerHTML = '';

  const myCol = getCollection(currentUser);
  const coinsSpent = getCoinsSpent(currentUser);
  const originalBought = Object.values(getEffState().owners).filter(o => o.username === currentUser).length;

  const summary = document.createElement('div');
  summary.className = 'squad-summary';
  summary.innerHTML = `
    <div class="squad-stat"><div class="squad-stat-val">💰 ${coinsSpent}</div><div class="squad-stat-lbl">coins spent</div></div>
    <div class="squad-stat"><div class="squad-stat-val">💰 ${getCoinsRemaining(currentUser)}</div><div class="squad-stat-lbl">coins left</div></div>
    <div class="squad-stat"><div class="squad-stat-val" style="color:var(--gold)">${originalBought}</div><div class="squad-stat-lbl">bought at auction</div></div>
    <div class="squad-stat"><div class="squad-stat-val" style="color:var(--teal)">${myCol.length}</div><div class="squad-stat-lbl">in squad now</div></div>
    <div class="squad-stat"><div class="squad-stat-val" style="color:var(--bet)">${myCol.filter(c=>c.how==='stolen'||c.how==='collected').length}</div><div class="squad-stat-lbl">stolen/collected</div></div>`;
  container.appendChild(summary);

  if (myCol.length === 0) {
    container.innerHTML += `<div class="squad-empty"><div style="font-size:2.5rem;margin-bottom:12px">🏴‍☠️</div><div style="font-weight:600;margin-bottom:6px">No teams yet!</div><div style="color:var(--text2);font-size:.88rem">Wait for the live auction to start.</div></div>`;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'squad-grid';
  myCol.forEach(({ slotId, how }) => {
    const slot = getSlot(slotId);
    const isEliminated = Object.values(getEffState().matchResults).some(r => r.loserSlot === slotId);
    const card = document.createElement('div');
    const squadCls = how === 'original' ? ' squad-original' : how === 'stolen' ? ' squad-stolen' : ' squad-collected';
    card.className = 'squad-card' + (isEliminated ? ' squad-eliminated' : '') + squadCls;
    const howLabel = how === 'original' ? '🟢 Bought' : how === 'stolen' ? '🟣 Stolen' : '🔵 Collected';
    card.innerHTML = `
      <div class="squad-flag">${slot?.flag||'🏳️'}</div>
      <div class="squad-name">${slot?.name||slotId}</div>
      <div class="squad-how">${howLabel}</div>
      ${isEliminated ? '<div class="squad-status eliminated">❌ Eliminated</div>' : '<div class="squad-status active">✅ Still in</div>'}`;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

// ============================================
// RESULTS (admin)
// ============================================
function renderResults() {
  const container = document.getElementById('results-container');
  if (!container) return;
  container.innerHTML = '';

  if (state.liveAuction.status !== 'finished') {
    container.innerHTML = `<div class="squad-empty"><div style="font-size:2.5rem;margin-bottom:12px">⏳</div><div style="font-weight:600">Auction still in progress</div><div style="color:var(--text2);font-size:.88rem;margin-top:6px">Results can be entered once the live auction finishes.</div></div>`;
    return;
  }

  const title = document.createElement('div');
  title.className = 'auction-section-title';
  title.textContent = 'Round of 32 Results';
  container.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'results-grid';

  [...r32Matches, ...r16Matches].forEach(match => {
    const slotA  = getSlot(match.slotA);
    const slotB  = getSlot(match.slotB);
    const result = state.matchResults[match.id];
    const card   = document.createElement('div');
    card.className = 'result-card';

    if (result) {
      const winner = getSlot(result.winnerSlot);
      const loser  = getSlot(result.loserSlot);
      card.innerHTML = `
        <div class="result-done">
          <div class="result-winner">✅ ${winner?.flag} ${winner?.name} won</div>
          <div class="result-loser">❌ ${loser?.flag} ${loser?.name} eliminated</div>
          <button class="bid-remove-btn" style="margin-top:8px" onclick="clearResult('${match.id}')">↩ Undo</button>
        </div>`;
    } else {
      card.innerHTML = `
        <div class="result-teams">
          <div class="result-team"><span>${slotA?.flag||'🏳️'} ${slotA?.name||'TBD'}</span></div>
          <div class="result-vs">VS</div>
          <div class="result-team"><span>${slotB?.flag||'🏳️'} ${slotB?.name||'TBD'}</span></div>
        </div>
        <div class="result-btns">
          <button class="result-pick-btn" onclick="recordResult('${match.id}','${match.slotA}','${match.slotB}')">${slotA?.flag||'🏳️'} ${slotA?.name||'?'} won</button>
          <button class="result-pick-btn" onclick="recordResult('${match.id}','${match.slotB}','${match.slotA}')">${slotB?.flag||'🏳️'} ${slotB?.name||'?'} won</button>
        </div>`;
    }
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

window.recordResult = async function(matchId, winnerSlot, loserSlot) {
  const winner = getSlot(winnerSlot);
  const loser  = getSlot(loserSlot);
  if (!confirm(`${winner?.name} beat ${loser?.name}?`)) return;

  const winnerHolder = getCurrentHolder(winnerSlot);
  const loserHolder  = getCurrentHolder(loserSlot);

  state.matchResults[matchId] = { winnerSlot, loserSlot, loserOriginalOwner: loserHolder || null };

  if (!state.revealFeed) state.revealFeed = [];
  const feedEntry = { matchId, ts: new Date().toISOString() };

  if (winnerHolder && loserHolder && winnerHolder === loserHolder) {
    state.collection[winnerHolder] = (state.collection[winnerHolder]||[]).filter(c => c.slotId !== loserSlot);
    feedEntry.kind = 'neutral';
    feedEntry.msg = `⚽ <strong>${winnerHolder}</strong> won an all-self matchup — ${winner?.name} beat their own ${loser?.name}. ${loser?.name} is eliminated.`;
    showToast(`${winner?.name} beat your own ${loser?.name} — eliminated`,'');
  } else if (winnerHolder) {
    if (loserHolder) {
      state.collection[loserHolder] = (state.collection[loserHolder]||[]).filter(c => c.slotId !== loserSlot);
      if (!state.collection[winnerHolder]) state.collection[winnerHolder] = [];
      state.collection[winnerHolder].push({ slotId: loserSlot, how:'stolen' });
      feedEntry.kind = 'steal';
      feedEntry.msg = `🔥 <strong>${winnerHolder}'s ${winner?.name}</strong> stole <strong>${loser?.name}</strong> from <strong>${loserHolder}</strong>!`;
      showToast(`${winnerHolder} stole ${loser?.name} from ${loserHolder}! 🔥`,'success');
    } else {
      if (!state.collection[winnerHolder]) state.collection[winnerHolder] = [];
      state.collection[winnerHolder].push({ slotId: loserSlot, how:'collected' });
      feedEntry.kind = 'collect';
      feedEntry.msg = `✅ <strong>${winnerHolder}'s ${winner?.name}</strong> collected unowned <strong>${loser?.name}</strong>!`;
      showToast(`${winnerHolder} collected ${loser?.name}! ✅`,'success');
    }
  } else if (loserHolder) {
    state.collection[loserHolder] = (state.collection[loserHolder]||[]).filter(c => c.slotId !== loserSlot);
    feedEntry.kind = 'loss';
    feedEntry.msg = `❌ Unowned ${winner?.name} eliminated <strong>${loserHolder}'s ${loser?.name}</strong> — team is gone, nobody gains it.`;
    showToast(`${loser?.name} eliminated — ${loserHolder} loses their team`,'');
  } else {
    feedEntry.kind = 'neutral';
    feedEntry.msg = `👻 ${winner?.name} beat ${loser?.name} — both unowned, nothing changes.`;
  }

  state.revealFeed.unshift(feedEntry);
  await saveToFirebase({ matchResults: state.matchResults, collection: state.collection, revealFeed: state.revealFeed });
  renderResults(); renderLeaderboard(); renderMyPicks();
};

window.clearResult = async function(matchId) {
  if (!confirm('Undo this result? Re-enter the correct result immediately after to keep squads accurate.')) return;
  const result = state.matchResults[matchId];
  if (!result) return;
  const { winnerSlot, loserSlot, loserOriginalOwner } = result;

  const currentHolderOfLoser = getCurrentHolder(loserSlot);
  if (currentHolderOfLoser) {
    state.collection[currentHolderOfLoser] = state.collection[currentHolderOfLoser].filter(c => c.slotId !== loserSlot);
  }
  if (loserOriginalOwner) {
    if (!state.collection[loserOriginalOwner]) state.collection[loserOriginalOwner] = [];
    state.collection[loserOriginalOwner].push({ slotId: loserSlot, how: 'original' });
  }

  delete state.matchResults[matchId];
  try {
    await setDoc(doc(db,'worldcup2026_r32','shared'), {
      matchResults: { [matchId]: deleteField() },
      collection: state.collection
    }, { merge: true });
  } catch(e) { showToast('Save failed','error'); return; }
  showToast('Result undone.','');
  renderResults();
  renderLeaderboard();
  renderMyPicks();
};

window.fixR16Undo = async function() {
  if (!confirm('Apply one-time fix for the broken R16 undo?')) return;
  if (!state.collection['Zac']) state.collection['Zac'] = [];
  if (!state.collection['Zac'].some(c => c.slotId === 's2')) {
    state.collection['Zac'].push({ slotId: 's2', how: 'original' });
  }
  if (state.collection['Micole']) {
    state.collection['Micole'] = state.collection['Micole'].filter(c => c.slotId !== 's6');
  }
  await saveToFirebase({ collection: state.collection });
  showToast('R16 undo fix applied!', 'success');
  renderLeaderboard(); renderMyPicks();
};

window.captureR32Snapshot = async function() {
  if (!confirm('Freeze everyone else\'s view at the current state? Only run this once, right before you start entering R16+ results.')) return;
  const snapshot = {
    collection: JSON.parse(JSON.stringify(state.collection)),
    matchResults: JSON.parse(JSON.stringify(state.matchResults)),
    owners: JSON.parse(JSON.stringify(state.owners)),
    revealFeed: JSON.parse(JSON.stringify(state.revealFeed)),
  };
  state.r32Snapshot = snapshot;
  await saveToFirebase({ r32Snapshot: snapshot });
  showToast('Snapshot captured — others are now frozen here.', 'success');
};

window.unfreezeR32Snapshot = async function() {
  if (!confirm('Unfreeze — let everyone see live R16+ results again?')) return;
  state.r32Snapshot = null;
  await saveToFirebase({ r32Snapshot: deleteField() });
  showToast('Unfrozen — everyone sees live results now.', 'success');
};

// ============================================
// LEADERBOARD
// ============================================
function getR32FinalCounts() {
  return [
    { name: 'Sean',   count: 12 },
    { name: 'Zac',    count: 8 },
    { name: 'Micole', count: 4 },
    { name: 'Eve',    count: 4 },
  ].sort((a, b) => b.count - a.count);
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  container.innerHTML = '';

  if (Object.keys(getEffState().owners).length > 0) {
    const r32Final = getR32FinalCounts();
    const r32Bar = document.createElement('div');
    r32Bar.className = 'r32-final-bar';
    r32Bar.innerHTML = `<span class="r32-final-label">Round 32 Final Standings:</span>` +
      r32Final.map(p => `<span class="r32-final-item">${p.name}: <strong>${p.count}</strong></span>`)
        .join('<span class="r32-final-sep">|</span>');
    container.appendChild(r32Bar);
  }
  const hasResults = Object.keys(getEffState().matchResults).length > 0;

  if (getEffState().revealFeed && getEffState().revealFeed.length > 0) {
    const feedTitle = document.createElement('div');
    feedTitle.className = 'auction-section-title';
    feedTitle.textContent = '📣 Reveal Feed';
    container.appendChild(feedTitle);

    const feedWrap = document.createElement('div');
    feedWrap.className = 'reveal-feed';
    feedWrap.id = 'reveal-feed-wrap';
    container.appendChild(feedWrap);
    renderRevealFeedItems(feedWrap, false);

    if (getEffState().revealFeed.length > 3) {
      const expandBtn = document.createElement('button');
      expandBtn.className = 'reveal-feed-expand-btn';
      expandBtn.textContent = `Show all ${getEffState().revealFeed.length} updates ▾`;
      expandBtn.onclick = () => toggleRevealFeed(feedWrap, expandBtn);
      container.appendChild(expandBtn);
    }

    const divider = document.createElement('div');
    divider.style.cssText = 'height:1px;background:var(--border);margin:28px 0;';
    container.appendChild(divider);
  }

  if (!hasResults) {
    const intro = document.createElement('div');
    intro.className = 'leaderboard-empty';
    intro.innerHTML = 'Ownership is secret! The leaderboard activates once real match results are entered.';
    container.appendChild(intro);

    PLAYERS.forEach((player, i) => {
      const row = document.createElement('div');
      row.className = 'leaderboard-row';
      row.innerHTML = `
        <div class="lb-position">${i+1}</div>
        <div class="lb-info">
          <div class="lb-name">${player.icon} ${player.name}</div>
          <div class="lb-type">Ownership hidden until matches are played</div>
        </div>
        <div>
          <div class="lb-points" style="color:var(--text3)">?</div>
          <div class="lb-pts-label">TEAMS</div>
        </div>`;
      container.appendChild(row);
    });
    return;
  }

  const revealedSlotIds = new Set();
  Object.values(getEffState().matchResults).forEach(r => {
    revealedSlotIds.add(r.winnerSlot);
    revealedSlotIds.add(r.loserSlot);
  });

  const revealedData = PLAYERS.map(p => {
    const col = getCollection(p.name);
    const knownTeams = col.filter(c => revealedSlotIds.has(c.slotId));
    return { ...p, known: knownTeams.length, knownTeams };
  }).sort((a,b) => b.known - a.known);

  const lbTitle = document.createElement('div');
  lbTitle.className = 'auction-section-title';
  lbTitle.textContent = '🏆 Standings';
  container.appendChild(lbTitle);

  const medals  = ['🥇','🥈','🥉','4️⃣','5️⃣'];
  const classes = ['first','second','third','',''];

  revealedData.forEach((player, i) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row ${classes[i]||''}`;

    const isElim = (slotId) => Object.values(getEffState().matchResults).some(r => r.loserSlot === slotId);

    const ownedBadges = player.knownTeams.filter(t => t.how === 'original').map(({ slotId }) => {
      const slot = getSlot(slotId);
      return `<span class="team-badge team-badge-green" style="${isElim(slotId)?'opacity:.4':''}">${slot?.flag||'🏳️'} ${slot?.name||slotId}</span>`;
    }).join('');

    const stolenBadges = player.knownTeams.filter(t => t.how === 'stolen').map(({ slotId }) => {
      const slot = getSlot(slotId);
      return `<span class="team-badge team-badge-purple" style="${isElim(slotId)?'opacity:.4':''}">${slot?.flag||'🏳️'} ${slot?.name||slotId}</span>`;
    }).join('');

    const collectedBadges = player.knownTeams.filter(t => t.how === 'collected').map(({ slotId }) => {
      const slot = getSlot(slotId);
      return `<span class="team-badge team-badge-blue" style="${isElim(slotId)?'opacity:.4':''}">${slot?.flag||'🏳️'} ${slot?.name||slotId}</span>`;
    }).join('');

    row.innerHTML = `
      <div class="lb-position">${medals[i]}</div>
      <div class="lb-info">
        <div class="lb-name">${player.icon} ${player.name}</div>
        <div class="lb-type">As games are played, teams will be reallocated.</div>
        ${ownedBadges ? `<div class="lb-teams"><span class="lb-teams-label">🟢 Owned:</span>${ownedBadges}</div>` : ''}
        ${stolenBadges ? `<div class="lb-teams"><span class="lb-teams-label">🟣 Stolen:</span>${stolenBadges}</div>` : ''}
        ${collectedBadges ? `<div class="lb-teams"><span class="lb-teams-label">🔵 Collected:</span>${collectedBadges}</div>` : ''}
      </div>
      <div>
        <div class="lb-points" style="color:var(--gold)">${player.known}</div>
        <div class="lb-pts-label">TEAMS</div>
      </div>`;
    container.appendChild(row);
  });

  const graveyardEntries = [];
  Object.entries(getEffState().matchResults).forEach(([matchId, result]) => {
    const loserSlot = result.loserSlot;
    const originalOwner = result.loserOriginalOwner || getEffState().owners[loserSlot]?.username || null;
    const currentlyHeld = getCurrentHolder(loserSlot);
    if (originalOwner && !currentlyHeld) {
      graveyardEntries.push({ slot: getSlot(loserSlot), originalOwner });
    }
    if (!originalOwner && !getCurrentHolder(result.winnerSlot) && !currentlyHeld) {
      graveyardEntries.push({ slot: getSlot(loserSlot), originalOwner: null });
    }
  });

  if (graveyardEntries.length > 0) {
    const gDivider = document.createElement('div');
    gDivider.style.cssText = 'height:1px;background:var(--border);margin:28px 0;';
    container.appendChild(gDivider);

    const gTitle = document.createElement('div');
    gTitle.className = 'auction-section-title';
    gTitle.style.color = 'var(--text3)';
    gTitle.textContent = '💀 Graveyard';
    container.appendChild(gTitle);

    const gSubtitle = document.createElement('div');
    gSubtitle.style.cssText = 'font-size:.78rem;color:var(--text3);margin-bottom:14px;';
    gSubtitle.textContent = 'These teams were knocked out by an unowned team and nobody gained them.';
    container.appendChild(gSubtitle);

    const gGrid = document.createElement('div');
    gGrid.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;';
    graveyardEntries.forEach(({ slot, originalOwner }) => {
      const badge = document.createElement('span');
      badge.className = 'graveyard-badge';
      badge.innerHTML = originalOwner
        ? `${slot?.flag||'🏳️'} ${slot?.name||'?'} <span class="graveyard-owner">· was ${originalOwner}'s</span>`
        : `${slot?.flag||'🏳️'} ${slot?.name||'?'} <span class="graveyard-owner">· unowned</span>`;
      gGrid.appendChild(badge);
    });
    container.appendChild(gGrid);
  }

  const unclaimedWinnerIds = new Set();
  const eliminatedSlotIds = new Set();
  Object.values(getEffState().matchResults).forEach(result => {
    unclaimedWinnerIds.add(result.winnerSlot);
    eliminatedSlotIds.add(result.loserSlot);
  });
  const unclaimedEntries = [...unclaimedWinnerIds]
    .filter(slotId => !getCurrentHolder(slotId) && !eliminatedSlotIds.has(slotId))
    .map(slotId => ({ slot: getSlot(slotId) }));

  if (unclaimedEntries.length > 0) {
    const uDivider = document.createElement('div');
    uDivider.style.cssText = 'height:1px;background:var(--border);margin:28px 0;';
    container.appendChild(uDivider);

    const uTitle = document.createElement('div');
    uTitle.className = 'auction-section-title';
    uTitle.style.color = 'var(--teal)';
    uTitle.textContent = '👑 Unclaimed Survivors';
    container.appendChild(uTitle);

    const uSubtitle = document.createElement('div');
    uSubtitle.style.cssText = 'font-size:.78rem;color:var(--text3);margin-bottom:14px;';
    uSubtitle.textContent = 'These are the teams that made it through that you did not believe in!';
    container.appendChild(uSubtitle);

    const uGrid = document.createElement('div');
    uGrid.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;';
    unclaimedEntries.forEach(({ slot }) => {
      const badge = document.createElement('span');
      badge.className = 'graveyard-badge';
      badge.style.cssText = 'border-color:rgba(0,212,170,.3);color:var(--teal);';
      badge.innerHTML = `${slot?.flag||'🏳️'} ${slot?.name||'?'} <span class="graveyard-owner" style="color:var(--teal);opacity:.7">· unclaimed</span>`;
      uGrid.appendChild(badge);
    });
    container.appendChild(uGrid);
  }
}

function renderRevealFeedItems(wrap, showAll) {
  wrap.innerHTML = '';
  const items = showAll ? getEffState().revealFeed : getEffState().revealFeed.slice(0, 3);
  items.forEach(entry => {
    const item = document.createElement('div');
    item.className = `reveal-feed-item reveal-feed-${entry.kind || 'neutral'}`;
    const ts = new Date(entry.ts);
    const timeStr = ts.toLocaleDateString('en-ZA',{day:'numeric',month:'short'}) + ' · ' + ts.toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});
    item.innerHTML = `<div class="reveal-feed-msg">${entry.msg}</div><div class="reveal-feed-time">${timeStr}</div>`;
    wrap.appendChild(item);
  });
}

function toggleRevealFeed(wrap, btn) {
  const isExpanded = btn.dataset.expanded === 'true';
  renderRevealFeedItems(wrap, !isExpanded);
  btn.dataset.expanded = (!isExpanded).toString();
  btn.textContent = !isExpanded ? 'Show less ▴' : `Show all ${getEffState().revealFeed.length} updates ▾`;
}

// ============================================
// TRIAL RUN
// ============================================
const TRIAL_BOT_NAMES = ['Bot Eve', 'Bot Zac', 'Bot Sean', 'Bot Patricia'];
const TRIAL_MATCHES = [
  { id:'t1', teamA:{ name:'Brazil', flag:'🇧🇷' },   teamB:{ name:'Croatia', flag:'🇭🇷' } },
  { id:'t2', teamA:{ name:'Argentina', flag:'🇦🇷' }, teamB:{ name:'Japan', flag:'🇯🇵' } },
  { id:'t3', teamA:{ name:'Portugal', flag:'🇵🇹' },  teamB:{ name:'Senegal', flag:'🇸🇳' } },
];
const TRIAL_BID_SECONDS    = 20;
const TRIAL_REVEAL_SECONDS = 10;

let trial = null;
let trialTickInterval = null;

function initTrial() {
  if (trial) { renderTrial(); return; }
  renderTrialLanding();
}

function renderTrialLanding() {
  const container = document.getElementById('trial-container');
  if (!container) return;
  if (trialTickInterval) clearInterval(trialTickInterval);
  container.innerHTML = `
    <div class="live-waiting">
      <div class="live-waiting-icon"></div>
      <div class="live-waiting-title">Ready to practice?</div>
      <div class="live-waiting-sub" style="max-width:420px;margin:0 auto">3 sample matches, 100 practice coins, 4 simulated bidders. Replay as many times as you like, nothing here counts toward the real game.</div>
      <div class="trial-disclaimer">⚠️ On the real auction day, the live auction will only be started by the admin (Micole), not by each player individually.</div>
      <button class="cta-btn" style="margin-top:20px" onclick="startTrial()">▶ Start Practice Run</button>
    </div>`;
}

function startTrial() {
  if (trialTickInterval) clearInterval(trialTickInterval);
  trial = {
    coins: 100, matchIndex: 0, phase: 'bidding',
    phaseStartedAt: Date.now(), myBid: null,
    botBids: {}, owners: [], history: [],
  };
  generateTrialBotBids();
  trialTickInterval = setInterval(trialTick, 1000);
  renderTrial();
}
window.startTrial = startTrial;

function generateTrialBotBids() {
  trial.botBids = { A: [], B: [] };
  TRIAL_BOT_NAMES.forEach(name => {
    if (Math.random() < 0.75) {
      const side = Math.random() < 0.5 ? 'A' : 'B';
      trial.botBids[side].push({ name, amount: Math.floor(Math.random() * 35) + 5 });
    }
  });
}

function trialTick() {
  const trialSection = document.getElementById('trial');
  if (!trialSection || trialSection.classList.contains('hidden')) return;
  if (!trial || trial.phase === 'finished') return;
  renderTrialTimer();
  const total = trial.phase === 'bidding' ? TRIAL_BID_SECONDS : TRIAL_REVEAL_SECONDS;
  const elapsed = (Date.now() - trial.phaseStartedAt) / 1000;
  if (elapsed >= total) {
    if (trial.phase === 'bidding') closeTrialBidding();
    else advanceTrialMatch();
  }
}

function closeTrialBidding() {
  const match = TRIAL_MATCHES[trial.matchIndex];
  ['A','B'].forEach(slot => {
    const allBids = [...trial.botBids[slot]];
    if (trial.myBid && trial.myBid.slot === slot) allBids.push({ name:'me', amount: trial.myBid.amount });
    if (allBids.length === 0) { trial.owners.push({ matchId: match.id, slot, team: match[`team${slot}`], who: null }); return; }
    allBids.sort((a,b) => b.amount - a.amount);
    const winner = allBids[0];
    if (winner.name === 'me') trial.coins -= winner.amount;
    trial.owners.push({ matchId: match.id, slot, team: match[`team${slot}`], who: winner.name, amount: winner.amount });
  });
  trial.phase = 'reveal';
  trial.phaseStartedAt = Date.now();
  renderTrial();
}

function advanceTrialMatch() {
  const nextIndex = trial.matchIndex + 1;
  if (nextIndex >= TRIAL_MATCHES.length) { trial.phase = 'finished'; renderTrial(); return; }
  trial.matchIndex = nextIndex;
  trial.phase = 'bidding';
  trial.phaseStartedAt = Date.now();
  trial.myBid = null;
  generateTrialBotBids();
  renderTrial();
}

window.lockTrialBid = function(slot) {
  const input = document.getElementById(`trial-bid-${slot}`);
  const amount = parseInt(input?.value);
  if (isNaN(amount) || amount < 0) { showToast('Enter a valid bid (0 or more)!','error'); return; }
  if (amount > 0 && amount < MIN_BID) { showToast(`Minimum bid is ${MIN_BID} coins (or 0 to skip)!`,'error'); return; }
  if (amount > trial.coins) { showToast(`Not enough coins! Only ${trial.coins} available.`,'error'); return; }
  trial.myBid = { slot, amount };
  showToast(`Practice bid locked: ${amount} coins 🔒`,'success');
  renderTrialPhase();
};

window.switchTrialBid = function() {
  trial.myBid = null;
  showToast('Bid cleared — pick your team!', '');
  renderTrialPhase();
};

function renderTrial() {
  const container = document.getElementById('trial-container');
  if (!container) return;

  if (trial.phase === 'finished') {
    const myTeams = trial.owners.filter(o => o.who === 'me');
    container.innerHTML = `
      <div class="live-waiting">
        <div class="live-waiting-icon">🏁</div>
        <div class="live-waiting-title">Trial Complete!</div>
        <div class="live-waiting-sub">You ended up with ${myTeams.length} team${myTeams.length === 1 ? '' : 's'} and ${trial.coins} coins left</div>
        ${myTeams.length > 0 ? `<div class="trial-summary-teams">${myTeams.map(t => `<span class="team-badge team-badge-green">${t.team.flag} ${t.team.name}</span>`).join('')}</div>` : ''}
        <button class="cta-btn" style="margin-top:24px" onclick="startTrial()">🔁 Replay Trial</button>
      </div>`;
    return;
  }

  const match = TRIAL_MATCHES[trial.matchIndex];
  container.innerHTML = `
    <div class="live-progress">Practice Match ${trial.matchIndex + 1} of ${TRIAL_MATCHES.length}</div>
    <div class="live-coins">💰 ${trial.coins} coins available</div>
    <div class="live-matchup">
      <div class="live-team"><div class="live-flag">${match.teamA.flag}</div><div class="live-name">${match.teamA.name}</div></div>
      <div class="live-vs">VS</div>
      <div class="live-team"><div class="live-flag">${match.teamB.flag}</div><div class="live-name">${match.teamB.name}</div></div>
    </div>
    <div id="trial-timer-zone"></div>
    <div id="trial-phase-zone"></div>
    <button class="bid-remove-btn" style="margin:20px auto;display:block" onclick="forceAdvanceTrial()">⏭ Skip ahead (practice only)</button>
  `;
  renderTrialTimer();
  renderTrialPhase();
}

window.forceAdvanceTrial = function() {
  if (trial.phase === 'bidding') closeTrialBidding();
  else advanceTrialMatch();
};

function renderTrialTimer() {
  const zone = document.getElementById('trial-timer-zone');
  if (!zone || !trial) return;
  const total = trial.phase === 'bidding' ? TRIAL_BID_SECONDS : TRIAL_REVEAL_SECONDS;
  const elapsed = (Date.now() - trial.phaseStartedAt) / 1000;
  const remaining = Math.max(0, Math.ceil(total - elapsed));
  const pct = Math.max(0, Math.min(100, (remaining/total)*100));
  zone.innerHTML = `
    <div class="live-timer-bar-wrap"><div class="live-timer-bar" style="width:${pct}%; background:${trial.phase==='bidding'?'var(--gold)':'var(--teal)'}"></div></div>
    <div class="live-timer-num">${remaining}s</div>`;
}

function renderTrialPhase() {
  const zone = document.getElementById('trial-phase-zone');
  if (!zone || !trial) return;
  const match = TRIAL_MATCHES[trial.matchIndex];

  if (trial.phase === 'bidding') {
    const inputA = document.getElementById('trial-bid-A');
    const inputB = document.getElementById('trial-bid-B');
    const userIsTyping = (inputA && document.activeElement === inputA) || (inputB && document.activeElement === inputB);
    if (userIsTyping && !trial.myBid) return;

    function box(slot) {
      if (trial.myBid && trial.myBid.slot === slot) {
        return `<div class="live-bid-locked">✅ Bid locked: ${trial.myBid.amount} coins</div>
                <button class="bid-remove-btn" style="margin-top:8px;width:100%" onclick="switchTrialBid()">↺ Switch team</button>`;
      } else if (trial.myBid && trial.myBid.slot !== slot) {
        return `<div class="live-bid-disabled">🚫 You've already bid on the other team</div>`;
      } else {
        return `<div class="bid-row"><input type="number" min="0" max="${trial.coins}" id="trial-bid-${slot}" class="bid-input" placeholder="0"/>
                 <button class="bid-btn" onclick="lockTrialBid('${slot}')">Lock 🔒</button></div>`;
      }
    }

    zone.innerHTML = `
      <div class="live-bid-title">🔒 Place your practice bid${trial.myBid ? ' — locked in!' : ''}</div>
      <div class="live-bid-grid">
        <div class="live-bid-box"><div class="live-bid-team">${match.teamA.flag} ${match.teamA.name}</div>${box('A')}</div>
        <div class="live-bid-box"><div class="live-bid-team">${match.teamB.flag} ${match.teamB.name}</div>${box('B')}</div>
      </div>
      <div class="live-bid-hint">This is practice, bids are blind here too, against 4 simulated bidders. You can only back ONE team per match. Minimum bid is ${MIN_BID} coins (or 0 to skip).</div>`;
  } else if (trial.phase === 'reveal') {
    const resultsForMatch = trial.owners.filter(o => o.matchId === match.id);
    let resultHTML = '';
    resultsForMatch.forEach(({ slot, team, who, amount }) => {
      if (who === 'me') {
        resultHTML += `<div class="live-result-row live-result-win">🎉 You won ${team.flag} ${team.name}! (${amount} coins)</div>`;
      } else if (trial.myBid && trial.myBid.slot === slot) {
        resultHTML += `<div class="live-result-row live-result-lose">❌ You lost ${team.flag} ${team.name}</div>`;
      } else {
        resultHTML += `<div class="live-result-row live-result-skip">⏭️ You didn't bid on ${team.flag} ${team.name}</div>`;
      }
    });
    const nextMatch = TRIAL_MATCHES[trial.matchIndex+1];
    const nextHTML = nextMatch
      ? `<div class="live-next-preview">⏭️ Next up: ${nextMatch.teamA.flag} ${nextMatch.teamA.name} vs ${nextMatch.teamB.flag} ${nextMatch.teamB.name}</div>`
      : `<div class="live-next-preview">🏁 That was the last practice match!</div>`;
    zone.innerHTML = `
      <div class="live-reveal-title">Results</div>
      ${resultHTML}
      <div class="live-balance">💰 ${trial.coins} coins remaining</div>
      ${nextHTML}`;
  }
}

// ============================================
// RULES
// ============================================
function renderRules() {
  const container = document.getElementById('rules-container');
  if (!container) return;
  container.innerHTML = `
    <div class="rules-block">
      <h3>World Cup 2026 — Round of 32 Auction: How It Works</h3>
      <h3 style="margin-top:16px">The Auction Itself</h3>
      <p>🏆 You start with <strong>120 coins</strong>.</p>
      <p>🏆 For each of the matches, you get ${BID_SECONDS} seconds to blind-bid on ONE of the two teams (never both).</p>
      <p>🏆 Minimum bid is ${MIN_BID} coins.</p>
      <p>🏆 Bidding is blind — you can't see anyone else's bid. Highest bid wins. Ties go to whoever locked in first.</p>
      <p>🏆 Once bidding closes, you see your own outcome for ${REVEAL_SECONDS} seconds (won or lost), then it moves straight to the next match.</p>
      <p>🏆 You only ever see your own result — ownership stays secret until that team actually plays in the real World Cup. That's when the big reveal happens (who stole what from whom).</p>
      <p>🏆 After the auction, there's nothing more to do — the system takes it from there. You just watch your teams steal or get stolen from as real matches are played.</p>
    </div>
    <div class="rules-block">
      <h3>How You Gain or Lose Teams After the Auction</h3>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">Steal</span> Your team beats someone's owned team → you steal that team from them.</div>
        <div class="rules-score-row"><span class="score-badge gold">Collect</span> Your team beats an unowned team → you collect it.</div>
        <div class="rules-score-row"><span class="score-badge neutral">Lose to an owned team</span> Your team loses to someone's owned team → they steal your team from you.</div>
        <div class="rules-score-row"><span class="score-badge neutral">Lose to an unowned team</span> Your team loses to an unowned team → that team just disappears, belongs to no one.</div>
      </div>
    </div>
    <div class="rules-block">
      <h3>💡 Strategy Tip</h3>
      <p>More teams = more chances to steal (or be stolen from) and climb the leaderboard. Spreading your coins across several teams gives you more shots, but going all-in on one team is also a valid (riskier) strategy.</p>
    </div>
    <div class="rules-block" style="border-color:rgba(245,197,24,.4);background:rgba(245,197,24,.04)">
      <h3>Trial Run</h3>
      <p>There's a <strong>Trial Run</strong> tab with 3 sample matches against simulated bidders — replay as many times as you like to get comfortable before the real auction.</p>
    </div>`;
}

// ============================================
// LOADING, TOAST, RESET
// ============================================
function showLoading(show) {
  let overlay = document.getElementById('loading-overlay');
  if (show && !overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-text">Loading...</div>`;
    document.body.appendChild(overlay);
  } else if (!show && overlay) {
    overlay.remove();
  }
}

function showToast(msg, type='') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

async function resetEverything() {
  if (!confirm('⚠️ RESET ALL AUCTION DATA?')) return;
  if (!confirm('100% sure?')) return;
  showLoading(true);
  const fresh = {
    liveAuction: { status:'not_started', matchIndex:0, phaseStartedAt:null },
    bids:{}, bidTimestamps:{}, owners:{}, collection:{}, matchResults:{}, slotOverrides:{}, revealFeed:[]
  };
  await setDoc(doc(db,'worldcup2026_r32','shared'), fresh);
  state = fresh;
  showLoading(false);
  showToast('🗑️ All data reset!','success');
  renderAuction(); renderMyPicks(); renderLeaderboard(); updateHeader();
}
window.resetEverything = resetEverything;
