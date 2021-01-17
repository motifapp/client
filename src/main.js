const Lucia = require('./lucia.cjs');

Lucia.createApp({
  slide: 0,
}).mount('#app');

const textrev = gsap.timeline();

textrev.from('.line h1', {
  y: 250,
  ease: 'power4.out',
  delay: 1,
  skewY: 10,
  stagger: {
    amount: 0.2,
  },
  duration: 0.9,
});

const slideSwap = gsap.timeline({
  paused: true,
});

const slideTwoScroll = gsap.timeline({
  paused: true,
});

slideSwap
  .fromTo(
    '.slideSwap',
    {
      y: '0',
    },
    {
      y: '-100%',
      duration: 0.7,
      ease: 'power4.out',
      delay: 0.2,
    }
  )
  .to('.slideSwap', {
    y: '0',
    duration: 0.7,
    ease: 'power4.out',
    delay: 0.2,
  });

let hitbox = document.querySelectorAll('.hitbox');
let startArrow = document.querySelector('.arrow');
startArrow.addEventListener('click', function () {
  slideSwap.restart();
});

hitbox.forEach(function (item) {
  item.addEventListener('click', function () {
    slideSwap.restart();
  });
});

// slideTwoScroll.fromTo('.n1', {
//   y: 0
// }, {
//   y: '-100vh',
//   delay: 3,
//   ease: 'power4.out',
//   duration: 0.7
// }).to();
