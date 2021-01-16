const Lucia = require('./lucia.cjs');

Lucia.createApp({
  slide: 0,
  next() {
    if (this.slide < 2) this.slide++;
  },
}).mount('#app');
