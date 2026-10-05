const assetBase = './assets/';
// Prices shown in the supplied design; confirm before retail deployment.
const prices = { 'G-600L': 29, FreedomSolo: 19, StageRocker2: 69 };
const catalogue = [
  ['G-600L', 'Keyboard', 'keyb.png'],
  ['G-600LA', 'Keyboard', 'g600al.png'],
  ['G900', 'Keyboard', 'g900.png'],
  ['FreedomSolo', 'Drums', 'FreedomSolo.png'],
  ['StageRocker2', 'Drums', 'StageRocker2.png'],
  ['MIC-01', 'Mics', 'mic.svg'],
  ['PARTY-12', 'Karaoke', 'speaker.svg'],
  ['KEY-49', 'Keyboard', 'keys.svg'],
  ['MIX-4', 'Mixers', 'mixer.svg'],
  ['LIVE-02', 'Mics', 'duo.svg'],
];
const productVideos = {
  'G-600L': 'G600L_PACK_EN_10MB.mp4',
  'G-600LA': 'G600LA_ENHD.mp4',
  'G900': 'G900_EN_10MB.mp4',
  'FreedomSolo': 'FreedomSolo_EN_10MB.mp4',
  'StageRocker2': 'Stage Rocker 2 DJ_2_HD.mp4',
};
const player = document.querySelector('#product-video');
const videoStatus = document.querySelector('#video-status');
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
  title.textContent = model;
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
  { name: 'KEYBOARDS', models: ['G-600L', 'G-600LA', 'G900', 'KEY-49'] },
  { name: 'GUITARS', models: [] },
  { name: 'DRUMS', models: ['FreedomSolo', 'StageRocker2'] },
  { name: 'DEEJAY', models: ['MIX-4'] },
  { name: 'KARAOKE', models: ['LIVE-02', 'MIC-01', 'PARTY-12'] },
  { name: 'PARTY SPEAKERS', models: ['PARTY-12'] },
  { name: 'K-POP', models: [] },
  { name: 'POCKET', models: [] },
  { name: 'mini VERSE', models: [] },
  { name: 'mySTAGE', models: [] },
  { name: 'GROOVE BRIX', models: [] },
  { name: '', models: [] },
];
function selectCategory(category, scroll = false) {
  const visible = category.models.map(model => catalogue.find(product => product[0] === model));
  document.querySelector('.featured-grid').replaceChildren(...visible.map(product => makeCard(product, true)));
  const grid = document.querySelector('.featured-grid');
  for (let i = visible.length; i < 8; i++) {
    const slot = document.createElement('div');
    slot.className = 'product-card product-placeholder';
    slot.setAttribute('aria-hidden', 'true');
    grid.append(slot);
  }
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

function showIntro() {
  clearTimeout(idleTimer);
  ++playbackRequest;
  player.pause();
  productPage.hidden = true;
  productPage.inert = true;
  introScreen.hidden = false;
  document.body.classList.add('intro-active');
  introVideo.currentTime = 0;
  introVideo.play().catch(() => {
    // The full-screen button remains available if autoplay is blocked.
  });
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
  introVideo.pause();
  introScreen.hidden = true;
  productPage.hidden = false;
  productPage.inert = false;
  document.body.classList.remove('intro-active');
  productPage.focus({ preventScroll: true });
  resetIdleTimer();
  selectCategory(categories[0]);
  document.querySelector('.featured-grid button.product-card').click();
});

if (reducedMotion) {
  introVideo.autoplay = false;
  introVideo.pause();
}
