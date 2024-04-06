<script setup>
import {ref, computed, watch} from 'vue';
import Navbar from "./nav_bar.vue";
import { useRouter } from 'vue-router';


const router = useRouter();
const showMenu = ref(false);
const activeButton = ref(null);
const rows = ref(10);
const archiveItems = ref([
  // Placeholder data for archive tickets
  { id: 1, requsterId: "#135136136136136", priority: 'HIGH', title: 'Placeholder Title 1', assignedTo: 'Manager123', createdBy: 'User', status: 'Closed', employmentStatus: 'EMPLOYEE', category: 'Gendalf', role: 'Manager', closedOn: '02/02/2022' },
  // Additional tickets
  { id: 2, requsterId: "#wdhgw326y26", priority: 'MEDIUM', title: 'Placeholder Title 2', assignedTo: 'ManagerXYZ', createdBy: 'Admin', status: 'Rejected', employmentStatus: 'CONTRACTOR', category: 'Rohan', role: 'Developer', closedOn: '03/03/2022' },
  { id: 3, requsterId: "#eyu24uy24", priority: 'LOW', title: 'Placeholder Title 3', assignedTo: 'Manager136163', createdBy: 'Manager', status: 'Open', employmentStatus: 'EMPLOYEE', category: 'Gondor', role: 'Developer', closedOn: '04/04/2022' },
]);

const ticket_priority = { low: "low", medium: "medium", high: "high", urgent: "urgent", none: "none"};
const ticket_status = { open: "open", verifying: "verifying", rejected: "rejected", closed: "closed" };
const required_category = { gendalf: "gendalf", banana: "banana", coolchip: "coolchip" };
const ticket_manager = { manager1: "Manager", manager2: "manager2", manager3: "manager3" };
const employment_status = { contractor: "contractor", fullTime: "full-time", partTime: "part-time", intern: "intern" };
const permission_required = { read: "read", write: "write", none: "none" };
const user_role = { designer: "designer", developer: "developer", manager: "Manager", tester: "tester" };
const attachment = { none: null };
const filteredResults = ref(archiveItems.value);
const showSearchResults = ref(false);
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
  'CLOSED ON',
]);

const columns = ref(allColumns.value.map(name => ({ name, visible: true })));
const modifyColumnsMenuVisible = ref(false);
const sortingColumn = ref('');
const sortingDirection = ref('');
const filterMenuVisible = ref(false);
const expandedItemId = ref(null);

const filterCriteria = ref({
  id: null,
  requsterId: "",
  priority: '',
  title: '',
  assignedTo: '',
  createdBy: '',
  status: '',
  employmentStatus: '',
  category: '',
  role: '',
  closedOn: '',
  globalSearch: '',
  startDate: '',
  endDate: '',
});

function clearFilters() {
  // Reset all filter criteria to their default values
  filterCriteria.value = {
    id: null,
    requsterId: "",
    priority: '',
    title: '',
    assignedTo: '',
    createdBy: '',
    status: '',
    employmentStatus: '',
    category: '',
    role: '',
    closedOn: '',
    globalSearch: '',
    startDate: '',
    endDate: '',
  };

  // Reset filteredResults to the original archiveItems
  filteredResults.value = archiveItems.value;
  showSearchResults.value = false;
}

function toggleColumnVisibility(columnName) {
  const column = columns.value.find(c => c.name === columnName);
  if (column) {
    column.visible = !column.visible;
  }
}
function toggleModifyColumnsMenu() {
  modifyColumnsMenuVisible.value = !modifyColumnsMenuVisible.value;
}
function toggleFilterMenu() {
  filterMenuVisible.value = !filterMenuVisible.value;
}

function handleColumnClick(columnName) {
  console.log('Clicked column:', columnName);
  if (sortingColumn.value === columnName) {

    sortingDirection.value = sortingDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortingColumn.value = columnName;
    sortingDirection.value = 'asc';
  }
  // Do not try to modify filteredArchiveItems here
}
function sortItems(tickets) {
  console.log('Sorting column:', sortingColumn.value);
  console.log('Before sorting:', tickets);
  if (sortingColumn.value) {
    // Create a copy of the tickets array before sorting
    const sortedTickets =  [...tickets].sort((a, b) => {
      let valueA = a[sortingColumn.value];
      let valueB = b[sortingColumn.value];

      // Convert to lowercase for case-insensitive comparison if they are strings
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      // Convert to timestamps for comparison if sorting by 'closedOn'
      if (sortingColumn.value === 'closedOn') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      return (valueA < valueB ? -1 : 1) * (sortingDirection.value === 'asc' ? 1 : -1);
    });
    console.log('After sorting:', sortedTickets);
    return sortedTickets;
  }
  return tickets;
}
const filteredArchiveItems = computed(() => {
  let tickets = filteredResults.value;

  // Apply global search filter if needed
  if (filterCriteria.value.globalSearch) {
    const searchLower = filterCriteria.value.globalSearch.toLowerCase();
    tickets = tickets.filter(ticket => Object.values(ticket).some(value => value.toString().toLowerCase().includes(searchLower)));
  }

  // Apply sorting
  if (sortingColumn.value) {
    tickets = sortItems(tickets);
  }

  return tickets;
});
function toggleExpandedView(ticketId) {
  expandedItemId.value = ticketId === expandedItemId.value ? null : ticketId;
}
function closeExtendedView() {
  expandedItemId.value = null;
}
function applyFilters() {
  let tempFilteredResults = JSON.parse(JSON.stringify(archiveItems.value));
  console.log(tempFilteredResults);
  console.log(archiveItems)
  tempFilteredResults = tempFilteredResults.filter(ticket => {
    console.log(filteredResults.value)

    console.log("Item:", ticket);

    // Artifact ID comparison (assuming it's numeric)
    const matchesArtifactId = filterCriteria.value.id ? ticket.id === filterCriteria.value.id : true;

    // String field comparisons
    const matchesRequesterId = filterCriteria.value.requsterId ? ticket.requsterId.toLowerCase().includes(filterCriteria.value.requsterId.toLowerCase()) : true;
    const matchesArtifactTitle = filterCriteria.value.title ? ticket.title.toLowerCase().includes(filterCriteria.value.title.toLowerCase()) : true;
    const matchesAssignedTo = filterCriteria.value.assignedTo ? ticket.assignedTo.toLowerCase().includes(filterCriteria.value.assignedTo.toLowerCase()) : true;
    const matchesCreatedBy = filterCriteria.value.createdBy ? ticket.createdBy.toLowerCase().includes(filterCriteria.value.createdBy.toLowerCase()) : true;

    // Dropdown filter comparisons using dynamically received constants
    const matchesPriority = filterCriteria.value.priority ? ticket.priority.toLowerCase() === ticket_priority[filterCriteria.value.priority].toLowerCase() : true;
    const matchesStatus = filterCriteria.value.status ? ticket.status.toLowerCase() === ticket_status[filterCriteria.value.status].toLowerCase() : true;
    const matchesEmploymentStatus = filterCriteria.value.employmentStatus ? ticket.employmentStatus.toLowerCase() === employment_status[filterCriteria.value.employmentStatus].toLowerCase() : true;
    const matchesCategory = filterCriteria.value.category ? ticket.category.toLowerCase() === required_category[filterCriteria.value.category].toLowerCase() : true;
    const matchesUserRole = filterCriteria.value.user_role ? ticket.role.toLowerCase() === user_role[filterCriteria.value.user_role].toLowerCase() : true;

    // Additional filter criteria
    const matchesManager = filterCriteria.value.manager ? ticket.assignedTo.toLowerCase() === ticket_manager[filterCriteria.value.manager].toLowerCase() : true;
    const matchesPermissionRequired = filterCriteria.value.permission_required ? ticket.permissionRequired.toLowerCase() === permission_required[filterCriteria.value.permission_required].toLowerCase() : true;

    // Global search and date filters
    const matchesGlobalSearch = filterCriteria.value.globalSearch ? Object.values(ticket).some(value => value.toString().toLowerCase().includes(filterCriteria.value.globalSearch.toLowerCase())) : true;
    const matchesStartDate = filterCriteria.value.startDate ? new Date(ticket.closedOn) >= new Date(filterCriteria.value.startDate) : true;
    const matchesEndDate = filterCriteria.value.endDate ? new Date(ticket.closedOn) <= new Date(filterCriteria.value.endDate) : true;

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

watch(() => filteredArchiveItems.value, (newValue) => {
  console.log('filteredArchiveItems updated:', newValue);
}, { deep: true });



const selectedRows = ref([]);

const allRowsSelected = computed(() => {
  return selectedRows.value.length === filteredArchiveItems.value.length;
});

const toggleAllRowSelection = () => {
  selectedRows.value = allRowsSelected.value ? [] : filteredArchiveItems.value;
};

const exportToPDF = () => {
  if (selectedRows.value.length === 0) {
    alert('Please select at least one row to export.');
    return;
  }

  const doc = new jsPDF('l', 'mm', 'a4');
  const tableData = selectedRows.value.map(ticket => [
    ticket.id,
    ticket.requsterId,
    ticket.priority,
    ticket.title,
    ticket.assignedTo,
    ticket.createdBy,
    ticket.status,
    ticket.employmentStatus,
    ticket.category,
    ticket.role,
    ticket.closedOn
  ]);

  const tableHeaders = [
    'ID',
    'Requester WBI',
    'Priority',
    'Title',
    'Assigned To',
    'Created By',
    'Status',
    'Employment Status',
    'Category',
    'Role',
    'Closed On'
  ];

  const tableConfig = {
    head: [tableHeaders],
    body: tableData,
    startY: 20,
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      halign: 'center'
    }
  };

  doc.autoTable(tableConfig);

  doc.save('exported_tickets.pdf');
};
</script>


<script>
import {ref} from "vue";
import ExtendedItem from "./extended_item.vue";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  components: {
    ExtendedItem,
  },

};
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

            <button class="btn export" @click="exportToPDF">Export</button>

          </div>
        </div>
      </div>

      <div v-if="filterMenuVisible" class="filter-menu">
        <div class="filter-menu__input-group">
          <label class="filter-menu__input-group-label">Global Search:</label>
          <input type="text" class="filter-menu__input-group--text" placeholder="Search" v-model="filterCriteria.globalSearch">
        </div>

        <div class="filter-menu__input-group">
          <label class="filter-menu__input-group-label">Date Range:</label>
          <input type="date" class="filter-menu__input-group--date" placeholder="Start Date" v-model="filterCriteria.startDate">
          <input type="date" class="filter-menu__input-group--date" placeholder="End Date" v-model="filterCriteria.endDate">
        </div>
        <div class="filter-ticket">
          <label for="WBI">Requester WBI: </label>
          <input type="text" placeholder=" Search Requester's WBI" v-model="filterCriteria.requsterId">
        </div>

        <div class="filter-ticket">
          <label for="priority">Priority:</label>
          <select id="priority" name="priority" v-model="filterCriteria.priority">
            <option v-for="(label, value) in ticket_priority" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-ticket">
          <label for="employment_status">Employment status:</label>
          <select id="employment_status" name="employment_status" v-model="filterCriteria.employment_status">
            <option v-for="(label, value) in employment_status" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-ticket">
          <label for="manager">User's Direct Manager:</label>
          <select id="manager" name="manager" v-model="filterCriteria.manager">
            <option v-for="(label, value) in ticket_manager" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-ticket">
          <label for="category">Project's Name:</label>
          <select id="category" name="category" v-model="filterCriteria.category">
            <option v-for="(label, value) in required_category" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-ticket">
          <label for="permission_required">Permission Required:</label>
          <select id="permission_required" name="permission_required" v-model="filterCriteria.permission_required">
            <option v-for="(label, value) in permission_required" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="filter-ticket">
          <label for="user_role">User's Role:</label>
          <select id="user_role" name="user_role" v-model="filterCriteria.user_role">
            <option v-for="(label, value) in user_role" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>
        <div class="filter-ticket_btn">
        <!-- Button to Apply Filters -->
        <button class="filterbtn"  @click="applyFilters">Search</button>
        <!-- Button to Clear Filters -->
        <button class="filterbtn" @click="clearFilters">Clear</button>
        </div>
      </div>
    <div class="table-container">
      <table :class="{ 'table-lower': showMenu }">
        <thead>
        <tr>
          <th>
            <input type="checkbox" :checked="allRowsSelected" @change="toggleAllRowSelection">
          </th>

          <th v-for="column in columns" v-show="column.visible" :key="column.name" @click="handleColumnClick(column.name)">
            {{ column.name }}
            <span v-if="sortingColumn === column.name">{{ sortingDirection === 'asc' ? '↑' : '↓' }}</span>
          </th>

        </tr>
        </thead>

        <tbody>
        <tr v-for="ticket in filteredArchiveItems.slice(0, rows)" :key="ticket.id">

          <template v-if="ticket.id === expandedItemId">
          </template>
          <template v-else>
            <td>
              <input type="checkbox" :value="ticket" v-model="selectedRows">
            </td>

            <td v-if="columns.find(c => c.name === 'ARTIFACT ID' && c.visible)">
              <a href="#" @click.prevent="toggleExpandedView(ticket.id)">{{ ticket.id }}</a>
            </td>
            <td v-if="columns.find(c => c.name === 'REQUESTER WBI' && c.visible)">{{ ticket.requsterId }}</td>
            <td v-if="columns.find(c => c.name === 'PRIORITY' && c.visible)">{{ ticket.priority }}</td>
            <td v-if="columns.find(c => c.name === 'ARTIFACT TITLE' && c.visible)">{{ ticket.title }}</td>
            <td v-if="columns.find(c => c.name === 'ASSIGNED TO' && c.visible)">{{ ticket.assignedTo }}</td>
            <td v-if="columns.find(c => c.name === 'CREATED BY' && c.visible)">{{ ticket.createdBy }}</td>
            <td v-if="columns.find(c => c.name === 'STATUS' && c.visible)">{{ ticket.status }}</td>
            <td v-if="columns.find(c => c.name === 'EMPLOYMENT STATUS' && c.visible)">{{ ticket.employmentStatus }}</td>
            <td v-if="columns.find(c => c.name === 'CATEGORY' && c.visible)">{{ ticket.category }}</td>
            <td v-if="columns.find(c => c.name === 'ROLE' && c.visible)">{{ ticket.role }}</td>
            <td v-if="columns.find(c => c.name === 'CLOSED ON' && c.visible)">{{ ticket.closedOn }}</td>
          </template>
        </tr>
        </tbody>

      </table>
    </div>
    </div>
    <div v-if="expandedItemId" class="extended-item-container">
      <extended-item :ticket="archiveItems.find(ticket => ticket.id === expandedItemId)" :isArchive="true" @closeExtendedView="closeExtendedView" />
    </div>
  </div>
</template>

<style scoped lang="sass">
  @use '../styles/_colors.sass' as *
  @use '../styles/_navbar.sass' as *
  @use '../styles/_archive.sass' as *
  @use '../styles/_inputs.sass' as *

  :deep(.archive_tab)
    color: $n_in_nxp
    text-decoration: underline
    text-underline-offset: 3px
    text-decoration-thickness: 3px

</style>