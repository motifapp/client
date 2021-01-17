import {
  createApp
} from './lucia.esm';

import gsap from "gsap";

createApp({
  slide: 0,
  value: ' ',
  submit() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      url: this.value
    });

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

let hitbox = document.querySelectorAll('.hitbox');
document.querySelector('.arrow').addEventListener('click', function () {
  slideTextRev.restart();
  slideSwap.restart();
  let btnClick = document.getElementById('arrowClick');
  btnClick.volume = 1;
  btnClick.play();
  let audio = document.getElementById('bgm');
  audio.volume = 1;
  audio.play();
  console.log('lol');
});

document.querySelector('[l-if="slide === 2"] .mainBtn .hitbox').addEventListener('click', function() {
  slideTextRev.restart();
});

document.querySelector('#skipBtn').addEventListener('click', function () {
  slideSwap.restart();
  let btnClick = document.getElementById('arrowClick');
  btnClick.volume = 1;
  btnClick.play();
  let audio = document.getElementById('bgm');
  audio.volume = 1;
  audio.play();
});

hitbox.forEach(function (el) {
  el.addEventListener('click', function () {
    slideSwap.restart();
    let btnClick = document.getElementById('btnClick');
    btnClick.volume = 1;
    btnClick.play();
  });
});


const textrev = gsap.timeline();

textrev.from('.line h1', {
  y: 250,
  ease: 'power4.out',
  delay: 1,
  skewY: 10,
  stagger: {
    amount: 0.3,
  },
  duration: 0.9,
});

const slideTextRev = gsap.timeline({
  paused: true
});

const slideSwap = gsap.timeline({
  paused: true
});
const slideTwoScroll = gsap.timeline({
  paused: true
});
// const slideTwoOpacity = gsap.timeline({
//   paused: true
// });

slideTextRev.from('#p', {
  opacity: 0,
  y: 20,
  ease: Expo.easeInOut,
  delay: 1.2,
  duration: 3,
  stagger: {
    amount: 0.4
  }
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


// slide 3

var n1 = document.querySelector('.n1'),
  n2 = document.querySelector('.n2'),
  n3 = document.querySelector('.n3');

slideTwoScroll.from(n1.children, {
  y: 50,
  opacity: 0,
  ease: 'power4.out',
  delay: 2,
  duration: 2,
  stagger: {
    amount: 0.3
  }
}).to(n1.children, {
  opacity: 0,
  display: 'none',
  ease: 'power2.out',
  delay: 4,
  duration: 1,
}).to(n2, {
  y: '-100vh',
  duration: 0.1
}).from(n2.children, {
  y: 30,
  opacity: 0,
  ease: 'power4.out',
  duration: 2,
  stagger: {
    amount: 0.3
  }
}).to(n2.children, {
  opacity: 0,
  display: 'none',
  ease: 'power2.out',
  delay: 4,
  duration: 1,
}).to(n3, {
  y: '-200vh',
  duration: 0.1
}).from(n3.children, {
  y: 30,
  opacity: 0,
  ease: 'power4.out',
  duration: 2,
  stagger: {
    amount: 0.3
  }
});


// slideTwoScroll.to('.n1', {
//   // opacity: 0,
//   y: '-100%',
//   delay: 7,
//   ease: 'power2.inOut', // transition from 1st
//   duration: 1
// }).to('.n2', {
//   // opacity: 1,
//   y: '-100%',
//   ease: 'power2.inOut', //transition to 2nd
//   duration: 1
// }).to('.n2', {
//   // opacity: 0,
//   delay: 6,
//   y: '-200%',
//   ease: 'power2.inOut', //transition from 2nd
//   duration: 1
// }).to('.n3', {
//   // opacity: 1,
//   y: '-200%',
//   ease: 'power2.inOut', //transition to 3rd
//   duration: 1
// });

// slideTwoOpacity.to('.n1', {
//   opacity: 0,
//   delay: 7,
//   ease: 'power2.inOut',
//   duration: 0.7
// }).to('.n2', {
//   opacity: 1,
//   delay: 0.3,
//   ease: 'power2.inOut',
//   duration: 0.7
// }).to('.n2', {
//   opacity: 0,
//   delay: 6.3,
//   ease: 'power2,inOut',
//   duration: 0.7
// }).to('.n3', {
//   delay: 0.3,
//   opacity: 1,
//   ease: 'power2,inOut',
//   duration: 0.7
// });

document.querySelector('[l-if="slide === 1"] .mainBtn .hitbox').addEventListener('click', function () {
  slideTwoScroll.restart();
  // slideTwoOpacity.restart();
});