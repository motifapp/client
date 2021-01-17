import { createApp } from './lucia.esm';

createApp({
  slide: 0,
  value: ' ',
  submit() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ url: this.value });

    const requestOptions = {
      method: 'POST',
      headers,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://super-duper-pancake.willdoescode.repl.co/metrics', requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  },
}).mount('#app');

const textrev = gsap.timeline();

window.addEventListener("DOMContentLoaded", event => {
  const audio = document.querySelector("audio");
  audio.volume = 1;
  audio.play();
});


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
const slideTwoOpacity = gsap.timeline({
  paused: true,
});


slideSwap
  .fromTo(
    '.slideSwap', {
      y: '0',
    }, {
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
  // opacity: 0,
  y: '-100%',
  delay: 7,
  ease: 'power2.inOut', // transition from 1st
  duration: 1
}).to('.n2', {
  // opacity: 1,
  y: '-100%',
  ease: 'power2.inOut', //transition to 2nd
  duration: 1
}).to('.n2', {
  // opacity: 0,
  delay: 6,
  y: '-200%',
  ease: 'power2.inOut', //transition from 2nd
  duration: 1
}).to('.n3', {
  // opacity: 1,
  y: '-200%',
  ease: 'power2.inOut', //transition to 3rd
  duration: 1
});

slideTwoOpacity.to('.n1', {
  opacity: 0,
  delay: 7,
  ease: 'power2.inOut',
  duration: 0.7
}).to('.n2', {
  opacity: 1,
  delay: 0.3,
  ease: 'power2.inOut',
  duration: 0.7
}).to('.n2', {
  opacity: 0,
  delay: 6.3,
  ease: 'power2,inOut',
  duration: 0.7
}).to('.n3', {
  delay: 0.3,
  opacity: 1,
  ease: 'power2,inOut',
  duration: 0.7
});

let beforeSlideBtn = document.querySelector('[l-if="slide === 1"] .mainBtn .hitbox');
beforeSlideBtn.addEventListener('click', function () {
  slideTwoScroll.restart();
  slideTwoOpacity.restart();
});