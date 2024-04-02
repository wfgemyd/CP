
<script setup>
/*
async function fetchFilterOptions() {
  try {
    const response = await fetch('/api/filter-options');
    const data = await response.json();
    ticketPriority.value = data.ticketPriority;
    ticketStatus.value = data.ticketStatus;
    // Set the rest of the filter options similarly
  } catch (error) {
    console.error('Failed to fetch filter options:', error);
  }
}

// Call this function when your component is created or mounted
fetchFilterOptions();*/

import { ref, computed } from 'vue';
import Navbar from "./nav_bar.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const showMenu = ref(false);
const activeButton = ref(null);
const rows = ref(10);
const archiveItems = ref([
  // Placeholder data for archive items
  { artifactId: 1, requsterId: "#135136136136136", priority: 'HIGH', artifactTitle: 'Placeholder Title 1', assignedTo: 'Manager123', createdBy: 'User', status: 'Closed', employmentStatus: 'EMPLOYEE', category: 'Gendalf', role: 'Manager', lastModified: '02/02/2022' },
  // Additional items
  { artifactId: 2, requsterId: "#wdhgw326y26", priority: 'MEDIUM', artifactTitle: 'Placeholder Title 2', assignedTo: 'ManagerXYZ', createdBy: 'Admin', status: 'In Progress', employmentStatus: 'CONTRACTOR', category: 'Rohan', role: 'Developer', lastModified: '03/03/2022' },
  { artifactId: 3, requsterId: "#eyu24uy24", priority: 'LOW', artifactTitle: 'Placeholder Title 3', assignedTo: 'Manager136163', createdBy: 'Manager', status: 'Open', employmentStatus: 'EMPLOYEE', category: 'Gondor', role: 'Developer', lastModified: '04/04/2022' },
]);


// Assuming these constants are received from the backend and can be updated dynamically
const ticket_priority = { low: "low", medium: "medium", high: "high", urgent: "urgent", none: "none"};
const ticket_status = { open: "open", verifying: "verifying", rejected: "rejected", closed: "closed" };
const required_category = { gendalf: "gendalf", banana: "banana", coolchip: "coolchip" };
const ticket_manager = { manager1: "Manager", manager2: "manager2", manager3: "manager3" };
const employment_status = { contractor: "contractor", fullTime: "full-time", partTime: "part-time", intern: "intern" };
const permission_required = { read: "read", write: "write", none: "none" };
const user_role = { designer: "designer", developer: "developer", manager: "Manager", tester: "tester" };
const attachment = { none: null };


const allColumns = ref([
  'ARTIFACT ID',
  'REQUESTER WBI',
  'PRIORITY',
  'ARTIFACT TITLE',
  'ASSIGNED TO',
  'CREATED BY',
  'STATUS',
  'EMPLOYMENT STATUS',
  'CATEGORY',
  'ROLE',
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


const filterMenuVisible = ref(false);
const filterCriteria = ref({
  artifactId: null,
  requsterId: "",
  priority: '',
  artifactTitle: '',
  assignedTo: '',
  createdBy: '',
  status: '',
  employmentStatus: '',
  category: '',
  role: '',
  lastModified: '',
  globalSearch: '',
  startDate: '',
  endDate: '',
});

function clearFilters() {
  // Reset all filter criteria to their default values
  filterCriteria.value = {
    artifactId: null,
    requsterId: "",
    priority: '',
    artifactTitle: '',
    assignedTo: '',
    createdBy: '',
    status: '',
    employmentStatus: '',
    category: '',
    role: '',
    lastModified: '',
    globalSearch: '',
    startDate: '',
    endDate: '',
  };

  // Reset filteredResults to the original archiveItems
  filteredResults.value = archiveItems.value;
  showSearchResults.value = false;
}
const sortingColumn = ref('');
const sortingDirection = ref('');

function toggleFilterMenu() {
  filterMenuVisible.value = !filterMenuVisible.value;
}

function handleColumnClick(columnName) {
  if (sortingColumn.value === columnName) {
    sortingDirection.value = sortingDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortingColumn.value = columnName;
    sortingDirection.value = 'asc';
  }
  // Do not try to modify filteredArchiveItems here
}
function sortItems(items) {
  if (sortingColumn.value) {
    // Create a copy of the items array before sorting
    return [...items].sort((a, b) => {
      let valueA = a[sortingColumn.value];
      let valueB = b[sortingColumn.value];

      // Convert to lowercase for case-insensitive comparison if they are strings
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      // Convert to timestamps for comparison if sorting by 'lastModified'
      if (sortingColumn.value === 'lastModified') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      return (valueA < valueB ? -1 : 1) * (sortingDirection.value === 'asc' ? 1 : -1);
    });
  }
  return items;
}
const filteredArchiveItems = computed(() => {
  let items = filteredResults.value;

  // Apply global search filter if needed
  if (filterCriteria.value.globalSearch) {
    const searchLower = filterCriteria.value.globalSearch.toLowerCase();
    items = items.filter(item => Object.values(item).some(value => value.toString().toLowerCase().includes(searchLower)));
  }

  // Apply sorting
  if (sortingColumn.value) {
    items = sortItems(items);
  }

  return items;
});

const filteredResults = ref(archiveItems.value);
const showSearchResults = ref(false);

function applyFilters() {
  let tempFilteredResults = JSON.parse(JSON.stringify(archiveItems.value));
  console.log(tempFilteredResults);
  console.log(archiveItems)
  tempFilteredResults = tempFilteredResults.filter(item => {
    console.log(filteredResults.value)

    console.log("Item:", item);

    // Artifact ID comparison (assuming it's numeric)
    const matchesArtifactId = filterCriteria.value.artifactId ? item.artifactId === filterCriteria.value.artifactId : true;

    // String field comparisons
    const matchesRequesterId = filterCriteria.value.requsterId ? item.requsterId.toLowerCase().includes(filterCriteria.value.requsterId.toLowerCase()) : true;
    const matchesArtifactTitle = filterCriteria.value.artifactTitle ? item.artifactTitle.toLowerCase().includes(filterCriteria.value.artifactTitle.toLowerCase()) : true;
    const matchesAssignedTo = filterCriteria.value.assignedTo ? item.assignedTo.toLowerCase().includes(filterCriteria.value.assignedTo.toLowerCase()) : true;
    const matchesCreatedBy = filterCriteria.value.createdBy ? item.createdBy.toLowerCase().includes(filterCriteria.value.createdBy.toLowerCase()) : true;

    // Dropdown filter comparisons using dynamically received constants
    const matchesPriority = filterCriteria.value.priority ? item.priority.toLowerCase() === ticket_priority[filterCriteria.value.priority].toLowerCase() : true;
    const matchesStatus = filterCriteria.value.status ? item.status.toLowerCase() === ticket_status[filterCriteria.value.status].toLowerCase() : true;
    const matchesEmploymentStatus = filterCriteria.value.employmentStatus ? item.employmentStatus.toLowerCase() === employment_status[filterCriteria.value.employmentStatus].toLowerCase() : true;
    const matchesCategory = filterCriteria.value.category ? item.category.toLowerCase() === required_category[filterCriteria.value.category].toLowerCase() : true;
    const matchesUserRole = filterCriteria.value.user_role ? item.role.toLowerCase() === user_role[filterCriteria.value.user_role].toLowerCase() : true;

    // Additional filter criteria
    const matchesManager = filterCriteria.value.manager ? item.assignedTo.toLowerCase() === ticket_manager[filterCriteria.value.manager].toLowerCase() : true;
    const matchesPermissionRequired = filterCriteria.value.permission_required ? item.permissionRequired.toLowerCase() === permission_required[filterCriteria.value.permission_required].toLowerCase() : true;

    // Global search and date filters
    const matchesGlobalSearch = filterCriteria.value.globalSearch ? Object.values(item).some(value => value.toString().toLowerCase().includes(filterCriteria.value.globalSearch.toLowerCase())) : true;
    const matchesStartDate = filterCriteria.value.startDate ? new Date(item.lastModified) >= new Date(filterCriteria.value.startDate) : true;
    const matchesEndDate = filterCriteria.value.endDate ? new Date(item.lastModified) <= new Date(filterCriteria.value.endDate) : true;

    // Return true only if all filter conditions are met
    return matchesArtifactId && matchesRequesterId && matchesArtifactTitle && matchesAssignedTo && matchesCreatedBy &&
        matchesPriority && matchesStatus && matchesEmploymentStatus && matchesCategory && matchesUserRole &&
        matchesManager && matchesPermissionRequired && matchesGlobalSearch && matchesStartDate && matchesEndDate;
  });
  filteredResults.value = tempFilteredResults;
  // Show the search results header
  showSearchResults.value = true;

  console.log('Filtered Results:', filteredResults.value);
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
          <h1 class="archive_search_results" v-if="showSearchResults">Tracker Search Results ({{ filteredArchiveItems.length }} Items)</h1>
          <div class="buttons">
            <button class="btn" @click="toggleFilterMenu">Filter by</button>

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

      <div v-if="filterMenuVisible" class="filter-menu">
        <!-- Global Search Input -->
        <input type="text" placeholder="Global Search" v-model="filterCriteria.globalSearch">

        <!-- Date Range Inputs -->
        <input type="date" placeholder="Start Date" v-model="filterCriteria.startDate">
        <input type="date" placeholder="End Date" v-model="filterCriteria.endDate">

        <div class="filter-item">
          <label for="WBI">Requester WBI: </label>
          <input type="text" placeholder=" Search Requester's WBI" v-model="filterCriteria.requsterId">
        </div>

        <div class="filter-item">
          <label for="priority">Priority:</label>
          <select id="priority" name="priority" v-model="filterCriteria.priority">
            <option v-for="(label, value) in ticket_priority" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-item">
          <label for="employment_status">Employment status:</label>
          <select id="employment_status" name="employment_status" v-model="filterCriteria.employment_status">
            <option v-for="(label, value) in employment_status" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-item">
          <label for="manager">User's Direct Manager:</label>
          <select id="manager" name="manager" v-model="filterCriteria.manager">
            <option v-for="(label, value) in ticket_manager" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-item">
          <label for="category">Project's Name:</label>
          <select id="category" name="category" v-model="filterCriteria.category">
            <option v-for="(label, value) in required_category" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-item">
          <label for="permission_required">Permission Required:</label>
          <select id="permission_required" name="permission_required" v-model="filterCriteria.permission_required">
            <option v-for="(label, value) in permission_required" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-item">
          <label for="user_role">User's Role:</label>
          <select id="user_role" name="user_role" v-model="filterCriteria.user_role">
            <option v-for="(label, value) in user_role" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <!-- Button to Apply Filters -->
        <button @click="applyFilters">Search</button>


        <!-- Button to Clear Filters -->
        <button @click="clearFilters">Clear</button>
      </div>

      <table :class="{ 'table-lower': showMenu }">
        <thead>
        <tr>
          <th><input type="checkbox"></th>
          <th v-for="column in columns" v-show="column.visible" :key="column.name" @click="handleColumnClick(column.name)">
            {{ column.name }}
            <span v-if="sortingColumn === column.name">{{ sortingDirection === 'asc' ? '↑' : '↓' }}</span>
          </th>

        </tr>
        </thead>

        <tbody>
        <tr v-for="item in filteredResults.slice(0, rows)" :key="item.id">
          <td><input type="checkbox"></td>
          <td v-if="columns.find(c => c.name === 'ARTIFACT ID' && c.visible)">{{ item.artifactId }}</td>
          <td v-if="columns.find(c => c.name === 'REQUESTER WBI' && c.visible)">{{ item.requsterId }}</td>
          <td v-if="columns.find(c => c.name === 'PRIORITY' && c.visible)">{{ item.priority }}</td>
          <td v-if="columns.find(c => c.name === 'ARTIFACT TITLE' && c.visible)">{{ item.artifactTitle }}</td>
          <td v-if="columns.find(c => c.name === 'ASSIGNED TO' && c.visible)">{{ item.assignedTo }}</td>
          <td v-if="columns.find(c => c.name === 'CREATED BY' && c.visible)">{{ item.createdBy }}</td>
          <td v-if="columns.find(c => c.name === 'STATUS' && c.visible)">{{ item.status }}</td>
          <td v-if="columns.find(c => c.name === 'EMPLOYMENT STATUS' && c.visible)">{{ item.employmentStatus }}</td>
          <td v-if="columns.find(c => c.name === 'CATEGORY' && c.visible)">{{ item.category }}</td>
          <td v-if="columns.find(c => c.name === 'ROLE' && c.visible)">{{ item.role }}</td>
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
      align-items: center
      width: 100%
      h1
        font-size: $header_fontsize - 0.5rem
        color: $header-color

      .buttons
        display: $flex-display
        gap: $gap-standard
        margin-left: auto // Add this line to push buttons to the right

        .controls
          position: relative
          display: $flex-display
          gap: $gap-standard
    .filter-menu
      position: absolute
      background-color: white
      border: 1px solid #ccc
      padding: 10px
      border-radius: 5px
      box-shadow: 0 2px 5px rgba(0,0,0,0.2)
      z-index: 100
      top: 110%
      left: 0
      width: max-content

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
    width: auto

  table
    width: 100%
    border-collapse: collapse
    margin-top: 2rem
    border-radius: $border-radius

    thead
      background-color: $table-background-color
      width: 100%

    th, td
      padding: $padding-standard
      text-align: left
      border: 1px solid $border-color
      width: auto

      &:first-child
        text-align: $text-align-center
        width: auto

  input[type="checkbox"]
    margin: $margin-zero



</style>