const assetBase = './assets/';
// Prices shown in the supplied design; confirm before retail deployment.

const prices = { 
  'G-600L': 29, 
  'G-600LA': 39,
  'G900': 49,
  'JAMHERO2E': 59,
  'STAGEROCKER2DJ': 69,
  'XD301(BK)': 79,
  'BEATBOXSTATION': 89,
  'BOOMBOX': 99,
  'PM31(SL)': 109,
  'CYCLONE-400(BK)': 119,
  'PARTY-GROOVE(BK)': 129,
  'PARTY-GROOVE-X3': 139,
  'CUBEX2-K': 149,
  'K200-2W': 159,
  'GBS-1/3/4': 169,
};

const catalogue = [
  ['G-600L', 'Keyboard', 'G600L.png'],
  ['G-600LA', 'Keyboard', 'G600LA.png'],
  ['G900', 'Keyboard', 'g900.png'],
  ['JAMHERO2E', 'GUITAR', 'JAMHERO2E.jpg'],
  ['STAGEROCKER2DJ', 'DRUMS', 'StageRocker2.png'], 
  ['XD301', 'DEEJAY', 'XD301.png'], 
  ['BEATBOXSTATION', 'DEEJAY', 'BEATBOXS.png'], 
  ['BOOMBOX', 'DEEJAY', 'BoomBox.png'], 
  ['PM31', 'KARAOKE ', 'PM31(SL).png'], 
  ['CYCLONE-400(BK)', 'PARTY SPEAKERS', 'cyclone.png'], 
  ['PARTY-GROOVE(BK)', 'PARTY SPEAKERS', 'pg.jpg'], 
  ['PARTY-GROOVE-X3', 'PARTY SPEAKERS', 'PartyGroove3.png'], 
  ['CUBEX2-K', 'PARTY SPEAKERS', 'cubex2.png'], 
  ['K200-2W', 'PARTY SPEAKERS', 'K200-2W.png'], 
  ['GBS-1/3/4', 'PARTY SPEAKERS', 'GBS.png'], 
  ['SONIC', 'K-POP', 'sonic-2.png'], 
  ['VS-1 KPOP', 'K-POP', 'vs1kpop.png'], 
  ['PM8KPOP', 'K-POP', 'PM8KPOP.png'], 
  ['PocketDJ', 'K-POP', 'PKDJ-3.png'], 
  ['DEEJAY ONE-KP', 'K-POP', 'DEEJAY ONE-3.png'], 
  ['K-SYNTH', 'K-POP', 'KS.png'], 

];

const productVideos = {
  'G-600L': 'G600L_PACK_EN_10MB.mp4',
  'G-600LA': 'G600LA_ENHD.mp4',
  'G900': 'G900_EN_10MB.mp4',
  'FreedomSolo': 'FreedomSolo_EN_10MB.mp4',
  'StageRocker2': 'Stage Rocker 2 DJ_2_HD.mp4',
  'JAMHERO2E': 'JamHero3.mp4',
  'STAGEROCKER2DJ': 'Stage Rocker 2 DJ_FRHD.mp4',
  'XD301': 'XD301.mp4',
  'BEATBOXSTATION': 'BEATBOX.mp4',
  'BOOMBOX': 'BoomBox-FR.mp4',
  'PM31(SL)': 'PM31(SL).mp4',
  'CYCLONE-400(BK)': 'Cyclone400_FRHD.mp4',
  'PARTY-GROOVE(BK)': 'PartyGroove-FRHD.mp4',
  'PARTY-GROOVE-X3': 'PartyGroove-FRHD.mp4',
  'CUBEX2-K': 'CUBE X2 KPOP-FRHD.mp4',
  'K200-2W': 'K200-2W.mp4',
  'GBS-1/3/4': 'GBS-1_3_4.mp4',
  'SONIC': 'sonic.mp4',
  'VS-1 KPOP': 'vs1.mp4',
  'PM8KPOP': 'pm8-kpop.mp4',
  'PocketDJ': 'pocketdj.mp4',
  'DEEJAY ONE-KP': 'deejayone.mp4',
  'K-SYNTH': 'k-synth.mp4',
};

const player = document.querySelector('#product-video');
const videoStatus = document.querySelector('#video-status');
const productSound = document.querySelector('#product-sound');
const productVolume = document.querySelector('#product-volume');
let lastProductVolume = player.volume || 1;
function syncProductAudio() {
  const silent = player.muted || player.volume === 0;
  productSound.textContent = silent ? 'SOUND ON' : 'MUTE';
  productSound.setAttribute('aria-label', silent ? '開啟產品影片聲音' : '靜音產品影片');
  productSound.setAttribute('aria-pressed', String(silent));
  productVolume.value = silent ? 0 : Math.round(player.volume * 100);
}
productSound.addEventListener('click', () => {
  if (player.muted || player.volume === 0) {
    player.volume = lastProductVolume;
    player.muted = false;
  } else {
    lastProductVolume = player.volume;
    player.muted = true;
  }
  syncProductAudio();
});
productVolume.addEventListener('input', () => {
  const volume = Number(productVolume.value) / 100;
  player.volume = volume;
  player.muted = volume === 0;
  if (volume > 0) lastProductVolume = volume;
  syncProductAudio();
});
player.addEventListener('volumechange', syncProductAudio);
syncProductAudio();

let playbackRequest = 0;
let selectedModel = '';
player.addEventListener('error', () => {
  videoStatus.textContent = '影片暫時未能載入，請稍後再試。';
});
function makeCard([model, category, image], compact = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'product-card';
  button.setAttribute('aria-controls', 'product-video');
  button.setAttribute('aria-pressed', String(selectedModel === model));
  button.dataset.model = model;
  const img = document.createElement('img');
  img.src = assetBase + image;
  img.alt = model;
  img.loading = 'lazy';
  const title = document.createElement('strong');
  title.textContent = model === 'STAGEROCKER2DJ' ? 'STAGE\nROCKER2DJ' : model;
  button.append(img, title);
  {
    const price = document.createElement('span');
    price.className = 'product-price';
    price.append(prices[model] !== undefined ? String(prices[model]) : '—', ' ');
    if (prices[model] === undefined) price.setAttribute('aria-label', '價錢待確認');
    const currency = document.createElement('small');
    currency.textContent = 'EUR';
    price.append(currency);
    button.append(price);
  }
  if (!compact) {
    const label = document.createElement('small');
    label.textContent = category;
    button.append(label);
  }
  if (!productVideos[model]) {
    button.disabled = true;
    const unavailable = document.createElement('small');
    unavailable.textContent = '影片即將推出';
    button.append(unavailable);
  }
  button.addEventListener('click', async () => {
    const request = ++playbackRequest;
    selectedModel = model;
    document.querySelectorAll('.featured .product-card').forEach(card => {
      card.setAttribute('aria-pressed', String(card.dataset.model === model));
    });
    player.pause();
    player.poster = assetBase + image;
    player.src = './vo/' + encodeURIComponent(productVideos[model]);
    player.setAttribute('aria-label', `${model} 產品影片`);
    videoStatus.textContent = model;

    try {
      await player.play();
    } catch {
      if (request === playbackRequest) videoStatus.textContent = `${model}：請按播放鍵重試。`;
    }
  });
  return button;
}
// Curated collections can share products; model details stay in the catalogue above.
const categories = [
  { name: 'KEYBOARDS', models: ['G-600L', 'G-600LA', 'G900'] },
  { name: 'GUITARS', models: ['JAMHERO2E'] },
  { name: 'DRUMS', models: ['STAGEROCKER2DJ'] },
  { name: 'DEEJAY', models: ['XD301', 'BEATBOXSTATION', 'BOOMBOX'] },
  { name: 'KARAOKE', models: ['PM31'] },
  { name: 'PARTY SPEAKERS', models: ['CYCLONE-400(BK)', 'PARTY-GROOVE(BK)', 'PARTY-GROOVE-X3', 'CUBEX2-K', 'K200-2W', 'GBS-1/3/4'] },
  { name: 'K-POP', models: ['SONIC', 'VS-1 KPOP', 'PM8KPOP', 'PocketDJ', 'DEEJAY ONE-KP', 'K-SYNTH'] },
  { name: 'POCKET', models: [] },
  { name: 'mini VERSE', models: [] },
  { name: 'mySTAGE', models: [] },
  { name: 'GROOVE BRIX', models: [] },
  { name: '', models: [] },
];
function selectCategory(category, scroll = false) {
  // Deleted products may still be listed in a category; skip stale references.
  const visible = category.models
    .map(model => catalogue.find(product => product && product[0] === model))
    .filter(Boolean);
  const grid = document.querySelector('.featured-grid');
  grid.replaceChildren();
  const pageCount = Math.max(1, Math.ceil(visible.length / 8));
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const page = document.createElement('div');
    page.className = 'featured-page';
    page.setAttribute('role', 'group');
    page.setAttribute('aria-label', `${category.name}：第 ${pageIndex + 1} / ${pageCount} 頁`);
    for (let slotIndex = 0; slotIndex < 8; slotIndex++) {
      const product = visible[pageIndex * 8 + slotIndex];
      if (product) {
        page.append(makeCard(product, true));
      } else {
        const slot = document.createElement('div');
        slot.className = 'product-card product-placeholder';
        slot.setAttribute('aria-hidden', 'true');
        page.append(slot);
      }
    }
    grid.append(page);
  }
  grid.scrollLeft = 0;
  document.querySelector('#featured').scrollTop = 0;
  document.querySelector('#featured-category').textContent = visible.length ? category.name : `${category.name}: 暫未有產品`;
  document.querySelector('#selection-status').textContent = `${category.name}: ${visible.length} products`;
  document.querySelectorAll('.category-card').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.category === category.name));
  });
  if (scroll) document.querySelector('#featured').scrollIntoView({ block: 'start' });
}
categories.forEach(category => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'category-card';
  button.dataset.category = category.name;
  button.setAttribute('aria-controls', 'featured');
  const label = document.createElement('strong');
  label.textContent = category.name;
  button.append(label);
  if (!category.name) {
    button.disabled = true;
    button.setAttribute('aria-label', '預留分類');
  }
  button.addEventListener('click', () => selectCategory(category));
  document.querySelector('.category-grid').append(button);
});
selectCategory(categories[0]);
const introScreen = document.querySelector('#intro-screen');
const introVideo = document.querySelector('#intro-video');
const productPage = document.querySelector('#top');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let idleTimer;
const introSound = document.querySelector('#intro-sound');
let introMuted = false;
let introPlayRequest = 0;

function updateIntroSound() {
  introSound.textContent = introVideo.muted ? 'SOUND ON' : 'MUTE';
  introSound.setAttribute('aria-label', introVideo.muted ? '開啟開場影片聲音' : '靜音開場影片');
  introSound.setAttribute('aria-pressed', String(introVideo.muted));
}

async function playIntro() {
  const request = ++introPlayRequest;
  introVideo.muted = introMuted;
  updateIntroSound();
  try {
    await introVideo.play();
  } catch (error) {
    if (request !== introPlayRequest || introScreen.hidden) return;
    if (error.name === 'NotAllowedError' && !introVideo.muted) {
      introVideo.muted = true;
      updateIntroSound();
      try { await introVideo.play(); } catch (_) { /* Sound button can retry playback. */ }
    }
  }
}

introVideo.addEventListener('volumechange', updateIntroSound);
introSound.addEventListener('click', () => {
  introMuted = !introVideo.muted;
  playIntro();
});

function showIntro() {
  clearTimeout(idleTimer);
  ++playbackRequest;
  player.pause();
  productPage.hidden = true;
  productPage.inert = true;
  introScreen.hidden = false;
  document.body.classList.add('intro-active');
  introVideo.currentTime = 0;
  playIntro();
  introScreen.focus({ preventScroll: true });
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  if (introScreen.hidden) idleTimer = setTimeout(showIntro, 3 * 60 * 1000);
}

['pointerdown', 'click', 'keydown', 'wheel', 'touchmove', 'scroll'].forEach(event => {
  document.addEventListener(event, resetIdleTimer, { capture: true, passive: true });
});

introScreen.addEventListener('click', () => {
  ++introPlayRequest;
  introVideo.pause();
  introScreen.hidden = true;
  productPage.hidden = false;
  productPage.inert = false;
  document.body.classList.remove('intro-active');
  productPage.focus({ preventScroll: true });
  resetIdleTimer();
  selectCategory(categories[0]);
  const firstProduct = document.querySelector('.featured-grid button.product-card:not(:disabled)');
  if (firstProduct) firstProduct.click();
});

if (reducedMotion) {
  introVideo.autoplay = false;
  introVideo.pause();
} else {
  playIntro();
}
