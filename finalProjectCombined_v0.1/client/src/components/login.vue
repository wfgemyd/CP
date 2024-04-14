<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const username = ref('');
const password = ref('');



const login = async message => {


  try {
    const response = await axios.post('/login', {
      username: username.value,
      password: password.value
    });

    console.log('Login response received:', response.data);

    if (response.data.success) {
      await router.push('/onboarding');
    } else {
      console.error('Invalid password or login error');
    }
  } catch (error) {
    console.error('Login request error:', error);
    //popup error message
    alert(`Login request error: wrong username or password. Please try again.`);
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    username.value = '';
    password.value = '';

  }
};
</script>

<template>
<div class="wrapper">
  <div class="first_page_login_container login-page">
    <img id="company_logo" src="../assets/nxp__logo.svg.png" alt="company log" title="NXP">
    <div class="welcoming_msg"><h1>Member Log In</h1></div>
    <div class="wbi_login_container">
      <form @submit.prevent="login">
        <div class="input_container">
          <label class="input_label" for="email">Email:</label>
          <input type="text" id="username" v-model="username" placeholder="Enter your WBI" required>
        </div>
        <div class="input_container">
          <label class="input_label" for="password">Password:</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" required>
        </div>
        <div class="login_btn">
          <button type="submit">Log In</button>
        </div>
      </form>

  </div>
  </div>
</div>

</template>
<style lang="sass">
@use '../styles/_index.sass' as *


</style>