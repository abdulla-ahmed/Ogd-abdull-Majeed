const animationContainer = document.getElementById('animation-container');

if (!animationContainer) {
  console.error('Animation container not found!');
  return; // Stop execution if container is missing
}

const animationData = {
  container: animationContainer,
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: 'Medical Shield.json' // Updated path (no spaces)
};

const anim = lottie.loadAnimation(animationData);

// Debugging events
anim.addEventListener('DOMLoaded', () => {
  console.log('Animation DOM loaded!');
});

anim.addEventListener('complete', () => {
  console.log('Animation complete!');
  animationContainer.style.display = 'none';
  document.querySelector('.container').style.display = 'block';
});

anim.addEventListener('data_failed', () => {
  console.error('Failed to load animation data!');
});

anim.addEventListener('error', (err) => {
  console.error('Animation error:', err);
});
