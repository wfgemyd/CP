<script setup>
import {ref, computed, watch} from 'vue';
import { useRouter } from 'vue-router';
import { onMounted} from 'vue';


const props = defineProps({
  ticket: Object,
  isArchive: {
    type: Boolean,
    default: false
  }
});

const ticket_priority = ref({});
const ticket_status = ref({});
const required_category = ref({});
const permission_required = ref({});
const ticket_manager = ref({});
const position = ref([]);
const ticket_WBI = ref('');
const employment_status = ref({});
const archiveItems = ref([]);


const currentPage = ref(1);
const rows = ref(10); // Number of rows to display in the table per page

const totalPages = ref(0);
async function totalPagesfunc() {
  return Math.ceil((archiveItems.value.length / rows.value));
}



function goToPage(page) {
  currentPage.value = page;
}


onMounted(async () => {
  try {
    const optionsResponse = await fetch('/api/tickets/options', {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    const options = await optionsResponse.json();
    console.log('options:', options);
    ticket_priority.value = options.ticket_priority || {};
    ticket_status.value = options.ticket_status || {};
    required_category.value = options.required_category || {};
    permission_required.value = Object.entries(options.permission_required || {})
        .filter(([value, label]) => value !== 'None')
        .reduce((acc, [value, label]) => ({ ...acc, [value]: label }), {});
    position.value = options.position || {};
    ticket_manager.value = options.ticket_manager || {};
    employment_status.value = options.employment_status || {};
    ticket_WBI.value = localStorage.getItem('wbi');
    await fetchTickets();
  } catch (error) {
    console.error('Failed to fetch ticket options:', error);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
  }
});

async function fetchTickets() {
  try {
    const response = await fetch('/api/tickets', {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonTickets = await response.json();
    archiveItems.value = jsonTickets.filter(ticket => ticket.status_name === 'Closed') // Filter tickets with status "Closed"
        .map(ticket => ({
      ...ticket,
      title: ticket.subject,
      content: ticket.content,
      createdOn: ticket.created_at?.split('T')[0] || '',
      updatedOn: ticket.updated_at?.split('T')[0] || '',
      closedOn: ticket.completed_at ? ticket.completed_at.split('T')[0] : '',
      status: ticket.status_name,
      priority: ticket.priority_name,
      id: ticket.ticket_id,
      category: ticket.category_name,
      assignedTo: ticket.assigned_to_name,
      requester: ticket.requester_name,
      permission_required: ticket.permission_required,
      requester_position: ticket.requester_position,
      employment_type: ticket.requester_employment_status,
      requsterId: ticket.wbi,
    }));
    filteredResults.value = archiveItems.value; // Initialize filteredResults with all tickets
    totalPages.value = await totalPagesfunc();

  } catch (err) {
    console.error('Error fetching tickets:', err);
  }
}

const showMenu = ref(false);




const filteredResults = ref([]);
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
  'POSITION',
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
  requester: '',
  status: '',
  employment_status: '',
  category: '',
  requester_position: '',
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
    requester: '',
    status: '',
    employment_status: '',
    category: '',
    requester_position: '',
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

  if (sortingColumn.value === columnName) {

    sortingDirection.value = sortingDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortingColumn.value = columnName;
    sortingDirection.value = 'asc';
  }
  // Do not try to modify filteredArchiveItems here
}
function sortItems(tickets) {

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

  // Apply pagination
  const startIndex = (currentPage.value - 1) * rows.value;
  const endIndex = startIndex + rows.value;
  return tickets.slice(startIndex, endIndex);
});
function toggleExpandedView(ticketId) {
  expandedItemId.value = ticketId === expandedItemId.value ? null : ticketId;
}
function closeExtendedView() {
  expandedItemId.value = null;
}
function applyFilters() {
  let tempFilteredResults = JSON.parse(JSON.stringify(archiveItems.value));
  console.log('tempFilteredResults', tempFilteredResults);
  tempFilteredResults = tempFilteredResults.filter(ticket => {
    console.log(filteredResults.value);

    console.log("Item:", ticket);
    console.log("Filter Criteria:", filterCriteria.value);

    // Artifact ID comparison (assuming it's numeric)
    const matchesArtifactId = filterCriteria.value.id ? ticket.id === filterCriteria.value.id : true;

    // String field comparisons
    const matchesRequesterId = filterCriteria.value.requsterId ? ticket.requsterId.toLowerCase().includes(filterCriteria.value.requsterId.toLowerCase()) : true;
    const matchesArtifactTitle = filterCriteria.value.title ? ticket.title.toLowerCase().includes(filterCriteria.value.title.toLowerCase()) : true;
    const matchesAssignedTo = filterCriteria.value.assignedTo ? ticket.assignedTo.toLowerCase().includes(filterCriteria.value.assignedTo.toLowerCase()) : true;
    const matchesCreatedBy = filterCriteria.value.requester ? ticket.requester.toLowerCase().includes(filterCriteria.value.requester.toLowerCase()) : true;

    // Dropdown filter comparisons using dynamically received constants
    const matchesPriority = filterCriteria.value.priority ? ticket.priority === ticket_priority.value[filterCriteria.value.priority] : true;
    const matchesStatus = filterCriteria.value.status ? ticket.status === ticket_status.value[filterCriteria.value.status] : true;
    const matchesEmploymentStatus = filterCriteria.value.employment_status ? ticket.employment_type === employment_status.value[filterCriteria.value.employment_status] : true;
    const matchesCategory = filterCriteria.value.category ? ticket.category === required_category.value[filterCriteria.value.category] : true;
    const matchesUserRole = filterCriteria.value.position ? ticket.requester_position === position.value[filterCriteria.value.position] : true;



    // Additional filter criteria
    const matchesManager = filterCriteria.value.manager ? ticket.assignedTo === ticket_manager.value[filterCriteria.value.manager] : true;
    const matchesPermissionRequired = filterCriteria.value.permission_required ? ticket.permission_required === permission_required.value[filterCriteria.value.permission_required] : true;

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
  showSearchResults.value = true;
  currentPage.value = 1; // Reset to the first page after applying filters
  totalPages.value = Math.ceil(filteredResults.value.length / rows.value);
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

const exportToExcel = () => {
  if (selectedRows.value.length === 0) {
    alert('Please select at least one row to export.');
    return;
  }

  const tableData = selectedRows.value.map(ticket => [
    ticket.id,
    ticket.requsterId,
    ticket.priority,
    ticket.title,
    ticket.assignedTo,
    ticket.requester,
    ticket.status,
    ticket.employment_type,
    ticket.category,
    ticket.requester_position,
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
    'Position',
    'Closed On'
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'exported_tickets.xlsx';
  link.click();
};

</script>


<script>
import { ref } from "vue";
import ExtendedItem from "./extended_item.vue";
import 'jspdf-autotable';
import Navbar from "./nav_bar.vue";
import { useRouter } from 'vue-router';
import Ticket from './tickets.vue';

export default {
  components: {
    Navbar,
    Ticket,
    ExtendedItem,
  },
  data() {
    return {
      searchTerm: '',
    };
  },
  methods: {
    handleSearch(searchTerm) {
      this.searchTerm = searchTerm;
      this.searchTickets();
    },
    searchTickets() {
      // Navigate to the tickets page with the search term as a query parameter
      this.$router.push({ path: '/tickets', query: { search: this.searchTerm } });
    }

  }
}
</script>

<template>
  <div class="wrapper2">
    <Navbar @search="handleSearch"/>
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

            <button class="btn export" @click="exportToExcel">Export</button>

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
          <select id="user_role" name="user_role" v-model="filterCriteria.position">
            <option v-for="(label, value) in position" :key="value" :value="value">{{ label }}</option>
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
            <td v-if="columns.find(c => c.name === 'CREATED BY' && c.visible)">{{ ticket.requester }}</td>
            <td v-if="columns.find(c => c.name === 'STATUS' && c.visible)">{{ ticket.status }}</td>
            <td v-if="columns.find(c => c.name === 'EMPLOYMENT STATUS' && c.visible)">{{ ticket.employment_type }}</td>
            <td v-if="columns.find(c => c.name === 'CATEGORY' && c.visible)">{{ ticket.category }}</td>
            <td v-if="columns.find(c => c.name === 'POSITION' && c.visible)">{{ ticket.requester_position }}</td>
            <td v-if="columns.find(c => c.name === 'CLOSED ON' && c.visible)">{{ ticket.closedOn }}</td>
          </template>
        </tr>
        </tbody>

      </table>
    </div>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Next</button>
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