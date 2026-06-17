const gif = document.getElementById('gif');
const question = document.getElementById('question');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');

const letterBtn = document.getElementById('letterBtn');
const letterModal = document.getElementById('letterModal');
const letterClose = letterModal.querySelector('.letter-close');
const letterBody = letterModal.querySelector('.letter-body');

let letterRaw = '';
let letterIdx = 0;      
let letterDone = false;  
let letterScroll = 0;       
let twTimer = null;

function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function renderLetter(text) {
  letterBody.innerHTML = escapeHTML(text)
    .split(/\n\n+/)
    .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

fetch('./style/letter.txt')
  .then(r => r.text())
  .then(text => { letterRaw = text.trim(); });



function openLetter() {
  letterModal.classList.add('open');

  if (letterDone) {
    renderLetter(letterRaw);
    letterBody.scrollTop = letterScroll;
    return;
  }

  renderLetter(letterRaw.slice(0, letterIdx));
  letterBody.scrollTop = letterScroll;

  twTimer = setInterval(() => {
    letterIdx++;
    renderLetter(letterRaw.slice(0, letterIdx));
    letterBody.scrollTop = letterBody.scrollHeight;

    if (letterIdx >= letterRaw.length) {
      clearInterval(twTimer);
      twTimer = null;
      letterDone = true;
    }
  }, 30);
}

function closeLetter() {
  if (twTimer) { clearInterval(twTimer); twTimer = null; }
  letterScroll = letterBody.scrollTop;
  letterModal.classList.add('closing');
  setTimeout(() => letterModal.classList.remove('open', 'closing'), 420);
}

letterBtn.addEventListener('click', () => {
  openLetter();
});
letterClose.addEventListener('click', closeLetter);
letterModal.addEventListener('click', e => { if (e.target === letterModal) closeLetter(); });

const sound1 = document.getElementById('bg-music1');
const sound2 = document.getElementById('bg-music2');
const sound3 = document.getElementById('bg-music3');
const sound4 = document.getElementById('bg-music4');

const content = [
  { gif: 'https://i.pinimg.com/originals/7a/ef/73/7aef734a86dce4dc206976d4f0586f2c.gif', message: 'Cậu chắc chứ? 😢' },
  { gif: 'https://i.pinimg.com/originals/c8/07/e2/c807e26d8aed392f172f0bf441f60626.gif', message: 'Thử nghĩ lại nha 🥺' },
  { gif: 'https://i.pinimg.com/originals/0d/ac/7e/0dac7e14010362ff081e2167be218341.gif', message: 'Đừng mà, cho tớ cơ hội đi 💔' },
  { gif: 'https://i.pinimg.com/originals/88/e7/86/88e786492cc527584feee199936813dd.gif', message: 'Thiệt luôn đó hả? 😭' },
  { gif: 'https://i.pinimg.com/originals/82/be/ae/82beaeb21c686871437f88bbc1593288.gif', message: 'Một lần nữa thôi, năn nỉ đó 😞' },
  { gif: 'https://i.pinimg.com/originals/97/91/de/9791de11497556c4a5e800427c48fc47.gif', message: 'Tớ buồn đó nha... 😔' },
];

let clickCount = 0;

noBtn.addEventListener('click', () => {
  const index = clickCount % content.length;
  gif.src = content[index].gif;
  question.textContent = content[index].message;
  clickCount++;

  if (clickCount === 3) {
    noBtn.textContent = 'Bấm Có đi 😭';
  } else if (clickCount === 7) {
    noBtn.textContent = 'Đồng ý đi mà 😭';
  }

  if (clickCount <= 5) {
    sound1.play();
  } else if (clickCount <= 8) {
    sound2.play();
  } else {
    sound3.play();
  }

  const emoji = document.createElement('div');
  emoji.textContent = '😭';
  emoji.classList.add('emoji-effect');

  const rect = noBtn.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;
  emoji.style.left = `${rect.left + rect.width / 2}px`;
  emoji.style.top = `${rect.top + scrollY}px`;

  document.body.appendChild(emoji);

  setTimeout(() => emoji.remove(), 1000);

  noBtn.classList.add('shake');
  setTimeout(() => noBtn.classList.remove('shake'), 600);

});

yesBtn.addEventListener('click', () => {
  yesBtn.disabled = true;
  question.textContent = 'Tớ biết mà! Tớ cũng thích cậu nhiều lắm ❤️';
  gif.src = 'https://i.pinimg.com/originals/7e/f6/9c/7ef69cd0a6b0b78526c8ce983b3296fc.gif';
  noBtn.style.display = 'none';
  yesBtn.style.display = 'none';
  letterBtn.style.display = 'inline-flex';
  startFireworks();
  initBackground();
  sound4.currentTime = 103.5;
  sound4.play();
});


function initBackground() {
  const PHOTOS = Array.from({ length: 9 }, (_, i) => `./style/img/Anh (${i + 1}).jpg`);
  const FLOWERS = Array.from({ length: 8 }, (_, i) => `./style/flower/Anh (${i + 1}).png`);
  const GAP = 14;
  const TOTAL = 26;
  const ratioCache = {};

  const container = document.createElement('div');
  container.id = 'bg-gallery';
  document.body.prepend(container);

  function rnd(min, max) { return Math.random() * (max - min) + min; }
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  [...PHOTOS, ...FLOWERS].forEach(src => {
    const img = new Image();
    img.onload = () => { ratioCache[src] = img.naturalHeight / img.naturalWidth; };
    img.src = src;
  });

  const placedPhotos = [];
  const placedFlowers = [];
  const usageCount = {}; 

  function noOverlap(list, x, y, w, h) {
    return !list.some(p =>
      Math.abs(p.x - x) < (p.w / 2 + w / 2 + GAP) &&
      Math.abs(p.y - y) < (p.h / 2 + h / 2 + GAP)
    );
  }

  function spawnItem(isPhoto, fixedX, fixedY, w, h, initDelay) {
    setTimeout(() => {
      const pool = isPhoto ? PHOTOS : FLOWERS;
      const available = pool.filter(s => (usageCount[s] ?? 0) < 2);
      const src = (available.length > 0 ? available : pool)[Math.floor(Math.random() * (available.length || pool.length))];
      const rotSign = Math.random() < 0.5 ? -1 : 1;
      const rot = rotSign * rnd(12, 28);
      const op = isPhoto ? 0.82 : 0.92;
      const list = isPhoto ? placedPhotos : placedFlowers;

      let x = fixedX, y = fixedY;

      if (x === null) {
        const W = window.innerWidth, H = window.innerHeight;
        let ok = false;
        for (let i = 0; i < 120; i++) {
          x = rnd(w / 2 + 8, W - w / 2 - 8);
          y = rnd(h / 2 + 8, H - h / 2 - 8);
          if (noOverlap(list, x, y, w, h)) { ok = true; break; }
        }
        if (!ok) { spawnItem(isPhoto, null, null, w, h, 800); return; }
      }

      const entry = { x, y, w, h };
      list.push(entry);
      usageCount[src] = (usageCount[src] ?? 0) + 1;

      const el = document.createElement('img');
      el.src = src;
      el.classList.add('bg-item', isPhoto ? 'bg-photo' : 'bg-flower');
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.width = `${w}px`;
      el.style.height = 'auto';
      el.style.opacity = '0';
      el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.85)`;
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      container.appendChild(el);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = String(op);
        el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
      }));

      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.85)`;
        setTimeout(() => {
          el.remove();
          const idx = list.indexOf(entry);
          if (idx !== -1) list.splice(idx, 1);
          usageCount[src] = Math.max(0, (usageCount[src] ?? 1) - 1);
          spawnItem(isPhoto, null, null, w, h, 0);
        }, 650);
      }, rnd(3500, 8000));

    }, initDelay);
  }

  const W = window.innerWidth;
  const H = window.innerHeight;
  const COLS = Math.max(3, Math.round(Math.sqrt(TOTAL * W / H)));
  const ROWS = Math.ceil(TOTAL / COLS);
  const cellW = W / COLS;
  const cellH = H / ROWS;
  const maxPhotoW = Math.max(80, Math.min(160, cellW * 0.7));
  const maxFlowerW = Math.max(75, Math.min(145, cellW * 0.65));

  const cells = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      cells.push({ cx: (c + 0.5) * cellW, cy: (r + 0.5) * cellH });

  shuffle(cells).slice(0, TOTAL).forEach((cell, i) => {
    const isPhoto = i % 2 === 0;
    const maxW = isPhoto ? maxPhotoW : maxFlowerW;
    const w = Math.round(rnd(maxW * 0.6, maxW));
    const ratio = isPhoto ? 1.33 : 1.0;
    const h = Math.round(w * ratio);
    const x = Math.max(w / 2 + 8, Math.min(W - w / 2 - 8, cell.cx + rnd(-cellW * 0.1, cellW * 0.1)));
    const y = Math.max(h / 2 + 8, Math.min(H - h / 2 - 8, cell.cy + rnd(-cellH * 0.1, cellH * 0.1)));

    spawnItem(isPhoto, x, y, w, h, i * 220);
  });
}

function startFireworks() {
  const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 9500, scalar: 1.2 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  setInterval(function () {
    const particleCount = 50;
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.4), y: randomInRange(0.3, 0.5) }
    }));
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.6, 0.9), y: randomInRange(0.3, 0.5) }
    }));
  }, 500);
}


