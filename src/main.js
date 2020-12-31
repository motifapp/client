import { createApp } from 'lucia/dist/lucia.esm';

const mainApp = () => {
  const state = {
    message: 'WHATS UP GAMERS',
  };

  createApp(state).mount('#app');
};

mainApp();