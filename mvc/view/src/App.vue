<script>
// Import the login component with a relative path
import LoginComponent from './components/login.vue';

export default {
  name: 'App',
  components: {
    LoginComponent
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
      <LoginComponent />
    </main>
    <footer>
      <!-- Your app footer -->
    </footer>
  </div>
</template>



<style lang="sass">
// Importing global styles
@import './styles/_index.sass'
#app
  background: $background-color
  display: flex
  justify-content: center
  align-items: center
  height: 100vh

  .login-page
    display: flex
    justify-content: center
    align-items: center
    height: 100%
</style>
