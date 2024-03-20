<script setup>
import { ref } from 'vue';

const checked = ref(false);
const itemText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
    ' Accusamus cumque dolor doloribus esse ipsa, ipsam magni molestias temporibus ' +
    'voluptatem. Doloremque facilis inventore libero vel? Accusamus explicabo id nihil ' +
    'quaerat quod?\n';


</script>

<template>
  <div class= "wrapper2">
    <div class="onboarding_container">

      <div class="navbar-container">
        <nav class="onboarding_nav">
          <div id="nav-left">
            <a href="#" title="Home page"> <img class="nav-logo" src="../assets/nxp__logo.svg.png" alt="firm logo"> </a>
          </div>
          <ul id="nav_items">
            <li class="user_picture"> <img src = "../assets/derp.png" alt="profile_pic"> </li>
            <li class="user-info"> <!-- Changed to class for reuse -->
              <div>Full name</div>
              <div class="wbi">@WBI</div>
            </li>
            <li><a href="../" title="Logout" class="logout-btn"><img src = "../assets/logout.png" alt="logoutbtn"> </a></li>
          </ul>
        </nav>
      </div>

      <div class="onboarding_window">

        <div class="onboarding_top">
          <h1 class="header">Onboarding Checklist</h1>
          <img class="colorfil_underline" src= "../assets/colorfull_underline.png" alt="underline">
        </div>

        <div class="checklist">
          <div class="item">
            <div class="checkbox"><img class= "checkbox_vec" src="../assets/vector.png" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
          <div class="item">
            <div class="checkbox"><img class= "checkbox_vec" src="../assets/vector.png" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
          <div class="item">
            <div class="checkbox"><img class= "checkbox_vec" src="../assets/vector.png" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
          <div class="item">
            <div class="checkbox"><img class= "checkbox_vec" src="../assets/vector.png" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
          <div class="item">
            <div class="checkbox"><img class= "checkbox_vec" src="../assets/vector.png" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
        </div>

        <div class="finalize_checklist">
          <button class="finalize_btn">Submit</button>
        </div>

      </div>

    </div>
  </div>

</template>

<style scoped lang="sass">
@import '../styles/_index.sass'

</style>