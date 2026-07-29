const LINKS = Array.isArray(window.UENG_LINKS) ? window.UENG_LINKS : [];
const list = document.querySelector('#linkList');
const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
function render() {
  list.innerHTML = LINKS.map((p, i) => `<a class="place" href="${p.url}" ${p.local ? '' : 'target="_blank" rel="noopener"'}>
    <span class="place-num">${String(i + 1).padStart(2, '0')}</span>
    <span class="place-name">${esc(p.title)}</span>
    <small>${esc(p.note || 'PROJECT LINK')}</small>
    <i>${p.local ? '⌂' : '↗'}</i>
  </a>`).join('');
  list.dataset.count = String(LINKS.length);
  list.classList.toggle('few', LINKS.length <= 2);
  bindHover();
}

const loader = document.querySelector('.loader');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) loader.remove();
else setTimeout(() => { loader.classList.add('leave'); setTimeout(() => loader.remove(), 700); }, 950);

const clockEl = document.querySelector('#clock');
function clock() {
  const time = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date());
  clockEl.textContent = `SHANGHAI / ${time}`;
}
clock(); setInterval(clock, 30000);

const scene = document.querySelector('#scene');
const cardTilt = document.querySelector('#cardTilt');
const card = document.querySelector('#card');
const cursor = document.querySelector('.cursor');
function bindHover() {
  document.querySelectorAll('a, button').forEach(el => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}
render();
bindHover();

if (!reduce && matchMedia('(hover: hover)').matches) {
  let mx = -50, my = -50, cx = -50, cy = -50, moved = false;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    const r = scene.getBoundingClientRect();
    document.documentElement.style.setProperty('--x', `${e.clientX - r.left}px`);
    document.documentElement.style.setProperty('--y', `${e.clientY - r.top}px`);
    if (!moved) { moved = true; cursor.classList.add('ready'); }
  });
  (function follow() {
    cx += (mx - cx) * .2; cy += (my - cy) * .2;
    cursor.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(follow);
  })();
  card.addEventListener('mousemove', e => {
    if (scene.classList.contains('flipped')) return;
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    cardTilt.style.transform = `rotateX(${-y * .8}deg) rotateY(${x * .8}deg)`;
  });
  card.addEventListener('mouseleave', () => cardTilt.style.transform = '');
}

const back = document.querySelector('.back');
const frontFocusables = [...document.querySelectorAll('.content a, .content button, .identity a')];
const backFocusables = [...back.querySelectorAll('a, button')];
function setFrontInert(inert) { frontFocusables.forEach(el => inert ? el.setAttribute('tabindex', '-1') : el.removeAttribute('tabindex')); }
function trapBackFocus(e) {
  if (e.key !== 'Tab' || !scene.classList.contains('flipped')) return;
  const first = backFocusables[0], last = backFocusables[backFocusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
let flipAnimation;
function animateScene(from, to, done) {
  if (flipAnimation) flipAnimation.cancel();
  card.style.removeProperty('transition');
  scene.classList.add('turning');
  if (reduce || document.hidden || !card.animate) {
    card.style.transition = 'none';
    scene.classList.toggle('flipped', to === 180);
    card.getBoundingClientRect();
    scene.classList.remove('turning');
    done();
    return;
  }
  card.style.removeProperty('transition');
  flipAnimation = card.animate(
    [{ transform: `rotateY(${from}deg)` }, { transform: `rotateY(${to}deg)` }],
    { duration: 820, easing: 'cubic-bezier(.72,0,.18,1)' }
  );
  flipAnimation.onfinish = () => {
    scene.classList.toggle('flipped', to === 180);
    scene.classList.remove('turning');
    done();
  };
  flipAnimation.oncancel = () => scene.classList.remove('turning');
}
function showBack() {
  cardTilt.style.transform = '';
  back.setAttribute('aria-hidden', 'false');
  document.body.classList.add('back-open');
  setFrontInert(true);
  animateScene(0, 180, () => closeBack.focus());
}
function hideBack() {
  document.body.classList.remove('back-open');
  setFrontInert(false);
  animateScene(180, 360, () => {
    scene.classList.remove('flipped');
    back.setAttribute('aria-hidden', 'true');
    flipCard.focus();
  });
}
flipCard.addEventListener('click', showBack);
closeBack.addEventListener('click', hideBack);
backReturn.addEventListener('click', hideBack);
addEventListener('keydown', e => {
  trapBackFocus(e);
  if (e.key === 'Escape' && scene.classList.contains('flipped')) hideBack();
});

const originalShareLabel = shareCard.textContent;
async function copyPageLink(button) {
  try {
    await navigator.clipboard.writeText(location.href.split('#')[0]);
    button.textContent = 'COPIED ✓';
  } catch (_) {
    const input = document.createElement('input');
    input.value = location.href.split('#')[0]; document.body.appendChild(input); input.select();
    document.execCommand('copy'); input.remove(); button.textContent = 'COPIED ✓';
  }
  setTimeout(() => button.textContent = button === shareCard ? originalShareLabel : '复制页面链接', 1600);
}
shareCard.addEventListener('click', async () => {
  const data = { title: 'XUHENG — UENG', text: 'XUHENG 的个人数字名片与项目入口。', url: location.href.split('#')[0] };
  if (navigator.share) { try { await navigator.share(data); } catch (_) {} }
  else await copyPageLink(shareCard);
});
copyLink.addEventListener('click', () => copyPageLink(copyLink));
