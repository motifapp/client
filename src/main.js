import { createApp } from './lucia.esm';
import Chart from 'chart.js';

import gsap from 'gsap';

const appearAfter = gsap.timeline({
  paused: 'true',
});

let verdictBlockKids = document.querySelector('.verdictBlock').children;

appearAfter
  .from(verdictBlockKids, {
    display: 'none',
    duration: 0.1,
  })
  .from(verdictBlockKids, {
    opacity: 0,
    y: 20,
    duration: 1,
    stagger: {
      amount: 0.4,
    },
  });

document.querySelector('.btnCustom').addEventListener('click', function () {
  appearAfter.reverse();
  setTimeout(() => {
    formrev.restart();
  }, 1100);
});

// import Odometer from './odometer';

createApp({
  slide: 0,
  value: ' ',
  odometer_value: 230,
  submit() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const url = document.querySelector('.inputText').value.trim();

    if (!url) return alert('Invalid Link Given');

    const raw = JSON.stringify({
      url: url,
    });

    const requestOptions = {
      method: 'POST',
      headers,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://super-duper-pancake.willdoescode.repl.co/metrics', requestOptions)
      .then((response) => response.json())
      .then((r) => {
        let verdictText = document.querySelector('.verdictText');
        formrev.reverse();
        setTimeout(() => {
          appearAfter.restart();
        }, 1500);
        // let verdictBlock = document.querySelector('.verdictBlock');
        // verdictBlock.classList.add('active');

        verdictText.style.display = 'block';
        if (r.goodBadVerdict === 'good') {
          // verdictText.style.color = 'green';
          var verdictClass = 'green';
        } else if (r.goodBadVerdict === 'bad') {
          // verdictText.style.color = 'red';
          var verdictClass = 'red';
        }

        const fKeywordws = document.querySelector('.flaggedkeywords');
        const tSentences = document.querySelector('.totalsentences');
        fKeywordws.style.display = 'block';
        fKeywordws.innerHTML = `Total Flagged Keywords: ${r.flaggedKeywordTotal}`;
        tSentences.style.display = 'block';
        tSentences.innerHTML = `Total Sentences Scanned: ${r.totalNumOfSentaces}`;

        verdictText.innerHTML = `Verdict: <span class="${verdictClass}">${
          r.goodBadVerdict === 'good' ? 'Good' : 'Bad'
        }</span>`;
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        canvas.id = 'myChart';
        document.querySelector('#myChart').replaceWith(canvas);
        const ctx = document.querySelector('#myChart').getContext('2d');
        let myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Percent Of Unflagged Sentences', 'Percent Of Flagged Sentences'],
            datasets: [
              {
                label: 'Scores',
                data: [r.percentGood, r.percentBad],
                backgroundColor: ['rgba(27, 181, 150,0.2)', 'rgba(255,0,0,0.2)'],
                borderColor: ['rgba(27, 181, 150, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              ],
            },
          },
        });
      })
      .catch((error) => {
        alert('Invalid Link Given');
        console.error(error);
      });
  },
}).mount('#app');

document.querySelector('.inputText').value = '';

const slideSwap = gsap.timeline({
  paused: true,
});

const slideTwoScroll = gsap.timeline({
  paused: true,
});

const introrev = gsap.timeline();
const formrev = gsap.timeline({
  paused: true,
});

const formrev2 = gsap.timeline({
  paused: true,
});

formrev
  .from('[l-if="slide === 5"] .formBlock h1', {
    display: 'none',
    y: 300,
    ease: 'power4.out',
    delay: 1.4,
    skewY: 10,
    stagger: {
      amount: 0.3,
    },
    duration: 0.9,
  })
  .from(
    '[l-if="slide === 5"] input[type="text"]',
    {
      opacity: 0,
      // display: 'none',
      duration: 0.5,
    },
    '-=0.4'
  );

let muted = localStorage.muted === 'true';

var sound = document.querySelectorAll('audio');

document.addEventListener('DOMContentLoaded', function () {
  for (let i = 0; i < sound.length; i++) {
    if (!muted) {
      sound[i].volume = 1;
    } else {
      document.querySelector('.muteBtn').classList.remove('fa-volume-up');
      document.querySelector('.muteBtn').classList.add('fa-volume-mute');

      sound[i].volume = 0;
    }
  }
  introrev
    .from(document.querySelector('.splash').children, {
      // scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 1,
    })
    .from('.line h1', {
      y: 250,
      ease: 'power4.out',
      // delay: 0.4,
      skewY: 10,
      stagger: {
        amount: 0.3,
      },
      duration: 0.9,
    })
    .from(
      '.arrow',
      {
        duration: 1,
        ease: 'power3.out',
        y: 20,
        opacity: 0,
      },
      '-=0.6'
    )
    .from(
      '.blockWrapper h3',
      {
        duration: 0.6,
        opacity: 0,
      },
      '-=0.6'
    )
    .from(
      '.mediaCtrl',
      {
        duration: 0.6,
        opacity: 0,
      },
      '-=0.6'
    );
});

slideSwap
  .fromTo(
    '.slideSwap',
    {
      y: '0',
      display: 'none',
    },
    {
      y: '-100%',
      display: 'block',
      duration: 0.7,
      ease: 'power4.out',
      delay: 0.2,
    }
  )
  .to('.slideSwap', {
    y: '0',
    display: 'none',
    duration: 0.7,
    ease: 'power4.out',
    delay: 0.2,
  });

let hitbox = document.querySelectorAll('.hitbox');
document.querySelector('.arrow').addEventListener('click', function () {
  slideTextRev.restart();
  slideSwap.restart();
  let btnClick = document.getElementById('arrowClick');

  let audio = document.getElementById('bgm');
  if (!muted) {
    btnClick.volume = 1;
    btnClick.play();
    audio.volume = 1;
    audio.play();
  }
});

document.querySelector('#skipBtn').addEventListener('click', function () {
  // slideTextRev.restart();
  formrev.restart();
  slideSwap.restart();
  let btnClick = document.getElementById('arrowClick');

  let audio = document.getElementById('bgm');
  if (!muted) {
    btnClick.volume = 1;
    btnClick.play();
    audio.volume = 1;
    audio.play();
  }
});

hitbox.forEach(function (el) {
  el.addEventListener('click', function () {
    slideSwap.restart();
    let btnClick = document.getElementById('btnClick');
    if (!muted) {
      btnClick.volume = 1;
      btnClick.play();
    }
  });
});

const slideTextRev = gsap.timeline({
  paused: true,
});

slideTextRev.from('#p', {
  opacity: 0,
  y: 20,
  ease: 'Expo.easeInOut',
  delay: 1.2,
  duration: 3,
  stagger: {
    amount: 0.4,
  },
});

document
  .querySelector('[l-if="slide === 2"] .mainBtn .hitbox')
  .addEventListener('click', function () {
    slideTextRev.restart();
  });

document
  .querySelector('[l-if="slide === 3"] .mainBtn .hitbox')
  .addEventListener('click', function () {
    slideTextRev.restart();
  });

document
  .querySelector('[l-if="slide === 4"] .mainBtn .hitbox')
  .addEventListener('click', function () {
    formrev.restart();
  });
document.querySelector('[l-if="slide === 1"] .hitbox').addEventListener('click', function () {
  slideTwoScroll.restart();
  // setTimeout(() => {
  //   paypal.update(19363)
  // }, 1500)
  // slideTwoOpacity.restart();
});

let airbnb = new Odometer({
  el: document.querySelector('.n1 .num h1 span'),
  value: 0,

  format: '',
  theme: 'minimal',
});

let paypal = new Odometer({
  el: document.querySelector('.n2 .num h1 span'),
  value: 0,

  format: '',
  theme: 'minimal',
});

let shakespear = new Odometer({
  el: document.querySelector('.n3 h2 .odom'),
  value: 25286,

  format: '',
  theme: 'minimal',
});

var n1 = document.querySelector('.n1'),
  n2 = document.querySelector('.n2'),
  n3 = document.querySelector('.n3');

slideTwoScroll
  .from(n1.children, {
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 2,
    duration: 2,
    stagger: {
      amount: 0.3,
    },
    onStart: () => {
      airbnb.update(25286);
    },
  })
  .to(n1.children, {
    opacity: 0,
    display: 'none',
    ease: 'power2.out',
    delay: 4,
    duration: 1,
  })
  .to(n2, {
    y: '-100vh',
    duration: 0.1,
  })
  .from(n2.children, {
    y: 30,
    opacity: 0,
    ease: 'power4.out',
    duration: 2,
    stagger: {
      // airbnb.update(19363)
      amount: 0.3,
    },
    onStart: () => {
      paypal.update(19363);
    },
  })
  .to(n2.children, {
    opacity: 0,
    display: 'none',
    ease: 'power2.out',
    delay: 4,
    duration: 1,
  })
  .to(n3, {
    y: '-200vh',
    duration: 0.1,
  })
  .from(n3.children, {
    y: 30,
    opacity: 0,
    ease: 'power4.out',
    duration: 2,
    stagger: {
      amount: 0.3,
    },
    onStart: () => {
      shakespear.update(17121);
    },
  });

document.querySelector('#myChart').style.background = '#0C0C0C';

document.querySelector('.muteBtn').addEventListener('click', function () {
  let el = this;
  if (!muted) {
    for (let i = 0; i < sound.length; i++) {
      sound[i].volume = 0;
    }
    el.classList.remove('fa-volume-up');
    el.classList.add('fa-volume-mute');
    localStorage.muted = 'true';
    muted = true;
  } else {
    for (let i = 0; i < sound.length; i++) {
      sound[i].volume = 1;
      if (sound[i].paused) sound[i].play();
    }
    el.classList.remove('fa-volume-mute');
    el.classList.add('fa-volume-up');
    localStorage.muted = 'false';
    muted = false;
  }
});
