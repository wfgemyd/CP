<script setup>
import { ref } from 'vue';
import Navbar from "./nav_bar.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
  <div class="wrapper2">
  <Navbar/>
  <div class="tracker">

    <div class="title">
      <h1>Tracker Search Results (7 Items)</h1>
      <div class="buttons">
        <button class="btn">New Search</button>
        <button class="btn">Refine Search</button>
        <button class="btn export">Export</button>
      </div>
    </div>
    <div class="controls">
      <button class="btn" @click="toggleMenu('addColumn')">Add Column</button>
      <button class="btn" @click="toggleMenu('removeColumn')">Remove Column</button>
      <select class="btn">
        <option>Rows</option>
        <option value="10">10 Rows</option>
        <option value="20">20 Rows</option>
        <option value="30">30 Rows</option>
      </select>
    </div>

    <table :class="{ 'table-lower': showMenu }">
      <thead>
      <tr>
        <th><input type="checkbox"></th>
        <th>PRIORITY</th>
        <th>ARTIFACT ID : TITLE</th>
        <th>ASSIGNED TO</th>
        <th>CREATED BY</th>
        <th>STATUS</th>
        <th>EMPLOYMENT STATUS</th>
        <th>CATEGORY</th>
        <th>LAST MODIFIED</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in archiveItems" :key="item.id">
        <td><input type="checkbox"></td>
        <td>{{ item.priority }}</td>
        <td>{{ item.artifactIdTitle }}</td>
        <td>{{ item.assignedTo }}</td>
        <td>{{ item.createdBy }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.employmentStatus }}</td>
        <td>{{ item.category }}</td>
        <td>{{ item.lastModified }}</td>
      </tr>
      </tbody>
    </table>
    <div v-if="showMenu" class="menu">
      <div v-if="activeButton === 'addColumn'">
        <!-- Content for 'Add Column' goes here -->
      </div>
      <div v-if="activeButton === 'removeColumn'">
        <!-- Content for 'Remove Column' goes here -->
      </div>
    </div>
    <p>showMenu: {{ showMenu }}</p>
    <p>activeButton: {{ activeButton }}</p>
  </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'TrackerComponent',
  setup() {
    const showMenu = ref(false);
    const activeButton = ref(null);
    const archiveItems = ref([
      // Placeholder data for archive items
      { id: 1, priority: 'HIGH', artifactIdTitle: 'Placeholder Title 1', assignedTo: 'Manager', createdBy: 'User', status: 'Closed', employmentStatus: 'EMPLOYEE', category: 'Gendalf', lastModified: '02/02/2022' },
      // Add more items as needed
    ]);

    function toggleMenu(button) {
      showMenu.value = !showMenu.value;
      activeButton.value = button;
    }

    return {
      showMenu,
      activeButton,
      archiveItems,
      toggleMenu,
    };
  },
};
</script>

<style scoped lang="sass">
@use '../styles/_colors.sass' as *
@use '../styles/_navbar.sass' as *
:deep(.archive_tab)
  color: $n_in_nxp
  text-decoration: underline
  text-underline-offset: 3px
  text-decoration-thickness: 3px

$font-family-sarabun: 'Sarabun', sans-serif
$font-family-alef: 'Alef', sans-serif
$background-color: #f3f3f3
$border-radius: 8px
$border-color: #cccccc
$button-background-color: #ffffff
$export-button-background-color: #dddddd
$table-background-color: #eeeeee
$padding-standard: 0.5rem
$margin-zero: 0
$flex-display: flex
$inline-display: inline-block
$font-weight-bold: 700
$gap-standard: 0.5rem
$width-auto: auto
$text-align-center: center

.tracker
  font-family: $font-family-sarabun
  background: $background-color
  margin: 1rem
  border-radius: $border-radius

  .title
    display: $flex-display
    justify-content: space-between
    align-items: center
    margin-bottom: 1rem

    h1
      font-family: $font-family-alef
      font-size: 1.25rem
      font-weight: $font-weight-bold
      margin: $margin-zero

  .buttons, .controls
    display: $flex-display
    gap: $gap-standard

  .btn
    padding: $padding-standard 1rem
    border: 1px solid $border-color
    background-color: $button-background-color
    cursor: pointer
    border-radius: $border-radius
    width: $width-auto
    display: $inline-display

    &.export
      background-color: $export-button-background-color

  .table-lower
    margin-top: 5rem

  table
    width: 100%
    border-collapse: collapse
    margin-top: 1rem
    border-radius: $border-radius

    thead
      background-color: $table-background-color

    th, td
      padding: $padding-standard
      text-align: left
      border: 1px solid $border-color

      &:first-child
        text-align: $text-align-center

  input[type="checkbox"]
    margin: $margin-zero
</style>