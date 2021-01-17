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