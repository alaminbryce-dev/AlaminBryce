
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
  { name: "Emily (Hazbin Hotel)", amount: 260 },
  { name: "Yuki", amount: 180 },
  { name: "Ravi", amount: 125 },
  { name: "Mia", amount: 110 },
  { name: "Kenta", amount: 90 },
  { name: "Sora", amount: 80 },
  { name: "Aruna", amount: 75 },
  { name: "Dewi", amount: 70 },
  { name: "Noah", amount: 60 }
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

