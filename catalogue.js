const assetBase = 'https://idancekioskapp.vercel.app/assets/';
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
    player.src = 'https://idancekioskapp.vercel.app/vo/' + encodeURIComponent(productVideos[model]);
    player.setAttribute('aria-label', `${model} 產品影片`);
    videoStatus.textContent = model;
    document.querySelector('.hero').scrollIntoView({ block: 'start' });
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
  { name: 'Keyboard', image: 'keyb.png', models: ['G-600L', 'G-600LA', 'G900', 'KEY-49'] },
  { name: 'Drums', image: 'StageRocker2.png', models: ['FreedomSolo', 'StageRocker2'] },
  { name: 'Microphones', image: 'mic.svg', models: ['MIC-01', 'LIVE-02'] },
  { name: 'Karaoke', image: 'duo.svg', models: ['LIVE-02', 'MIC-01', 'PARTY-12'] },
  { name: 'Party Speakers', image: 'speaker.svg', models: ['PARTY-12'] },
  { name: 'Mixers', image: 'mixer.svg', models: ['MIX-4'] },
  { name: 'Music Production', image: 'g900.png', models: ['G900', 'G-600LA', 'MIX-4'] },
  { name: 'Portable Music', image: 'FreedomSolo.png', models: ['FreedomSolo', 'MIC-01'] },
  { name: 'Live Performance', image: 'StageRocker2.png', models: ['StageRocker2', 'LIVE-02', 'PARTY-12'] },
  { name: 'Home Studio', image: 'keys.svg', models: ['KEY-49', 'MIC-01', 'MIX-4'] },
  { name: 'Vocal Recording', image: 'mic.svg', models: ['MIC-01', 'LIVE-02', 'MIX-4'] },
  { name: 'Starter Collection', image: 'g600al.png', models: ['G-600L', 'FreedomSolo', 'KEY-49'] },
];
function selectCategory(category, scroll = false) {
  const visible = category.models.map(model => catalogue.find(product => product[0] === model));
  document.querySelector('.featured-grid').replaceChildren(...visible.map(product => makeCard(product, true)));
  document.querySelector('#featured-category').textContent = category.name;
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
  const image = document.createElement('img');
  image.src = assetBase + category.image;
  image.alt = '';
  image.loading = 'lazy';
  const label = document.createElement('strong');
  label.textContent = category.name;
  button.append(image, label);
  button.addEventListener('click', () => selectCategory(category, true));
  document.querySelector('.category-grid').append(button);
});
selectCategory(categories[0]);
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelector('video').autoplay = false;
  document.querySelector('video').pause();
}
