import { createApp } from 'lucia/dist/legacy/lucia.esm';

const mainApp = () => {
  const state = {
    beta: true,
    value: '',
    output: '',
    history: JSON.parse(localStorage.__guru_history ?? '[]'),
    async submit() {
      // const res = await fetch('someurl');
      // const body = await res.json();

      // this.output = body.data; // arbitrary prop ...
      this.output = 'we dont know yet :(';
      this.history.push(this.value);
      this.value = '';
      localStorage.__guru_history = JSON.stringify(this.history);
    },
  };

  createApp(state).mount('#app');
};

mainApp();
