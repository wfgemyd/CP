<script setup>


</script>

<template>

  <div class="first_page_login_container login-page">
    <img id="company_logo" src="../assets/nxp__logo.svg.png" alt="company log" title="NXP">
    <div class="welcoming_msg"><h1>Member Log In</h1></div>
    <div class="wbi_login_container">
      <form action="">
        <div class="input_container">
          <label class="input_label" for="email">Email:</label>
          <input type="text" id="username" name="username" placeholder="Enter your WBI" required>
        </div>
        <div class="input_container">
          <label class="input_label" for="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required>
        </div>
        <div class="login_btn">
          <button type="submit">Log In</button>
        </div>
      </form>

  </div>
  </div>


</template>

<style lang="sass">
@import '../styles/main.sass'
</style>