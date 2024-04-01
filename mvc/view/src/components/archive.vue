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
        <div class="archive_header">
        <h1>Archive</h1>
        </div>
        <div class="lower_row_archive">
          <h1>Tracker Search Results ({{ archiveItems.length }} Items)</h1>
          <div class="buttons">
            <button class="btn">Filter by</button>
            <div class="controls">
              <button class="btn" @click="toggleModifyColumnsMenu">Modify Columns</button>
              <div v-if="modifyColumnsMenuVisible" class="modify-columns-menu">
                <div v-for="column in allColumns" :key="column">
                  <input type="checkbox" :id="column" :checked="columns.find(c => c.name === column && c.visible)" @change="toggleColumnVisibility(column)">
                  <label :for="column">{{ column }}</label>
                </div>
              </div>
            </div>

            <button class="btn export">Export</button>
          </div>
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
@use '../styles/_fonts.sass' as *
:deep(.archive_tab)
  color: $n_in_nxp
  text-decoration: underline
  text-underline-offset: 3px
  text-decoration-thickness: 3px

.controls
  position: relative

.modify-columns-menu
  position: absolute
  background-color: white
  border: 1px solid #ccc
  padding: 10px
  border-radius: 5px
  box-shadow: 0 2px 5px rgba(0,0,0,0.2)
  z-index: 100
  top: 110% // This positions the top of the menu right at the bottom of the button
  left: -15% // Aligns the menu to the left edge of the button
  width: max-content // Ensures the menu width is based on its content


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
  background: $container_background_color
  margin: 1rem
  border-radius: $border-radius
  height: auto
  padding: 2rem
  margin-top: 2rem

  .title
    margin-bottom: 1rem
    margin-top: 1rem
    .archive_header
      display: $flex-display
      flex-direction: row
      justify-content: start
      align-items: center
      margin-bottom: 1rem
      h1
        font-size: $header_fontsize + 1rem
        color: $x_in_nxp

    .lower_row_archive
      display: $flex-display
      flex-direction: row
      justify-content: space-between
      h1
        font-size: $header_fontsize - 0.5rem
        color: $header-color

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
    font-weight: bold

    &.export
      background-color: $export-button-background-color

  .table-lower
    margin-top: 5rem

  table
    width: 100%
    border-collapse: collapse
    margin-top: 2rem
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