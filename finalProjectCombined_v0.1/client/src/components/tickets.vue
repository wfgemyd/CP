<script setup>
import { ref, onMounted } from 'vue';

</script>
<script>
import Navbar from "./nav_bar.vue";
import { useRouter } from 'vue-router';
import TicketItem from './item_in_tickets.vue';
import ExtendedItem from './extended_item.vue';
import NewTicket from './new_ticket.vue';

export default {
  components: {
    Navbar,
    TicketItem,
    ExtendedItem,
    NewTicket
  },
  data() {
    return {
      tickets: [], // This will be populated with data fetched from the database
      expandedTicketId: null,
      searchTerm: '',
      selectedStatus: 'Open',
      filterMenuVisible: false,
      sortingColumn: '',
      sortingDirection: '',
      showSearchResults: false,
      originalTickets: [],
      filterCriteria: {
        id: '',
        title: '',
        status: '',
        priority: '',
        createdOnStart: '',
        createdOnEnd: '',
        updatedOnStart: '',
        updatedOnEnd: '',
      },
      currentPage: 1,
      ticketsPerPage: 4,
      totalPages: 0

    }
  },
  async mounted() {
    await this.fetchTickets();


    // Check for the search query parameter
    const searchTerm_ = this.$route.query.search;
    if (searchTerm_) {
      this.searchTerm = searchTerm_;
      console.log('this.searchTerm', this.searchTerm);
      this.searchTickets();
    }

  },
  computed: {
    paginatedTickets() {
      const startIndex = (this.currentPage - 1) * this.ticketsPerPage;
      const endIndex = startIndex + this.ticketsPerPage;
      return this.tickets.slice(startIndex, endIndex);
    }
  },
  methods: {
    async fetchTickets() {
      console.log('fetching tickets');
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
          this.tickets = jsonTickets.map(ticket => ({
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
            employment_type: ticket.requester_employment_status



          }));

        this.originalTickets = [...this.tickets];

        console.log('this.totalPages',this.totalPages);
        this.filterTickets(this.selectedStatus);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    },
    goToNewticket() {
      this.$router.push('/new_ticket');
    },
    toggleFilterMenu() {
      this.filterMenuVisible = !this.filterMenuVisible;
    },
    handleColumnClick(columnName) {
      if (this.sortingColumn === columnName) {
        this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortingColumn = columnName;
        this.sortingDirection = 'asc';
      }
      this.sortTickets();
    },
    sortTickets() {
      if (this.sortingColumn) {
        this.tickets.sort((a, b) => {
          let valueA = a[this.sortingColumn];
          let valueB = b[this.sortingColumn];

          if (typeof valueA === 'string') valueA = valueA.toLowerCase();
          if (typeof valueB === 'string') valueB = valueB.toLowerCase();

          if (this.sortingColumn === 'createdOn' || this.sortingColumn === 'updatedOn') {
            valueA = new Date(valueA).getTime();
            valueB = new Date(valueB).getTime();
          }

          return (valueA < valueB ? -1 : 1) * (this.sortingDirection === 'asc' ? 1 : -1);
        });
      }
    },

    applyFilters() {
      this.tickets = this.originalTickets.filter(ticket => {
        const matchesId = this.filterCriteria.id ? ticket.id.toString().includes(this.filterCriteria.id) : true;
        const matchesTitle = this.filterCriteria.title ? ticket.title.toLowerCase().includes(this.filterCriteria.title.toLowerCase()) : true;
        const matchesStatus = this.filterCriteria.status ? ticket.status.toLowerCase() === this.filterCriteria.status.toLowerCase() : true;
        const matchesPriority = this.filterCriteria.priority ? ticket.priority.toLowerCase() === this.filterCriteria.priority.toLowerCase() : true;

        const createdOnStart = this.filterCriteria.createdOnStart ? new Date(this.filterCriteria.createdOnStart) : null;
        const createdOnEnd = this.filterCriteria.createdOnEnd ? new Date(this.filterCriteria.createdOnEnd) : null;
        const matchesCreatedOn = createdOnStart && createdOnEnd
            ? new Date(ticket.createdOn) >= createdOnStart && new Date(ticket.createdOn) <= createdOnEnd
            : true;

        const updatedOnStart = this.filterCriteria.updatedOnStart ? new Date(this.filterCriteria.updatedOnStart) : null;
        const updatedOnEnd = this.filterCriteria.updatedOnEnd ? new Date(this.filterCriteria.updatedOnEnd) : null;
        const matchesUpdatedOn = updatedOnStart && updatedOnEnd
            ? new Date(ticket.updatedOn) >= updatedOnStart && new Date(ticket.updatedOn) <= updatedOnEnd
            : true;

        return matchesId && matchesTitle && matchesStatus && matchesPriority && matchesCreatedOn && matchesUpdatedOn;
      });
    },
    handleSearch(searchTerm) {
      this.searchTerm = searchTerm;
      this.searchTickets();
    },
    searchTickets() {
      console.log('this.searchTerm',this.searchTerm);

      const searchTerm = this.searchTerm.toLowerCase();
      this.tickets = this.originalTickets.filter(ticket =>
          ticket.title.toLowerCase().includes(searchTerm) ||
          ticket.id.toString().includes(searchTerm) ||
          ticket.status.toLowerCase().includes(searchTerm) ||
          ticket.priority.toLowerCase().includes(searchTerm) ||
          ticket.createdOn.includes(searchTerm) ||
          ticket.updatedOn.includes(searchTerm)
      );
      this.showSearchResults = true;
      this.searchTerm = ''; // Clear the search term after searching
      this.selectedStatus = ''; // Unselect the status buttons when search results are displayed

    },

    closeExtendedView(ticketId) {
      if (this.expandedTicketId === ticketId) {
        this.expandedTicketId = null;
      }
    },
    toggleExpandedView(ticketId, event) {
      // Prevent the default click event from collapsing the extended view

      this.expandedTicketId = this.expandedTicketId === ticketId ? null : ticketId;
      },
    filterTickets(status) {
      this.selectedStatus = status;
      this.showSearchResults = false;

      if (status === 'All') {
        this.tickets = [...this.originalTickets];
      } else {
        this.tickets = this.originalTickets.filter(ticket => {
          if (status === 'Closed') {
            let today = new Date().toISOString().slice(0, 10);
            return ticket.status === 'Closed' && ticket.closedOn === today;
          }
          if (status === 'Open') {
            return ticket.status === 'Open';
          }
          if (status === 'Verifying') {
            return ticket.status === 'Verifying';
          }
        });
      }

      this.totalPages = Math.ceil(this.tickets.length / this.ticketsPerPage);
      this.currentPage = 1; // Reset to the first page when filtering tickets
    },
    goToPage(page) {
      this.currentPage = page;
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  }
};

</script>

<template>
  <div class="wrapper2">
    <Navbar @search="handleSearch"/>
    <div class="alltickets_container">
      <div class="alltickets_window">
        <div class="alltickets_header">
          <h1>Tickets</h1>
          <button class="create_ticket" @click="goToNewticket()">New Ticket</button>
        </div>
        <div class="alltickets_navbar">
          <div class="ticket_status_view_options">
            <button
                class="open_tickets"
                :class="{ selected: selectedStatus === 'Open', unselected: selectedStatus !== 'Open' }"
                @click="filterTickets('Open')"
            >
              Open Tickets
            </button>
            <button
                class="closed_today_tickets"
                :class="{ selected: selectedStatus === 'Closed', unselected: selectedStatus !== 'Closed' }"
                @click="filterTickets('Closed')"
            >
              Closed Tickets
            </button>
            <button
                class="vetifying"
                :class="{ selected: selectedStatus === 'Verifying', unselected: selectedStatus !== 'Verifying' }"
                @click="filterTickets('Verifying')"
            >
              Verifying Tickets
            </button>
          </div>
          <div class="ticket_srch_filter_options">
            <div class="alltickets_search-container">
              <input type="text" placeholder="Search..." name="search" v-model="searchTerm">
              <button type="submit" @click="searchTickets"><img src="../assets/searchbtn.png" alt="searchicon"></button>
            </div>
            <div class="filter-container">
              <button class="alltickets_filter" @click="toggleFilterMenu"><img src="../assets/filter.png" alt="filter button"></button>
            </div>
          </div>
        </div>
        <div v-if="filterMenuVisible" class="filter_menu">
          <div class="filter_upper_row">
            <div class="filter-ticket">
              <label for="id">Ticket ID:</label>
              <input type="text" id="id" v-model="filterCriteria.id" @input="applyFilters">
            </div>
            <div class="filter-ticket">
              <label for="status">Status:</label>
              <select id="status" v-model="filterCriteria.status" @change="applyFilters">
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="verifying">Verifying</option>
              </select>
            </div>
            <div class="filter-ticket">
              <label for="priority">Priority:</label>
              <select id="priority" v-model="filterCriteria.priority" @change="applyFilters">
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div class="filter-ticket">
              <label>Created On:</label>
              <input type="date" v-model="filterCriteria.createdOnStart" @change="applyFilters">
              <input type="date" v-model="filterCriteria.createdOnEnd" @change="applyFilters">
            </div>
            <div class="filter-ticket">
              <label>Updated On:</label>
              <input type="date" v-model="filterCriteria.updatedOnStart" @change="applyFilters">
              <input type="date" v-model="filterCriteria.updatedOnEnd" @change="applyFilters">
            </div>
          </div>
          <div class="sort-menu">
            <div class="filter-option" @click="handleColumnClick('title')">
              <span>Title</span>
              <span v-if="sortingColumn === 'title'">{{ sortingDirection === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="filter-option" @click="handleColumnClick('createdOn')">
              <span>Created On</span>
              <span v-if="sortingColumn === 'createdOn'">{{ sortingDirection === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="filter-option" @click="handleColumnClick('updatedOn')">
              <span>Updated On</span>
              <span v-if="sortingColumn === 'updatedOn'">{{ sortingDirection === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="filter-option" @click="handleColumnClick('status')">
              <span>Status</span>
              <span v-if="sortingColumn === 'status'">{{ sortingDirection === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="filter-option" @click="handleColumnClick('priority')">
              <span>Priority</span>
              <span v-if="sortingColumn === 'priority'">{{ sortingDirection === 'asc' ? '↑' : '↓' }}</span>
            </div>
          </div>

        </div>

        <div
            class="search_results"
            :class="{ showSearchResults: selectedStatus === 'Search Results'}"
            @click="filterTickets('Search Results')"
            v-if="showSearchResults"
        >
          Search Results
        </div>

        <div v-for="ticket in paginatedTickets" :key="ticket.id">
          <component
              :is="ticket.id === expandedTicketId ? 'extended-item' : 'ticket-item'"
              :ticket="ticket"
              :isArchive="false"
              @click="ticket.id !== expandedTicketId && toggleExpandedView(ticket.id)"
              @closeExtendedView="closeExtendedView(ticket.id)"
          />
        </div>
        <div class="pagination">
          <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
          <span v-for="page in totalPages" :key="page">
    <button @click="goToPage(page)" :class="{ active: currentPage === page }">{{ page }}</button>
  </span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
  @use '../styles/_colors.sass' as *
  @use '../styles/_navbar.sass' as *
  :deep(.tickets_tab)
    color: $n_in_nxp
    text-decoration: underline
    text-underline-offset: 3px
    text-decoration-thickness: 3px

</style>