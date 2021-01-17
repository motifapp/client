const Lucia = require('lucia/dist/legacy/lucia.cjs');

const mainApp = () => {
  Lucia.createApp({
    slide: 0,
  }).mount('#app');
};

mainApp();

const textrev = gsap.timeline();

textrev.from(".line h1", {
  y: 250,
  ease: "power4.out",
  delay: 1,
  skewY: 10,
  stagger: {
    amount: 0.2,
  },
  duration: 0.9
});

const slideSwap = gsap.timeline({
  paused: true
});

slideSwap.fromTo('.slideSwap', {
  x: '0'
}, {
  x: '100%',
  duration: 0.7,
  ease: "power4.out",
  delay: 0.2
}).to('.slideSwap', {
  x: '200%',
  duration: 0.7,
  ease: "power4.out",
  delay: 0.5
});

let hitbox = document.querySelectorAll('.hitbox');
let startArrow = document.querySelector('.arrow');
startArrow.addEventListener('click', function () {
  slideSwap.restart()
})

hitbox.forEach(function (item) {
  item.addEventListener('click', function () {
    slideSwap.restart()
  })
})