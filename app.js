// ============================================
// FIREBASE SETUP
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot }
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
  { name: 'Micole',   icon: '🐻' },
  { name: 'Mom',      icon: '🦒' },
  { name: 'Zac',      icon: '🦥' },
  { name: 'Sean',     icon: '🦅' },
  { name: 'Patricia', icon: '🦩' },
];

const STARTING_COINS = 100;
const BID_SECONDS     = 25;  // blind bid window
const REVEAL_SECONDS  = 15;  // result + next match preview window

// ============================================
// ROUND OF 32 SLOTS
// ============================================
const slots = [
  { id:'s1',  name:'Brazil',            flag:'🇧🇷', confirmed:true,  group:'C' },
  { id:'s2',  name:'France',            flag:'🇫🇷', confirmed:true,  group:'I' },
  { id:'s3',  name:'Argentina',         flag:'🇦🇷', confirmed:true,  group:'J' },
  { id:'s4',  name:'England',           flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', confirmed:true,  group:'L' },
  { id:'s5',  name:'Spain',             flag:'🇪🇸', confirmed:true,  group:'H' },
  { id:'s6',  name:'Germany',           flag:'🇩🇪', confirmed:true,  group:'E' },
  { id:'s7',  name:'Portugal',          flag:'🇵🇹', confirmed:true,  group:'K' },
  { id:'s8',  name:'Netherlands',       flag:'🇳🇱', confirmed:true,  group:'F' },
  { id:'s9',  name:'Belgium',           flag:'🇧🇪', confirmed:true,  group:'G' },
  { id:'s10', name:'Uruguay',           flag:'🇺🇾', confirmed:true,  group:'H' },
  { id:'s11', name:'USA',               flag:'🇺🇸', confirmed:true,  group:'D' },
  { id:'s12', name:'Canada',            flag:'🇨🇦', confirmed:true,  group:'B' },
  { id:'s13', name:'Mexico',            flag:'🇲🇽', confirmed:true,  group:'A' },
  { id:'s14', name:'Morocco',           flag:'🇲🇦', confirmed:true,  group:'C' },
  { id:'s15', name:'Japan',             flag:'🇯🇵', confirmed:true,  group:'F' },
  { id:'s16', name:'Senegal',           flag:'🇸🇳', confirmed:true,  group:'I' },
  { id:'s17', name:'Colombia',          flag:'🇨🇴', confirmed:true,  group:'K' },
  { id:'s18', name:'Ecuador',           flag:'🇪🇨', confirmed:true,  group:'E' },
  { id:'s19', name:'Croatia',           flag:'🇭🇷', confirmed:true,  group:'L' },
  { id:'s20', name:'South Korea',       flag:'🇰🇷', confirmed:true,  group:'A' },
  { id:'s21', name:'Switzerland',       flag:'🇨🇭', confirmed:true,  group:'B' },
  { id:'s22', name:'Austria',           flag:'🇦🇹', confirmed:true,  group:'J' },
  { id:'s23', name:'Norway',            flag:'🇳🇴', confirmed:true,  group:'I' },
  { id:'s24', name:'Türkiye',           flag:'🇹🇷', confirmed:true,  group:'D' },
  { id:'s25', name:'DR Congo',          flag:'🇨🇩', confirmed:true,  group:'K' },
  { id:'s26', name:'Group A Runner-up', flag:'🏳️', confirmed:false, placeholder:'South Africa or Czechia',  group:'A' },
  { id:'s27', name:'Group B Runner-up', flag:'🏳️', confirmed:false, placeholder:'Bosnia & Herz. or Qatar', group:'B' },
  { id:'s28', name:'Group D Runner-up', flag:'🏳️', confirmed:false, placeholder:'Australia or Paraguay',   group:'D' },
  { id:'s29', name:'Group E Runner-up', flag:'🏳️', confirmed:false, placeholder:'Ivory Coast or Curaçao',  group:'E' },
  { id:'s30', name:'Group F Runner-up', flag:'🏳️', confirmed:false, placeholder:'Sweden or Tunisia',       group:'F' },
  { id:'s31', name:'Group G Runner-up', flag:'🏳️', confirmed:false, placeholder:'Egypt or Iran',           group:'G' },
  { id:'s32', name:'Group L Runner-up', flag:'🏳️', confirmed:false, placeholder:'Ghana or Panama',         group:'L' },
];

// Each match opens TWO simultaneous blind slot-auctions (one per team)
const r32Matches = [
  { id:'r32-1',  slotA:'s1',  slotB:'s26' },
  { id:'r32-2',  slotA:'s13', slotB:'s20' },
  { id:'r32-3',  slotA:'s12', slotB:'s21' },
  { id:'r32-4',  slotA:'s27', slotB:'s2'  },
  { id:'r32-5',  slotA:'s14', slotB:'s4'  },
  { id:'r32-6',  slotA:'s19', slotB:'s32' },
  { id:'r32-7',  slotA:'s11', slotB:'s24' },
  { id:'r32-8',  slotA:'s28', slotB:'s6'  },
  { id:'r32-9',  slotA:'s18', slotB:'s29' },
  { id:'r32-10', slotA:'s31', slotB:'s9'  },
  { id:'r32-11', slotA:'s15', slotB:'s30' },
  { id:'r32-12', slotA:'s8',  slotB:'s16' },
  { id:'r32-13', slotA:'s5',  slotB:'s10' },
  { id:'r32-14', slotA:'s23', slotB:'s3'  },
  { id:'r32-15', slotA:'s7',  slotB:'s17' },
  { id:'r32-16', slotA:'s25', slotB:'s22' },
];

// ============================================
// STATE
// ============================================
let currentUser = null;
let state = {
  // Live auction engine state
  liveAuction: {
    status: 'not_started',  // 'not_started' | 'bidding' | 'reveal' | 'finished'
    matchIndex: 0,           // which match in r32Matches we're on
    phaseStartedAt: null,    // ISO timestamp when current phase began
  },
  bids:         {},  // bids[slotId][username] = amount  (blind — only revealed after window closes)
  bidTimestamps:{},  // bidTimestamps[slotId][username] = Date.now() when locked — breaks ties
  owners:       {},  // owners[slotId] = { username, coins }
  collection:   {},  // collection[username] = [{ slotId, how:'original'|'stolen'|'collected' }]
  matchResults: {},  // matchResults[matchId] = { winnerSlot, loserSlot }
  slotOverrides:{},  // slotOverrides[slotId] = { name, flag }
  revealFeed:   [],  // [{ matchId, ts, msg }] — public feed of what's been revealed so far
};

let unsubscribe = null;
let tickInterval = null;
let lastRenderedKey = null;  // tracks matchIndex+status to avoid redundant full re-renders

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

function getCollection(username) {
  return state.collection[username] || [];
}

function getTotalTeams(username) {
  return getCollection(username).length;
}

function getCurrentHolder(slotId) {
  for (const [username, col] of Object.entries(state.collection)) {
    if (col.find(c => c.slotId === slotId)) return username;
  }
  return null;
}

function updateHeader() {
  const el = document.getElementById('welcome-msg');
  if (!el || !currentUser) return;
  const remaining = getCoinsRemaining(currentUser);
  const teams = getTotalTeams(currentUser);
  el.textContent = `${currentUser} · 🪙 ${remaining} coins · 🏳️ ${teams} teams`;
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

  currentUser = name;
  const isAdmin = name === 'Micole';

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('reset-btn').classList.toggle('hidden', !isAdmin);
  document.getElementById('nav-results').classList.toggle('hidden', !isAdmin);

  updateHeader();
  renderRules();
  renderAuction();
  renderMyPicks();
  renderLeaderboard();
  if (isAdmin) renderResults();

  showSection('rules', { target: document.getElementById('nav-rules') });
  startLiveListener();
  startTicker();
  showLoading(false);
}

function logout() {
  if (unsubscribe) unsubscribe();
  if (tickInterval) clearInterval(tickInterval);
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
}
window.showSection = showSection;

// ============================================
// LIVE AUCTION ENGINE
// ============================================

// Ticker runs every 500ms to check phase transitions (admin drives state changes; everyone reads countdown)
function startTicker() {
  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(() => {
    const auctionSection = document.getElementById('auction');
    if (auctionSection && !auctionSection.classList.contains('hidden')) {
      renderAuctionTimer();
      // Only admin's browser drives automatic phase transitions to avoid race conditions
      if (currentUser === 'Micole') checkPhaseTransition();
    }
  }, 1000);
}

function getPhaseElapsedSeconds() {
  if (!state.liveAuction.phaseStartedAt) return 0;
  return (Date.now() - new Date(state.liveAuction.phaseStartedAt).getTime()) / 1000;
}

async function checkPhaseTransition() {
  const la = state.liveAuction;
  if (la.status === 'bidding') {
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
  if (!confirm('Start the live auction? This will open Match 1 for everyone right now!')) return;
  state.liveAuction = { status:'bidding', matchIndex:0, phaseStartedAt:new Date().toISOString() };
  await saveToFirebase({ liveAuction: state.liveAuction });
  showToast('🔥 Auction started!','success');
  renderAuction();
};

async function closeBiddingPhase() {
  const la = state.liveAuction;
  const match = r32Matches[la.matchIndex];
  if (!match) return;

  // Resolve both slot auctions for this match
  [match.slotA, match.slotB].forEach(slotId => {
    if (state.owners[slotId]) return; // already owned somehow
    const bids = state.bids[slotId] || {};
    const timestamps = (state.bidTimestamps && state.bidTimestamps[slotId]) || {};
    // Highest bid wins; ties go to whoever locked their bid in first (fastest finger)
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

// Admin manual override — skip to next phase early
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

  // If only bids changed (not phase/match), just refresh the phase content — avoids full DOM rebuild on every keystroke/bid from other players
  if (renderKey === lastRenderedKey && (la.status === 'bidding' || la.status === 'reveal')) {
    renderAuctionPhase();
    return;
  }
  lastRenderedKey = renderKey;

  if (la.status === 'not_started') {
    container.innerHTML = `
      <div class="live-waiting">
        <div class="live-waiting-icon">⏳</div>
        <div class="live-waiting-title">Waiting for the auction to start...</div>
        <div class="live-waiting-sub">🪙 You have ${getCoinsRemaining(currentUser)} coins ready to bid</div>
        ${isAdmin ? `<button class="cta-btn" style="margin-top:24px" onclick="startLiveAuction()">🔥 Start Live Auction</button>` : ''}
      </div>`;
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
    <div class="live-coins">🪙 ${getCoinsRemaining(currentUser)} coins available</div>
    <div class="live-matchup">
      <div class="live-team">
        <div class="live-flag">${slotA?.flag}</div>
        <div class="live-name">${slotA?.name}</div>
        ${!slotA?.confirmed ? `<div class="live-placeholder">Either: ${slots.find(s=>s.id===match.slotA)?.placeholder}</div>` : ''}
      </div>
      <div class="live-vs">VS</div>
      <div class="live-team">
        <div class="live-flag">${slotB?.flag}</div>
        <div class="live-name">${slotB?.name}</div>
        ${!slotB?.confirmed ? `<div class="live-placeholder">Either: ${slots.find(s=>s.id===match.slotB)?.placeholder}</div>` : ''}
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

function renderAuctionPhase() {
  const zone = document.getElementById('live-phase-zone');
  if (!zone) return;
  const la = state.liveAuction;
  const match = r32Matches[la.matchIndex];

  if (la.status === 'bidding') {
    // Don't wipe out an in-progress typed bid if this re-render was triggered
    // by someone else's bid landing via Firebase (only skip if I haven't already locked)
    const myBidAExisting = (state.bids[match.slotA]||{})[currentUser];
    const myBidBExisting = (state.bids[match.slotB]||{})[currentUser];
    const inputA = document.getElementById(`live-bid-${match.slotA}`);
    const inputB = document.getElementById(`live-bid-${match.slotB}`);
    const userIsTyping = (inputA && document.activeElement === inputA) || (inputB && document.activeElement === inputB);
    if (userIsTyping && myBidAExisting === undefined && myBidBExisting === undefined) {
      return; // preserve their typing, nothing they need to see has changed yet
    }
    const coinsLeft = getCoinsRemaining(currentUser);
    const myBidA = (state.bids[match.slotA]||{})[currentUser];
    const myBidB = (state.bids[match.slotB]||{})[currentUser];
    const slotA = getSlot(match.slotA);
    const slotB = getSlot(match.slotB);

    zone.innerHTML = `
      <div class="live-bid-title">🔒 Place your blind bid${myBidA||myBidB ? ' — locked in!' : ''}</div>
      <div class="live-bid-grid">
        <div class="live-bid-box">
          <div class="live-bid-team">${slotA?.flag} ${slotA?.name}</div>
          ${myBidA !== undefined
            ? `<div class="live-bid-locked">✅ Bid locked: ${myBidA} coins</div>`
            : `<div class="bid-row"><input type="number" min="0" max="${coinsLeft}" id="live-bid-${match.slotA}" class="bid-input" placeholder="0"/>
               <button class="bid-btn" onclick="lockLiveBid('${match.slotA}')">Lock 🔒</button></div>`}
        </div>
        <div class="live-bid-box">
          <div class="live-bid-team">${slotB?.flag} ${slotB?.name}</div>
          ${myBidB !== undefined
            ? `<div class="live-bid-locked">✅ Bid locked: ${myBidB} coins</div>`
            : `<div class="bid-row"><input type="number" min="0" max="${coinsLeft}" id="live-bid-${match.slotB}" class="bid-input" placeholder="0"/>
               <button class="bid-btn" onclick="lockLiveBid('${match.slotB}')">Lock 🔒</button></div>`}
        </div>
      </div>
      <div class="live-bid-hint">Bids are blind — nobody can see what you bid. You don't have to bid on either team.</div>`;
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
      <div class="live-balance">🪙 ${getCoinsRemaining(currentUser)} coins remaining</div>
      ${nextHTML}`;
  }
}

window.lockLiveBid = async function(slotId) {
  const input = document.getElementById(`live-bid-${slotId}`);
  const amount = parseInt(input?.value);
  if (isNaN(amount) || amount < 0) { showToast('Enter a valid bid (0 or more)!','error'); return; }

  const match = r32Matches[state.liveAuction.matchIndex];
  const otherSlot = match.slotA === slotId ? match.slotB : match.slotA;
  const myOtherBid = (state.bids[otherSlot]||{})[currentUser] || 0;
  const coinsAvailable = getCoinsRemaining(currentUser) - myOtherBid;

  if (amount > coinsAvailable) { showToast(`Not enough coins! Only ${coinsAvailable} left after your other bid.`,'error'); return; }

  if (!state.bids[slotId]) state.bids[slotId] = {};
  state.bids[slotId][currentUser] = amount;
  if (!state.bidTimestamps) state.bidTimestamps = {};
  if (!state.bidTimestamps[slotId]) state.bidTimestamps[slotId] = {};
  state.bidTimestamps[slotId][currentUser] = Date.now();
  await saveToFirebase({ bids: state.bids, bidTimestamps: state.bidTimestamps });
  showToast(`Bid locked: ${amount} coins 🔒`,'success');
  renderAuctionPhase();
};

// ============================================
// ADMIN: PLACEHOLDER OVERRIDES (pre-auction)
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

  const summary = document.createElement('div');
  summary.className = 'squad-summary';
  summary.innerHTML = `
    <div class="squad-stat"><div class="squad-stat-val">🪙 ${coinsSpent}</div><div class="squad-stat-lbl">coins spent</div></div>
    <div class="squad-stat"><div class="squad-stat-val">🪙 ${getCoinsRemaining(currentUser)}</div><div class="squad-stat-lbl">coins left</div></div>
    <div class="squad-stat"><div class="squad-stat-val" style="color:var(--gold)">🏳️ ${myCol.length}</div><div class="squad-stat-lbl">total teams</div></div>
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
    const isEliminated = Object.values(state.matchResults).some(r => r.loserSlot === slotId);
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

  r32Matches.forEach(match => {
    const slotA   = getSlot(match.slotA);
    const slotB   = getSlot(match.slotB);
    const result  = state.matchResults[match.id];

    const card = document.createElement('div');
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
      // Deliberately no owner names shown here — ownership stays secret until a result locks it in
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

  state.matchResults[matchId] = { winnerSlot, loserSlot };
  const winnerHolder = getCurrentHolder(winnerSlot);
  const loserHolder  = getCurrentHolder(loserSlot);

  if (!state.revealFeed) state.revealFeed = [];
  const feedEntry = { matchId, ts: new Date().toISOString() };

  if (winnerHolder && loserHolder && winnerHolder === loserHolder) {
    state.collection[winnerHolder] = (state.collection[winnerHolder]||[]).filter(c => c.slotId !== loserSlot);
    feedEntry.msg = `⚽ ${winner?.flag} ${winner?.name} beat ${loser?.flag} ${loser?.name} — both were ${PLAYERS.find(p=>p.name===winnerHolder)?.icon} ${winnerHolder}'s own teams! ${loser?.name} is eliminated.`;
    showToast(`${winner?.name} beat your own ${loser?.name} — eliminated`,'');
  } else if (winnerHolder) {
    if (loserHolder) {
      state.collection[loserHolder] = (state.collection[loserHolder]||[]).filter(c => c.slotId !== loserSlot);
      if (!state.collection[winnerHolder]) state.collection[winnerHolder] = [];
      state.collection[winnerHolder].push({ slotId: loserSlot, how:'stolen' });
      feedEntry.msg = `🔥 ${PLAYERS.find(p=>p.name===winnerHolder)?.icon} ${winnerHolder}'s ${winner?.flag} ${winner?.name} beat ${PLAYERS.find(p=>p.name===loserHolder)?.icon} ${loserHolder}'s ${loser?.flag} ${loser?.name} — ${winnerHolder} steals the team!`;
      showToast(`${winnerHolder} stole ${loser?.name} from ${loserHolder}! 🔥`,'success');
    } else {
      if (!state.collection[winnerHolder]) state.collection[winnerHolder] = [];
      state.collection[winnerHolder].push({ slotId: loserSlot, how:'collected' });
      feedEntry.msg = `✅ ${PLAYERS.find(p=>p.name===winnerHolder)?.icon} ${winnerHolder}'s ${winner?.flag} ${winner?.name} beat unowned ${loser?.flag} ${loser?.name} — collected!`;
      showToast(`${winnerHolder} collected ${loser?.name}! ✅`,'success');
    }
  } else if (loserHolder) {
    state.collection[loserHolder] = (state.collection[loserHolder]||[]).filter(c => c.slotId !== loserSlot);
    feedEntry.msg = `❌ Unowned ${winner?.flag} ${winner?.name} beat ${PLAYERS.find(p=>p.name===loserHolder)?.icon} ${loserHolder}'s ${loser?.flag} ${loser?.name} — team is gone, nobody gains it.`;
    showToast(`${loser?.name} eliminated — ${loserHolder} loses their team`,'');
  } else {
    feedEntry.msg = `👻 ${winner?.flag} ${winner?.name} beat ${loser?.flag} ${loser?.name} — both unowned, nothing changes.`;
  }

  state.revealFeed.unshift(feedEntry);

  await saveToFirebase({ matchResults: state.matchResults, collection: state.collection, revealFeed: state.revealFeed });
  renderResults(); renderLeaderboard(); renderMyPicks();
};

window.clearResult = async function(matchId) {
  if (!confirm('Undo this result? Collections will NOT be automatically reversed.')) return;
  delete state.matchResults[matchId];
  await saveToFirebase({ matchResults: state.matchResults });
  showToast('Result undone.','');
  renderResults();
};

// ============================================
// LEADERBOARD
// ============================================
function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  container.innerHTML = '';

  const hasResults = Object.keys(state.matchResults).length > 0;

  if (!hasResults) {
    // Before any World Cup results — total secrecy, just show everyone at 0
    const intro = document.createElement('div');
    intro.className = 'leaderboard-empty';
    intro.innerHTML = '🤫 Ownership is secret! The leaderboard activates once real match results are entered — that\'s when steals get revealed.';
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

  // Results exist — show REVEALED teams only, NOT true totals.
  // A team's ownership becomes known the moment it plays a match (whether it won or lost) —
  // because the reveal feed names the owner either as the thief or the victim.
  // Teams that haven't played yet stay completely invisible, even though they still
  // count toward that player's real total behind the scenes.
  const revealedSlotIds = new Set();
  Object.values(state.matchResults).forEach(r => {
    revealedSlotIds.add(r.winnerSlot);
    revealedSlotIds.add(r.loserSlot);
  });

  const revealedData = PLAYERS.map(p => {
    const col = getCollection(p.name);
    const knownTeams = col.filter(c => revealedSlotIds.has(c.slotId));
    return { ...p, known: knownTeams.length, knownTeams };
  }).sort((a,b) => b.known - a.known);

  const medals  = ['🥇','🥈','🥉','4️⃣','5️⃣'];
  const classes = ['first','second','third','',''];

  revealedData.forEach((player, i) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row ${classes[i]||''}`;

    const isElim = (slotId) => Object.values(state.matchResults).some(r => r.loserSlot === slotId);

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
        <div class="lb-type">could have more in secret 🤫</div>
        ${ownedBadges ? `<div class="lb-teams"><span class="lb-teams-label">🟢 Owned:</span>${ownedBadges}</div>` : ''}
        ${stolenBadges ? `<div class="lb-teams"><span class="lb-teams-label">🟣 Stolen:</span>${stolenBadges}</div>` : ''}
        ${collectedBadges ? `<div class="lb-teams"><span class="lb-teams-label">🔵 Collected:</span>${collectedBadges}</div>` : ''}
      </div>
      <div>
        <div class="lb-points" style="color:var(--gold)">${player.known}</div>
        <div class="lb-pts-label">KNOWN</div>
      </div>`;
    container.appendChild(row);
  });

  // Reveal feed — what's actually been made public so far
  if (state.revealFeed && state.revealFeed.length > 0) {
    const feedTitle = document.createElement('div');
    feedTitle.className = 'auction-section-title';
    feedTitle.style.marginTop = '28px';
    feedTitle.textContent = '📣 Reveal Feed';
    container.appendChild(feedTitle);

    const feedWrap = document.createElement('div');
    feedWrap.className = 'reveal-feed';
    state.revealFeed.forEach(entry => {
      const item = document.createElement('div');
      item.className = 'reveal-feed-item';
      const ts = new Date(entry.ts);
      const timeStr = ts.toLocaleDateString('en-ZA',{day:'numeric',month:'short'}) + ' · ' + ts.toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});
      item.innerHTML = `<div class="reveal-feed-msg">${entry.msg}</div><div class="reveal-feed-time">${timeStr}</div>`;
      feedWrap.appendChild(item);
    });
    container.appendChild(feedWrap);
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
      <h3>⚡ A live, blind, synchronized auction</h3>
      <p>Everyone logs in beforehand. At a set time, Micole starts the auction and it runs through all 16 Round of 32 matches automatically — one at a time, ${BID_SECONDS} seconds to bid, ${REVEAL_SECONDS} seconds to see your result, then straight on to the next match.</p>
    </div>
    <div class="rules-block">
      <h3>🪙 Your Budget</h3>
      <p>Everyone starts with <strong>100 coins</strong>. Spend wisely — you can never get more.</p>
    </div>
    <div class="rules-block">
      <h3>🔒 Blind Bidding</h3>
      <p>When a match opens (e.g. Brazil vs Germany), you have ${BID_SECONDS} seconds to bid on Brazil, Germany, both, or neither. Nobody can see anyone else's bids. Highest bid wins each team. You don't have to bid if you don't want either team.</p>
      <p><strong>Tie-breaker:</strong> if two or more players bid the exact same highest amount, the team goes to whoever locked their bid in first — fastest finger first! ⚡</p>
    </div>
    <div class="rules-block">
      <h3>🤫 Total Secrecy</h3>
      <p>You only ever see <strong>your own</strong> result — "you won" or "you lost." You never find out who else bid or who actually owns a team. Ownership stays completely hidden until that team actually plays in the real World Cup and Micole enters the result. That's when the reveal happens — "🔥 Micole's Brazil beat Sean's Germany!"</p>
    </div>
    <div class="rules-block">
      <h3>⏱️ The Pace</h3>
      <p>${BID_SECONDS}s to bid, then ${REVEAL_SECONDS}s to see your result and the next matchup, then it's straight into the next match. All 16 matches take about ${Math.round(r32Matches.length*(BID_SECONDS+REVEAL_SECONDS)/60)} minutes start to finish. Fast and final — no second-guessing once you lock a bid in.</p>
    </div>
    <div class="rules-block">
      <h3>What happens when teams play?</h3>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">🔥 Steal</span> Your team beats someone else's owned team → you steal their team</div>
        <div class="rules-score-row"><span class="score-badge gold">✅ Collect</span> Your team beats an unowned team → you collect that team</div>
        <div class="rules-score-row"><span class="score-badge neutral">❌ Lose</span> Your team loses to an unowned team → your team disappears, nobody gets it</div>
        <div class="rules-score-row"><span class="score-badge neutral">⚽ Self</span> You own both teams in a match → your winner stays, your loser is just eliminated</div>
      </div>
    </div>
    <div class="rules-block">
      <h3>📈 More Teams = More Chances</h3>
      <p>The more teams you own, the more matches you're involved in — and the more chances you get to <strong>steal</strong> and climb the leaderboard. Someone with 1 team has 1 shot. Someone with 8 teams has 8 shots at stealing, plus 8 chances of getting stolen from.</p>
    </div>
    <div class="rules-block" style="border-color:rgba(255,71,87,.3)">
      <h3>⚠️ Avoid Bidding on Both Teams in the Same Match</h3>
      <p>It might seem safe to lock in both sides of a matchup so you "can't lose" — but it actually works against you:</p>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge neutral">1</span> You can't steal a team from yourself — owning both means no steal happens either way</div>
        <div class="rules-score-row"><span class="score-badge neutral">2</span> You spend more coins for the same single outcome, leaving less to bid on other matches</div>
        <div class="rules-score-row"><span class="score-badge neutral">3</span> Fewer coins left means fewer teams owned overall — and fewer chances to steal elsewhere</div>
      </div>
      <p style="margin-top:10px">Choose one side per match wisely, and spread the rest of your coins across other matches instead. 🎯</p>
    </div>
    <div class="rules-block">
      <h3>🏆 How to Win</h3>
      <p>Most teams owned at the end of the Round of 32 wins. Simple. Back the right teams in the blind auction and steal smart when results come in.</p>
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
