<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await axios.post('/login', {
      username: username.value,
      password: password.value
    });

    if (response.data.success) {
      // Set the default Authorization header with the received token
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('wbi', response.data.wbi);
      localStorage.setItem('uId', response.data.uId);
      localStorage.setItem('employment_name', response.data.employment_name);

      // Check the user's role and redirect accordingly
      if (response.data.role === 'New Employee') {
        await router.push('/onboarding');
      } else {
        await router.push('/tickets'); // or any other appropriate route for non-new employees
      }
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