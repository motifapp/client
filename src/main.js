import {
  createApp
} from './lucia.esm';

createApp({
  slide: 0,
  value: ' ',
  odometer_value: 230,
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
document.querySelector('.arrow').addEventListener('click', function () {
  slideSwap.restart();
  let btnClick = document.getElementById('arrowClick');
  btnClick.volume = 1;
  btnClick.play();
  let audio = document.getElementById('bgm');
  audio.volume = 1;
  audio.play();
  console.log('lol');
});

hitbox.forEach(function (el) {
  el.addEventListener('click', function () {
    slideSwap.restart();
    let btnClick = document.getElementById('btnClick');
    btnClick.volume = 1;
    btnClick.play();
  });
});

// slide 3

slideTwoScroll.to('.n1', {
  // opacity: 0,
  y: '-100%',
  delay: 7,
  ease: 'power2.inOut', // transition from 1st
  duration: 1,
  onComplete: () => {
    paypal.update(25286)
  }
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
  duration: 1,
  onComplete: () => {
    shakespear.update(17121)
  }
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

document.querySelector('[l-if="slide === 1"] .mainBtn .hitbox').addEventListener('click', function () {
  slideTwoScroll.restart();
  setTimeout(() => {
    airbnb.update(19363)
  }, 1500)
  slideTwoOpacity.restart();
});


let airbnb = new Odometer({
  el: document.querySelector("#app > div:nth-child(3) > div > section.reveal.n1 > div > h1"),
  value: 0,

  format: '',
  theme: 'minimal'
});

let paypal = new Odometer({
  el: document.querySelector("#app > div:nth-child(3) > div > section.reveal.n2 > div > h1"),
  value: 0,

  format: '',
  theme: 'minimal'
})

let shakespear = new Odometer({
  el: document.querySelector("#app > div:nth-child(3) > div > section.reveal.n3 > h2:nth-child(2)"),
  value: 25286,

  format: '',
  theme: 'minimal'
})
