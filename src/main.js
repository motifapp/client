import { createApp } from 'lucia';

const mainApp = () => {
  const state = {
    message: 'WHATS UP GAMERS',
  };

  createApp(state).mount('#app');
};

mainApp();
