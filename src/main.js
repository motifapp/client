const Lucia = require('lucia/dist/legacy/lucia.cjs');

const mainApp = () => {
  Lucia.createApp({
    slide: 0
  }).mount('#app');
};

mainApp();
