const Lucia = require('./lucia.cjs');

const mainApp = () => {
  Lucia.createApp({ slide: 0 }).mount('#app');
};

mainApp();
