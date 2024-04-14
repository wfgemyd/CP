<script setup>
import a from "./new_ticket.vue"
</script>

<template>

  <div class="navbar-container">
    <nav class="nav_">
      <div id="nav-left">
        <a href="#" title="Home page"> <img class="nav-logo" src="../assets/nxp__logo.svg.png" alt="firm logo"> </a>
      </div>
      <ul id="nav_items">
        <li><a href="/tickets" title="Tickets" class="tickets_tab">Tickets </a></li>
        <li><a href="/archive" title="Archive" class="archive_tab">Archive </a></li>
        <li><div class="search-container">
          <input type="text" placeholder="Search..." name="search">
          <button type="submit"><img src = "../assets/searchbtn.png" alt="searchicon"><i class="fa fa-search"></i></button>
        </div></li>
        <li class="user_picture"> <img src = "../assets/derp.png" alt="profile_pic"> </li>
        <li class="user-info"> <!-- Changed to class for reuse -->
          <div>Full name</div>
          <div class="wbi">@WBI</div>
        </li>
        <li><a href="../login" title="Logout" class="logout-btn"><img src = "../assets/logout.png" alt="logoutbtn"> </a></li>
      </ul>
    </nav>
  </div>
</template>


<style lang="sass">
  @import '../styles/main.sass'


</style>