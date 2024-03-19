<script setup>

</script>

<template>
  <div class="navbar-container">
    <nav class="onboarding_nav">
      <div id="nav-left">
        <a href="#" title="Home page"> <img class="nav-logo" src="../assets/nxp__logo.svg.png" alt="firm logo"> </a>
      </div>
      <ul id="nav_items">
        <li class="user-info"> <!-- Changed to class for reuse -->
          <div>Full name</div>
          <div class="wbi">WBI</div>
        </li>
        <li><a class="logout-btn">></a></li>
      </ul>
    </nav>
  </div>
</template>


<style lang="sass">
  @import '../styles/main.sass'


</style>