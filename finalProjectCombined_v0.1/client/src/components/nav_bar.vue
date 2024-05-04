<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import a from "./new_ticket.vue";

const fullName = ref('');
const wbi = ref('');
const router = useRouter();

onMounted(() => {
  // Retrieve the user's full name and WBI from local storage or API
  fullName.value = localStorage.getItem('fullName') || '';
  wbi.value = localStorage.getItem('wbi') || '';
});

const logout = () => {
  // Clear the user information from local storage
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('fullName');
  localStorage.removeItem('wbi');
  localStorage.removeItem('uId');
  localStorage.removeItem('employment_name');
  // Redirect to the login page
  router.push('/login');
};
const searchTerm = ref('');
const emit = defineEmits(['search']);

const searchTickets = () => {
  emit('search', searchTerm.value);
};
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
          <input type="text" placeholder="Search..." name="search" v-model="searchTerm">
          <button type="submit" @click="searchTickets"><img src="../assets/searchbtn.png" alt="searchicon"></button>        </div></li>
        <li class="user_picture"> <img src = "../assets/derp.png" alt="profile_pic"> </li>
        <li class="user-info">
          <div>{{ fullName }}</div>
          <div class="wbi">@{{ wbi }}</div>
        </li>
        <li><a @click="logout" title="Logout" class="logout-btn"><img src="../assets/logout.png" alt="logoutbtn"></a></li>
      </ul>
    </nav>
  </div>
</template>


<style lang="sass">
  @import '../styles/main.sass'


</style>