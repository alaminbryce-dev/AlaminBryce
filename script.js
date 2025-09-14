
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
