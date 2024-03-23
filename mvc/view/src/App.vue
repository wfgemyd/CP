<script>
import { useRoute } from 'vue-router';
import LoginComponent from './components/login.vue';
import NavBarFirstTime from './components/nav_bar.vue';
import Onboarding from './components/onboarding.vue';
import Newticket from './components/new_ticket.vue';
import Tickets from './components/tickets.vue';
import {computed} from "vue";

export default {
  name: 'App',
  components: {
    LoginComponent,
    NavBarFirstTime,
    Onboarding,
    Newticket,
    Tickets
  }
}
</script>

<template>
  <div id="app">
    <!-- Main application container -->
    <header>
      <!-- Your app header -->
    </header>
    <main>
      <!-- Main content area -->
      <!-- Dynamically include the login component here -->
      <router-view />
    </main>
    <footer>
      <!-- Your app footer -->
    </footer>
  </div>
</template>



<style lang="sass">
// Importing global styles
@use './styles/_colors.sass' as *




</style>
