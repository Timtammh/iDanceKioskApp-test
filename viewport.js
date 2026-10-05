// Keep the kiosk canvas measurable in WebViews without cqw or dvh support.
(function () {
  function resizeCanvas() {
    var viewport = window.visualViewport;
    var width = viewport ? viewport.width : window.innerWidth;
    var height = viewport ? viewport.height : window.innerHeight;
    var canvasWidth = Math.min(1080, width, height * 9 / 16);
    var style = document.documentElement.style;
    style.setProperty('--page-width', canvasWidth + 'px');
    style.setProperty('--page-height', (canvasWidth * 16 / 9) + 'px');
    style.setProperty('--page-unit', (canvasWidth / 100) + 'px');
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resizeCanvas);
  }
}());
