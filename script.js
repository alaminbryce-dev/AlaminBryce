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

const tutorialBtn = document.getElementById('tutorialBtn');
const toast = document.getElementById('toast');
if (tutorialBtn && toast && typeof toast.showPopover !== 'function') {
  tutorialBtn.addEventListener('click', () => {
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2200);
  });
}

const contributors = [
  { name: "Drew", amount: 181.86 },
  { name: "Zitronen tee", amount: 170 },
  { name: "hdctbpal", amount: 168.87 },
  { name: "Grimleal", amount: 97.42 },
  { name: "Richard Duffus", amount: 96.03 },
  { name: "OkieDokieSnokie", amount: 90 },
  { name: "Uiai Uea", amount: 75 },
  { name: "Implosion2o9", amount: 71.92 },
  { name: "ZosoPhoenix", amount: 70 },
  { name: "LucLorenzo", amount: 63.99 }
];

function formatMoney(n){
  return "$" + Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function renderRanking(){
  if(!document.querySelector('.ranking')) return;

  const sorted = [...contributors].sort((a,b)=>b.amount-a.amount).slice(0, 10);
  const top3 = sorted.slice(0,3);
  const others = sorted.slice(3);

  const [first = {name:"—", amount:0}, second = {name:"—", amount:0}, third = {name:"—", amount:0}] = top3;

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

  const max = Math.max(1, first.amount || 1);
  const h1 = Math.max(60, Math.round((first.amount / max) * 160));
  const h2 = Math.max(50, Math.round((second.amount / max) * 130));
  const h3 = Math.max(40, Math.round((third.amount / max) * 110));

  const p1Block = document.getElementById('p1-block');
  const p2Block = document.getElementById('p2-block');
  const p3Block = document.getElementById('p3-block');
  if(p1Block) p1Block.style.minHeight = h1 + "px";
  if(p2Block) p2Block.style.minHeight = h2 + "px";
  if(p3Block) p3Block.style.minHeight = h3 + "px";

  const list = document.getElementById('leaderboard-list');
  if(list){
    list.innerHTML = "";
    others.forEach((c, i)=>{
      const li = document.createElement('li');
      const who = document.createElement('div');
      who.className = 'who';

      const rank = document.createElement('span');
      rank.className = 'rank-num';
      rank.textContent = String(i + 4);
      who.appendChild(rank);

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

document.addEventListener('DOMContentLoaded', renderRanking);

const milestoneConfig = {
  current: 302,
  unit: 'monthly earning',
  mode: 'money',
  milestones: [
    { target: 50,  label: 'Comics' },
    { target: 100, label: 'Mega Post' },
    { target: 200, label: 'OC Reveal' },
    { target: 300, label: 'Tutorials' },
    { target: 500, label: 'Better Longer Videos' },
  ],
  cuteEmoji: '💖',
  sparkle: '✨'
};

function formatMilestoneValue(n){
  if(milestoneConfig.mode === 'money'){
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

  nowEl.textContent = formatMilestoneValue(current);
  unitEl.textContent = milestoneConfig.unit;
  document.querySelector('.ms-sticker').textContent = milestoneConfig.cuteEmoji;
  document.querySelector('.ms-sparkle').textContent = milestoneConfig.sparkle;

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

  const sorted = [...milestones].sort((a,b)=>a.target-b.target);
  const maxGoal = sorted[sorted.length-1]?.target ?? 1;
  const nextGoal = sorted.find(m=> m.target > current)?.target ?? maxGoal;
  const percent = Math.min(100, Math.max(0, (current / maxGoal) * 100));

  fill.style.width = percent + '%';
  const progressEl = document.querySelector('.ms-progress');
  progressEl.setAttribute('aria-valuemin', '0');
  progressEl.setAttribute('aria-valuemax', String(maxGoal));
  progressEl.setAttribute('aria-valuenow', String(current));

  const nowChip = document.getElementById('ms-now');
  if (nowChip) {
    nowChip.textContent = formatMilestoneValue(current);
    nowChip.style.left = percent + '%';
  }
  const ticksEl = document.getElementById('ms-ticks');
  const scaleEl = document.getElementById('ms-scale');
  if (ticksEl && scaleEl) {
    ticksEl.innerHTML = '';
    scaleEl.innerHTML = '';
    sorted.forEach((m) => {
      const left = (m.target / maxGoal) * 100 + '%';
      const tick = document.createElement('span');
      tick.className = 'ms-tick' + (current >= m.target ? ' hit' : '');
      tick.style.left = left;
      ticksEl.appendChild(tick);
      const lab = document.createElement('span');
      lab.className = 'ms-scale-label' + (current >= m.target ? ' hit' : '');
      lab.style.left = left;
      lab.textContent = formatMilestoneValue(m.target);
      scaleEl.appendChild(lab);
    });
  }

  const nextLabel = sorted.find(m=> m.target === nextGoal);
  goalLabelEl.textContent = current >= maxGoal
    ? 'goal completed 🎉'
    : `next: ${nextLabel?.label} (${formatMilestoneValue(nextGoal)})`;

  const stepEls = stepsEl.querySelectorAll('.step');
  sorted.forEach((m, idx)=>{
    const el = stepEls[idx];
    el.classList.remove('completed','current','upcoming');
    if(current >= m.target) el.classList.add('completed');
    else if(nextGoal === m.target) el.classList.add('current');
    else el.classList.add('upcoming');
  });

  if(current >= maxGoal){
    noteEl.hidden = false;
    noteEl.textContent = '🎉 Goal reached! Thank you so much!';
  }else{
    noteEl.hidden = false;
    noteEl.textContent = "You're amazing! Next reward unlocking soon 🫶";
  }
}

window.updateMilestone = function(newValue){
  milestoneConfig.current = Number(newValue) || 0;
  renderMilestones();
};

document.addEventListener('DOMContentLoaded', renderMilestones);
