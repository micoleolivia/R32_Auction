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
  { name: 'Patricia', icon: '🍇' },
];

const STARTING_COINS = 100;
const MIN_BID         = 5;
const COUNTDOWN_SECONDS = 10;
const BID_SECONDS     = 20;
const REVEAL_SECONDS  = 10;

// ============================================
// ROUND OF 32 SLOTS
// Each slot = one team. Confirmed = known team, unconfirmed = TBA.
// To update a TBA: change confirmed:false to confirmed:true,
// update name and flag, and remove the placeholder line.
// ============================================
const slots = [
  // Match 1: South Africa vs Canada
  { id:'s1',  name:'South Africa', flag:'🇿🇦', confirmed:true,  group:'A' },
  { id:'s2',  name:'Canada',       flag:'🇨🇦', confirmed:true,  group:'B' },
  // Match 2: Netherlands vs Morocco
  { id:'s3',  name:'Netherlands',  flag:'🇳🇱', confirmed:true,  group:'F' },
  { id:'s4',  name:'Morocco',      flag:'🇲🇦', confirmed:true,  group:'C' },
  // Match 3: Germany vs Paraguay
  { id:'s5',  name:'Germany',      flag:'🇩🇪', confirmed:true,  group:'E' },
  { id:'s6',  name:'Paraguay',     flag:'🇵🇾', confirmed:true,  group:'D' },
  // Match 4: France vs Sweden
  { id:'s7',  name:'France',       flag:'🇫🇷', confirmed:true,  group:'I' },
  { id:'s8',  name:'Sweden',       flag:'🇸🇪', confirmed:true,  group:'F' },
  // Match 5: Belgium vs TBA
  { id:'s9',  name:'Belgium',      flag:'🇧🇪', confirmed:true,  group:'G' },
  { id:'s10', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 5 opponent', group:'?' },
  // Match 6: USA vs Bosnia & Herzegovina
  { id:'s11', name:'USA',          flag:'🇺🇸', confirmed:true,  group:'D' },
  { id:'s12', name:'Bosnia & Herz.',flag:'🇧🇦', confirmed:true,  group:'B' },
  // Match 7: Spain vs TBA
  { id:'s13', name:'Spain',        flag:'🇪🇸', confirmed:true,  group:'H' },
  { id:'s14', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 7 opponent', group:'?' },
  // Match 8: TBA vs TBA
  { id:'s15', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 8 home team', group:'?' },
  { id:'s16', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 8 away team', group:'?' },
  // Match 9: Brazil vs Japan
  { id:'s17', name:'Brazil',       flag:'🇧🇷', confirmed:true,  group:'C' },
  { id:'s18', name:'Japan',        flag:'🇯🇵', confirmed:true,  group:'F' },
  // Match 10: Ivory Coast vs Norway
  { id:'s19', name:'Ivory Coast',  flag:'🇨🇮', confirmed:true,  group:'E' },
  { id:'s20', name:'Norway',       flag:'🇳🇴', confirmed:true,  group:'I' },
  // Match 11: Mexico vs TBA
  { id:'s21', name:'Mexico',       flag:'🇲🇽', confirmed:true,  group:'A' },
  { id:'s22', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 11 opponent', group:'?' },
  // Match 12: TBA vs TBA
  { id:'s23', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 12 home team', group:'?' },
  { id:'s24', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 12 away team', group:'?' },
  // Match 13: Switzerland vs TBA
  { id:'s25', name:'Switzerland',  flag:'🇨🇭', confirmed:true,  group:'B' },
  { id:'s26', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 13 opponent', group:'?' },
  // Match 14: TBA vs TBA
  { id:'s27', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 14 home team', group:'?' },
  { id:'s28', name:'TBA',          flag:'🏳️', confirmed:false, placeholder:'Match 14 away team', group:'?' },
  // Match 15: Australia vs Egypt
  { id:'s29', name:'Australia',    flag:'🇦🇺', confirmed:true,  group:'D' },
  { id:'s30', name:'Egypt',        flag:'🇪🇬', confirmed:true,  group:'G' },
  // Match 16: Argentina vs Cabo Verde
  { id:'s31', name:'Argentina',    flag:'🇦🇷', confirmed:true,  group:'J' },
  { id:'s32', name:'Cabo Verde',   flag:'🇨🇻', confirmed:true,  group:'K' },
];

const r32Matches = [
  { id:'r32-1',  slotA:'s1',  slotB:'s2'  },  // South Africa vs Canada
  { id:'r32-2',  slotA:'s3',  slotB:'s4'  },  // Netherlands vs Morocco
  { id:'r32-3',  slotA:'s5',  slotB:'s6'  },  // Germany vs Paraguay
  { id:'r32-4',  slotA:'s7',  slotB:'s8'  },  // France vs Sweden
  { id:'r32-5',  slotA:'s9',  slotB:'s10' },  // Belgium vs TBA
  { id:'r32-6',  slotA:'s11', slotB:'s12' },  // USA vs Bosnia & Herz.
  { id:'r32-7',  slotA:'s13', slotB:'s14' },  // Spain vs TBA
  { id:'r32-8',  slotA:'s15', slotB:'s16' },  // TBA vs TBA
  { id:'r32-9',  slotA:'s17', slotB:'s18' },  // Brazil vs Japan
  { id:'r32-10', slotA:'s19', slotB:'s20' },  // Ivory Coast vs Norway
  { id:'r32-11', slotA:'s21', slotB:'s22' },  // Mexico vs TBA
  { id:'r32-12', slotA:'s23', slotB:'s24' },  // TBA vs TBA
  { id:'r32-13', slotA:'s25', slotB:'s26' },  // Switzerland vs TBA
  { id:'r32-14', slotA:'s27', slotB:'s28' },  // TBA vs TBA
  { id:'r32-15', slotA:'s29', slotB:'s30' },  // Australia vs Egypt
  { id:'r32-16', slotA:'s31', slotB:'s32' },  // Argentina vs Cabo Verde
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

  const summary = document.createElement('div');
  summary.className = 'squad-summary';
  summary.innerHTML = `
    <div class="squad-stat"><div class="squad-stat-val">💰 ${coinsSpent}</div><div class="squad-stat-lbl">coins spent</div></div>
    <div class="squad-stat"><div class="squad-stat-val">💰 ${getCoinsRemaining(currentUser)}</div><div class="squad-stat-lbl">coins left</div></div>
    <div class="squad-stat"><div class="squad-stat-val" style="color:var(--gold)">${myCol.length}</div><div class="squad-stat-lbl">total teams bought</div></div>
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
  delete state.matchResults[matchId];
  try {
    await setDoc(doc(db,'worldcup2026_r32','shared'), {
      matchResults: { [matchId]: deleteField() }
    }, { merge: true });
  } catch(e) { showToast('Save failed','error'); return; }
  showToast('Result undone.','');
  renderResults();
  renderLeaderboard();
  renderMyPicks();
};

// ============================================
// LEADERBOARD
// ============================================
function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  container.innerHTML = '';

  const hasResults = Object.keys(state.matchResults).length > 0;

  if (state.revealFeed && state.revealFeed.length > 0) {
    const feedTitle = document.createElement('div');
    feedTitle.className = 'auction-section-title';
    feedTitle.textContent = '📣 Reveal Feed';
    container.appendChild(feedTitle);

    const feedWrap = document.createElement('div');
    feedWrap.className = 'reveal-feed';
    feedWrap.id = 'reveal-feed-wrap';
    container.appendChild(feedWrap);
    renderRevealFeedItems(feedWrap, false);

    if (state.revealFeed.length > 3) {
      const expandBtn = document.createElement('button');
      expandBtn.className = 'reveal-feed-expand-btn';
      expandBtn.textContent = `Show all ${state.revealFeed.length} updates ▾`;
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
  Object.values(state.matchResults).forEach(r => {
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
        <div class="lb-type">As games are played, teams will be revealed — owned, stolen or collected</div>
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

  // GRAVEYARD
  const graveyardEntries = [];
  Object.entries(state.matchResults).forEach(([matchId, result]) => {
    const loserSlot = result.loserSlot;
    const originalOwner = result.loserOriginalOwner || state.owners[loserSlot]?.username || null;
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
    gSubtitle.textContent = 'These teams were knocked out and nobody gained them.';
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
}

function renderRevealFeedItems(wrap, showAll) {
  wrap.innerHTML = '';
  const items = showAll ? state.revealFeed : state.revealFeed.slice(0, 3);
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
  btn.textContent = !isExpanded ? 'Show less ▴' : `Show all ${state.revealFeed.length} updates ▾`;
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
      <div class="live-bid-hint">This is practice — bids are blind here too, against 4 simulated bidders. You can only back ONE team per match. Minimum bid is ${MIN_BID} coins (or 0 to skip).</div>`;
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
      <h3>The Gist</h3>
      <p>It's a live, blind auction for World Cup teams.</p>
      <p>Everyone starts with <strong>100 coins</strong>. Win teams in the auction, watch them play, steal teams from anyone your teams knock out. Whoever owns the most teams at the end wins.</p>
    </div>
    <div class="rules-block">
      <h3>How Bidding Works</h3>
      <p>🏆 Auction starts at 19:00 on June 28th, if this does not suit you write a complaint to Micole.<br>If Micole does not get any complaints she will assume the time suits everyone perfectly and the auction will proceed.</p>
      <p>🏆 Matches open one at a time. You get ${BID_SECONDS} seconds to blind-bid on ONE of the two teams (never both).</p>
      <p>🏆 The matches will open in chronological order of date played</p>
      <p>🏆 The minimum bid that can be made is 5 coins.</p>
      <p>🏆 You can't see anyone else's bid. Highest bid wins. Ties go to whoever locked in first.</p>
      <p>🏆 Once bidding closes, you only ever see your own result for ${REVEAL_SECONDS} seconds: either a congratulatory message or a sorry-you-lost message, then it's straight on to the next match.</p>
      <p>🏆 Ownership of other members teams becomes visible after the match takes place. That's when the reveal happens (who stole what from whom).</p>
      <p>🏆 There are ${r32Matches.length} matches, the whole auction will take about ${Math.round(r32Matches.length*(BID_SECONDS+REVEAL_SECONDS)/60)} minutes.</p>
      <p>🏆 After the auction closes, you don't need to do anything else, the system will handle the rest. All you need to do is watch how your teams steal or get stolen from!</p>
    </div>
    <div class="rules-block">
      <h3>How to Get More Teams After the Auction</h3>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">Steal</span> Your team beats someone's owned team → you steal their team</div>
        <div class="rules-score-row"><span class="score-badge gold">Collect</span> Your team beats an unowned team → you collect that unowned team</div>
        <div class="rules-score-row"><span class="score-badge neutral">Lose</span> Your team loses to someone's owned team → your opponent steals your team</div>
        <div class="rules-score-row"><span class="score-badge neutral">Lose</span> Your team loses to an unowned team → your losing team ends up in the graveyard (below the leaderboard table - the graveyard will appear as soon as a team ends up in it) </div>
      </div>
    </div>
    <div class="rules-block">
      <h3>💡 A Little Hint 💡</h3>
      <p>More teams = more chances to steal (or be stolen) and climb the leaderboard. Don't blow your whole budget on one team, spread it out, or don't and accept that you're limiting your own chances of climbing the leaderboard.</p>
    </div>
    <div class="rules-block" style="border-color:rgba(245,197,24,.4);background:rgba(245,197,24,.04)">
      <h3>Want a Trial Run?</h3>
      <p>Head to the <strong>Trial Run</strong> tab to practice on 3 sample matches against simulated bidders before the real auction starts. Replay as many times as you like. Nothing there counts.</p>
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
