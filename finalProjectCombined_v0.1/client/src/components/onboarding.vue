<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goTotickets = () => {
  router.push('/tickets');
};

</script>

<script>
import axios from 'axios';
import vectorImage from '../assets/vector.jpg';
import checkImage from '../assets/vector_clicked.jpg';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const token = localStorage.getItem('token');
export default {

  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      checklistItems: [],
      vectorImage,
      checkImage,
      fullName: '',
      wbi: '',
    };
  },
  computed: {
    allItemsChecked() {
      return this.checklistItems.every(item => item.checked);
    },
  },
  methods: {

    goTotickets(){
      this.$router.push('/tickets');
      },
    async fetchChecklistItems() {
      try {

        const response = await axios.get('/api/onboarding', {
          headers: {
            Authorization: `${token}`,
            Path: '/api/onboarding',
          },
        });
        console.log('Checklist items:', response.data);
        console.log('Checklist items:', response.headers);
        if (Array.isArray(response.data)) {
          this.checklistItems = response.data.map(item => ({ ...item, checked: false }));
        } else {
          console.error('Expected an array but received:', response.data);
          // Handle the case where response.data is not an array
          // For example, you might want to set checklistItems to an empty array
          this.checklistItems = [];
          console.error('Checklist items:', this.checklistItems);
        }
      } catch (error) {
        console.error(error);
      }
    },
    toggleCheckbox(index) {
      this.checklistItems[index].checked = !this.checklistItems[index].checked;
    },
    async submitChecklist() {
      console.log('Submitting checklist...');
      try {
        console.log(localStorage.getItem('uId'));
        const checkedItems = this.checklistItems.filter(item => item.checked).map(item => item.id);
        const response = await axios.post('/api/onboarding/submit', { userId: localStorage.getItem('uId'), checkedItems }, {
          headers: {
            Authorization: `${token}`,
            Path: '/api/onboarding/submit',
          },
        });

        // Check the response status
        if (response.status === 200) {
          console.log('Checklist submitted successfully');
          // Redirect to the tickets page or show a success message
          this.goTotickets();
        } else {
          console.error('Error submitting checklist:', response.status, response.data);
          // Handle the error scenario, show an error message, or take appropriate action
        }
      } catch (error) {
        console.error('Submit error:', error);
        // Handle the error scenario, show an error message, or take appropriate action
      }
    },
    logout() {
      // Clear user data from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('fullName');
      localStorage.removeItem('wbi');

      // Redirect to the login page
      this.$router.push('/login');
    },
  },
  mounted() {
    this.fetchChecklistItems();
    this.fullName = localStorage.getItem('fullName');
    this.wbi = localStorage.getItem('wbi');
    console.log('Full name:', this.fullName);
    console.log('WBI:', this.wbi);
  },
};
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
              <div>{{ fullName }}</div>
              <div class="wbi">@{{ wbi }}</div>
            </li>
            <li><a @click="logout" title="Logout" class="logout-btn"><img src="../assets/logout.png" alt="logoutbtn"></a></li>
          </ul>
        </nav>
      </div>

      <div class="onboarding_window">
        <div class="onboarding_top">
          <h1 class="header">Onboarding Checklist</h1>
          <img class="colorfil_underline" src="../assets/colorfull_underline.png" alt="underline">
        </div>
        <div class="checklist">
          <div v-for="(item, index) in checklistItems" :key="item.id" class="item">
            <div class="checkbox" @click="toggleCheckbox(index)">
              <img class="checkbox_vec" :class="{ 'checkbox-checked': item.checked }" :src="item.checked ? checkImage : vectorImage" alt="checkbox">
            </div>
            <div class="text">{{ item.item_description }}</div>
          </div>
        </div>
        <div class="finalize_checklist">
          <button class="finalize_btn" @click="submitChecklist" :disabled="!allItemsChecked">Submit</button>
        </div>
      </div>

    </div>
  </div>

</template>

<style scoped lang="sass">
@use "../styles/colors.sass" as * //import all the variables from index.sass
@use "../styles/buttons.sass" as * //import all the variables from index.sass
@use "../styles/radius.sass" as * //import all the variables from index.sass
@use "../styles/fonts.sass" as * //import all the variables from index.sass

=mixin-shared-styles
  font-size: $font_size+0.29
  color: $text-color
  margin-right: 1.3rem

.navbar-container
  display: flex
  justify-content: space-between
  align-items: flex-end
  margin-bottom: 2rem
  top: 0
  left: 0
  right: 0
  width: 100%
  height: auto
  box-sizing: border-box
  border: 0.1rem solid $field_border
  background-color: $container_background_color


.onboarding_nav
  display: flex
  justify-content: space-between
  align-items: center
  width: 100%

#nav-left
  .nav-logo
    height: auto
    width: auto
    max-height: 100%
    max-width: 6rem
    object-fit: contain
    padding: 0.5rem

#nav_items
  list-style: none
  display: flex
  flex-direction: row
  justify-content: flex-end
  align-items: center
  width: 100%
  padding: 0.5rem
  margin: 0
  font-size: $font_size
  color: $text-color

  .archive_tab
    +mixin-shared-styles
  .tickets_tab
    +mixin-shared-styles


  .logout-btn
    img
      display: flex
      align-items: center
      padding-top: 0.25rem
      color: $top_bar_text_color
      margin-right: 0.5rem

  .wbi
    font-size: $font_size - 0.2rem
    color: $top_bar_text_color


  .user-info
    display: flex
    flex-direction: column
    margin-right: 1rem
    font-size: $font_size

.user_picture
  img
    height: auto
    width: auto
    max-height: 100%
    max-width: 2rem
    object-fit: contain
    border-radius: 50%
    border: 0.2rem solid #0eafe0
    margin-right: 0.5rem

.nav-left, .nav-right
  display: flex
  align-items: center

</style>