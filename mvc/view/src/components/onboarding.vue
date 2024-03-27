<script setup>
import { ref } from 'vue';

const checked = ref(false);
const itemText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
    ' Accusamus cumque dolor doloribus esse ipsa, ipsam magni molestias temporibus ' +
    'voluptatem. Doloremque facilis inventore libero vel? Accusamus explicabo id nihil ' +
    'quaerat quod?\n';
import { useRouter } from 'vue-router';

const router = useRouter();

const goTotickets = () => {
  router.push('/tickets');
};

</script>

<script>
import vectorImage from '../assets/vector.jpg'; // Import the image
import checkImage from '../assets/vector_clicked.jpg'; // Import the image

export default {
  data() {
    return {
      checkboxSrc: vectorImage, // The initial image for the unchecked state
      isChecked: false, // Initial state of the checkbox
      itemText: 'Your item text here',
    };
  },
  methods: {
    toggleCheckbox() {
      this.isChecked = !this.isChecked; // Toggle the checked state
      this.checkboxSrc = this.isChecked ? checkImage : vectorImage; // Update the image source based on the checked state
    }
  }
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
            <div class="checkbox" :key="checkboxSrc" @click="toggleCheckbox" ><img class= "checkbox_vec" :class="{ 'checkbox-checked': isChecked }" :src="checkboxSrc" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
          <div class="item">
            <div class="checkbox" :key="checkboxSrc" @click="toggleCheckbox" ><img class= "checkbox_vec" :class="{ 'checkbox-checked': isChecked }" :src="checkboxSrc" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
          <div class="item">
            <div class="checkbox" :key="checkboxSrc" @click="toggleCheckbox" ><img class= "checkbox_vec" :class="{ 'checkbox-checked': isChecked }" :src="checkboxSrc" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
          <div class="item">
            <div class="checkbox" :key="checkboxSrc" @click="toggleCheckbox" ><img class= "checkbox_vec" :class="{ 'checkbox-checked': isChecked }" :src="checkboxSrc" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
          <div class="item">
            <div class="checkbox" :key="checkboxSrc" @click="toggleCheckbox" ><img class= "checkbox_vec" :class="{ 'checkbox-checked': isChecked }" :src="checkboxSrc" alt="checkbox" ></div>
            <div class="text">{{ itemText }}</div>
          </div>
        </div>

        <div class="finalize_checklist">
          <button class="finalize_btn" @click="goTotickets">Submit</button>
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