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

hitbox.forEach(function (el) {
  el.addEventListener('click', function () {
    slideSwap.restart();
  });
});

// slide 3

slideTwoScroll.to('.n1', {
  opacity: 0,
  y: '-100%',
  delay: 7,
  ease: 'power2.inOut',// transition from 1st
  duration: 1
}).to('.n2', {
  opacity: 1,
  y: '-100%',
  ease: 'power2.inOut', //transition to 2nd
  duration: 1
}).to('.n2', {
  opacity: 0,
  delay: 6,
  y: '-200%',
  ease: 'power2.inOut', //transition from 2nd
  duration: 1
}).to('.n3', {
  opacity: 1,
  y: '-200%',
  ease: 'power2.inOut', //transition to 3rd
  duration: 1
});

let beforeSlideBtn = document.querySelector('[l-if="slide === 1"] .mainBtn .hitbox');
beforeSlideBtn.addEventListener('click', function () {
  slideTwoScroll.restart();
});
