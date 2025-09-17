
document.getElementById('year').textContent = new Date().getFullYear();

const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: document.title,
    text: 'Check out AlaminBryce',
    url: window.location.href
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } 
    catch (e) { /* user canceled share */ }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareBtn.classList.add('copied');
      shareBtn.title = 'Link copied';
      setTimeout(()=>{ shareBtn.title='Share'; shareBtn.classList.remove('copied'); }, 1500);
    } catch(e){ alert('Copy this link: ' + window.location.href); }
  }
});

/* ====== RANKING DATA & RENDER ====== */
/**
 * Edit this list to update rankings.
 * amount: number (USD or any currency symbol you like in formatMoney)
 */
const contributors = [
  { name: "TastySalts", amount: 159 },
  { name: "isaidgetlost", amount: 53 },
  { name: "Akishira", amount: 53 },
  { name: "Zitronen", amount: 50 },
  { name: "Seo", amount: 45 },
  { name: "Richard", amount: 43 },
  { name: "Drew", amount: 38 }
];

function formatMoney(n){ 
  // Change currency symbol as you prefer (e.g., "Rp " + n.toLocaleString('id-ID'))
  return "$" + Number(n).toLocaleString(); 
}

function renderRanking(){
  if(!document.querySelector('.ranking')) return;

  // sort by amount desc
  const sorted = [...contributors].sort((a,b)=>b.amount-a.amount);
  const top3 = sorted.slice(0,3);
  const others = sorted.slice(3);

  // Defensive defaults
  const [first = {name:"—", amount:0}, second = {name:"—", amount:0}, third = {name:"—", amount:0}] = top3;

  // Fill podium labels
  const p1Name = document.getElementById('p1-name');
  const p1Amt  = document.getElementById('p1-amount');
  const p2Name = document.getElementById('p2-name');
  const p2Amt  = document.getElementById('p2-amount');
  const p3Name = document.getElementById('p3-name');
  const p3Amt  = document.getElementById('p3-amount');

  if(p1Name) p1Name.textContent = first.name;
  if(p1Amt)  p1Amt.textContent  = formatMoney(first.amount);
  if(p2Name) p2Name.textContent = second.name;
  if(p2Amt)  p2Amt.textContent  = formatMoney(second.amount);
  if(p3Name) p3Name.textContent = third.name;
  if(p3Amt)  p3Amt.textContent  = formatMoney(third.amount);

  // Set podium heights relative to #1
  const max = Math.max(1, first.amount || 1);
  const h1 = Math.max(60, Math.round((first.amount / max) * 160));  // px
  const h2 = Math.max(50, Math.round((second.amount / max) * 130));
  const h3 = Math.max(40, Math.round((third.amount / max) * 110));

  const p1Block = document.getElementById('p1-block');
  const p2Block = document.getElementById('p2-block');
  const p3Block = document.getElementById('p3-block');
  if(p1Block) p1Block.style.minHeight = h1 + "px";
  if(p2Block) p2Block.style.minHeight = h2 + "px";
  if(p3Block) p3Block.style.minHeight = h3 + "px";

  // Fill list for 4th+
  const list = document.getElementById('leaderboard-list');
  if(list){
    list.innerHTML = "";
    others.forEach((c, i)=>{
      const li = document.createElement('li');
      const who = document.createElement('div');
      who.className = 'who';

      // Small bronze-ish crown for everyone (optional). You can remove if you like.
      const crown = document.createElement('div');
      crown.className = 'crown';
      who.appendChild(crown);

      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = c.name;
      who.appendChild(name);

      const money = document.createElement('div');
      money.className = 'money';
      money.textContent = formatMoney(c.amount);

      li.appendChild(who);
      li.appendChild(money);
      list.appendChild(li);
    });
  }
}

// Run after page load
document.addEventListener('DOMContentLoaded', renderRanking);

/* ===== Milestone Tracker (Cute Edition) ===== */

/**
 * EDIT ME:
 * - current: your current patrons or money raised
 * - unit: 'patrons' or 'USD' or 'IDR' … anything you want displayed
 * - milestones: ordered lowest → highest; each has { target, label }
 * - mode: 'count' or 'money'
 */
const milestoneConfig = {
  current: 29,                       // ← change this anytime
  unit: 'patrons',                   // e.g., 'patrons' or 'USD' or 'IDR'
  mode: 'count',                     // 'count' or 'money'
  milestones: [
    { target: 10,  label: 'Comics' },
    { target: 30,  label: 'Mega Post' },
    { target: 50,  label: 'OC Reveal' },
    { target: 75,  label: 'Tutorials' },
  ],
  cuteEmoji: '💖',                   // header sticker
  sparkle: '✨'                      // sparkle in the bar
};

// Optional currency formatter if you switch to mode:'money'
function formatMilestoneValue(n){
  if(milestoneConfig.mode === 'money'){
    // Change to IDR if you prefer:
    // return 'Rp ' + Number(n).toLocaleString('id-ID');
    return '$' + Number(n).toLocaleString();
  }
  return String(n);
}

function renderMilestones(){
  const section = document.querySelector('.milestone');
  if(!section) return;

  const { current, milestones } = milestoneConfig;
  const stepsEl = document.getElementById('ms-steps');
  const fill = document.getElementById('ms-fill');
  const nowEl = document.getElementById('ms-current');
  const unitEl = document.getElementById('ms-unit');
  const goalLabelEl = document.getElementById('ms-goal-label');
  const noteEl = document.getElementById('ms-note');

  // header
  nowEl.textContent = formatMilestoneValue(current);
  unitEl.textContent = milestoneConfig.unit;
  document.querySelector('.ms-sticker').textContent = milestoneConfig.cuteEmoji;
  document.querySelector('.ms-sparkle').textContent = milestoneConfig.sparkle;

  // build steps
  stepsEl.innerHTML = '';
  milestones.forEach((m)=>{
    const li = document.createElement('li');
    li.className = 'step';
    const dot = document.createElement('span'); dot.className = 'dot';
    const label = document.createElement('span'); label.className = 'label';
    label.textContent = m.label + ' (' + formatMilestoneValue(m.target) + ')';
    li.appendChild(dot); li.appendChild(label);
    stepsEl.appendChild(li);
  });

  // figure out nearest goal and percent
  const sorted = [...milestones].sort((a,b)=>a.target-b.target);
  const maxGoal = sorted[sorted.length-1]?.target ?? 1;
  const prevGoal = sorted.reduce((acc, m)=> m.target <= current ? m.target : acc, 0);
  const nextGoal = sorted.find(m=> m.target > current)?.target ?? maxGoal;

  const range = Math.max(1, nextGoal - prevGoal);
  const within = Math.min(Math.max(0, current - prevGoal), range);
  const percent = Math.round((within / range) * 100);

  // set fill and ARIA
  fill.style.width = ((current >= maxGoal) ? 100 : percent) + '%';
  const progressEl = document.querySelector('.ms-progress');
  progressEl.setAttribute('aria-valuenow', String(percent));

  // label next target
  const nextLabel = sorted.find(m=> m.target === nextGoal);
  goalLabelEl.textContent = current >= maxGoal
    ? 'goal completed 🎉'
    : `next: ${nextLabel?.label} (${formatMilestoneValue(nextGoal)})`;

  // mark step states
  const stepEls = stepsEl.querySelectorAll('.step');
  sorted.forEach((m, idx)=>{
    const el = stepEls[idx];
    el.classList.remove('completed','current','upcoming');
    if(current >= m.target) el.classList.add('completed');
    else if(nextGoal === m.target) el.classList.add('current');
    else el.classList.add('upcoming');
  });

  // celebratory note
  if(current >= maxGoal){
    noteEl.hidden = false;
    noteEl.textContent = '🎉 Goal reached! Thank you so much!';
  }else{
    noteEl.hidden = false;
    noteEl.textContent = 'You\'re amazing! Next reward unlocking soon 🫶';
  }
}

// expose a helper so you can quickly tweak live if needed
window.updateMilestone = function(newValue){
  milestoneConfig.current = Number(newValue) || 0;
  renderMilestones();
};

document.addEventListener('DOMContentLoaded', renderMilestones);

