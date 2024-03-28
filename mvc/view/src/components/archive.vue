<script setup>
import { ref, computed } from 'vue';
import Navbar from "./nav_bar.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const showMenu = ref(false);
const activeButton = ref(null);
const rows = ref(10);
const archiveItems = ref([
  // Placeholder data for archive items
  { id: 1, priority: 'HIGH', artifactIdTitle: 'Placeholder Title 1', assignedTo: 'Manager', createdBy: 'User', status: 'Closed', employmentStatus: 'EMPLOYEE', category: 'Gendalf', lastModified: '02/02/2022' },
  // Additional items
  { id: 2, priority: 'MEDIUM', artifactIdTitle: 'Placeholder Title 2', assignedTo: 'Developer', createdBy: 'Admin', status: 'In Progress', employmentStatus: 'CONTRACTOR', category: 'Rohan', lastModified: '03/03/2022' },
  { id: 3, priority: 'LOW', artifactIdTitle: 'Placeholder Title 3', assignedTo: 'Designer', createdBy: 'Manager', status: 'Open', employmentStatus: 'EMPLOYEE', category: 'Gondor', lastModified: '04/04/2022' },
]);

const allColumns = ref([
  'PRIORITY',
  'ARTIFACT ID : TITLE',
  'ASSIGNED TO',
  'CREATED BY',
  'STATUS',
  'EMPLOYMENT STATUS',
  'CATEGORY',
  'LAST MODIFIED',
]);

const columns = ref(allColumns.value.map(name => ({ name, visible: true })));

function toggleColumnVisibility(columnName) {
  const column = columns.value.find(c => c.name === columnName);
  if (column) {
    column.visible = !column.visible;
  }
}

const modifyColumnsMenuVisible = ref(false);

function toggleModifyColumnsMenu() {
  modifyColumnsMenuVisible.value = !modifyColumnsMenuVisible.value;
}
</script>

<template>
  <div class="wrapper2">
    <Navbar/>
    <div class="tracker">
      <div class="title">
        <h1>Tracker Search Results ({{ archiveItems.length }} Items)</h1>
        <div class="buttons">
          <button class="btn">New Search</button>
          <button class="btn">Refine Search</button>
          <button class="btn export">Export</button>
        </div>
      </div>
      <div class="controls">
        <button class="btn" @click="toggleModifyColumnsMenu">Modify Columns</button>
      </div>
      <div v-if="modifyColumnsMenuVisible" class="modify-columns-menu">
        <div v-for="column in allColumns" :key="column">
          <input type="checkbox" :id="column" :checked="columns.find(c => c.name === column && c.visible)" @change="toggleColumnVisibility(column)">
          <label :for="column">{{ column }}</label>
        </div>
      </div>
      <table :class="{ 'table-lower': showMenu }">
        <thead>
        <tr>
          <th><input type="checkbox"></th>
          <th v-for="column in columns" v-show="column.visible" :key="column.name">{{ column.name }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in archiveItems.slice(0, rows)" :key="item.id">
          <td><input type="checkbox"></td>
          <td v-if="columns.find(c => c.name === 'PRIORITY' && c.visible)">{{ item.priority }}</td>
          <td v-if="columns.find(c => c.name === 'ARTIFACT ID : TITLE' && c.visible)">{{ item.artifactIdTitle }}</td>
          <td v-if="columns.find(c => c.name === 'ASSIGNED TO' && c.visible)">{{ item.assignedTo }}</td>
          <td v-if="columns.find(c => c.name === 'CREATED BY' && c.visible)">{{ item.createdBy }}</td>
          <td v-if="columns.find(c => c.name === 'STATUS' && c.visible)">{{ item.status }}</td>
          <td v-if="columns.find(c => c.name === 'EMPLOYMENT STATUS' && c.visible)">{{ item.employmentStatus }}</td>
          <td v-if="columns.find(c => c.name === 'CATEGORY' && c.visible)">{{ item.category }}</td>
          <td v-if="columns.find(c => c.name === 'LAST MODIFIED' && c.visible)">{{ item.lastModified }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use '../styles/_colors.sass' as *
@use '../styles/_navbar.sass' as *
:deep(.archive_tab)
  color: $n_in_nxp
  text-decoration: underline
  text-underline-offset: 3px
  text-decoration-thickness: 3px


.modify-columns-menu
  position: absolute
  background-color: white
  border: 1px solid #ccc
  padding: 10px
  border-radius: 5px
  box-shadow: 0 2px 5px rgba(0,0,0,0.2)
  z-index: 100
  /* Position the menu below the "Modify Columns" button */
  top: 100% /* Adjust as needed */
  left: 0 /* Adjust as needed */


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