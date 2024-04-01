<script setup>
import { ref } from 'vue';
import Navbar from "./nav_bar.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const goToNewticket = () => {
  router.push('/new_ticket');
};

</script>
<script>
import TicketItem from './item_in_tickets.vue';
import ExtendedItem from './extended_item.vue';

export default {
  components: {
    TicketItem,
    ExtendedItem
  },
  data() {
    return {
      tickets: [], // This will be populated with data fetched from the database
      expandedTicketId: null,
      selectedStatus: 'Open',
    }
  },
  mounted() {
    this.fetchTickets();
    this.fetchTickets().then(() => {
      this.filterTickets(this.selectedStatus);
    });
  },
  methods: {
    closeExtendedView(ticketId) {
      if (this.expandedTicketId === ticketId) {
        this.expandedTicketId = null;
      }
    },
    toggleExpandedView(ticketId, event) {
      // Prevent the default click event from collapsing the extended view

      this.expandedTicketId = this.expandedTicketId === ticketId ? null : ticketId;
      },
    async fetchTickets() {
      // Fetch tickets from the database and assign them to this.tickets
      this.originalTickets  = [
        { id: '61', title: 'Ticket 1', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Open', priority: 'High', project: "Gendalf" },
        { id: '396731', title: 'Tictjuae69', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-04-01', status: 'Closed', priority: 'High' },
        { id: '185658356', title: 'TickEJEJ369', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Open', priority: 'High' },
        { id: '17617171', title: 'Ticket 3691', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Verifying', priority: 'High' },
        { id: '12376127', title: 'Tickwyw96', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Open', priority: 'High' },

      ];
      //const response = await fetch('/api/tickets');
      //const jsonTickets = await response.json();
      //this.originalTickets = jsonTickets;
      //this.tickets = [...this.originalTickets];

      this.tickets = [...this.originalTickets]; //copy
    },
    filterTickets(status) {
      this.selectedStatus = status;

      if (status === 'All') {
        this.tickets = [...this.originalTickets];
        return;
      }

      this.tickets = this.originalTickets.filter(ticket => {
        if (status === 'Closed') {
          // Assuming you want to check if the ticket was closed today
          let today = new Date().toISOString().slice(0, 10); //for future use

          return ticket.status === 'Closed' && ticket.closedOn === '2024-04-01';
        }
        if (status === 'Open') {
          return ticket.status === 'Open';
        }
        if (status === 'Verifying') {
          return ticket.status === 'Verifying';
        }
      });
    },
  }
};

</script>

<template>
  <div class="wrapper2">
    <Navbar/>
    <div class="alltickets_container">
      <div class="alltickets_window">
        <div class="alltickets_header">
          <h1>Tickets</h1>
          <button class="create_ticket" @click="goToNewticket">New Ticket</button>
        </div>
        <div class="alltickets_navbar">
          <div class="ticket_status_view_options">
            <button
                class="open_tickets"
                :class="{ selected: selectedStatus === 'Open', unselected: selectedStatus !== 'Open' }"
                @click="filterTickets('Open')">Open Tickets</button>
            <button
                class="closed_today_tickets"
                :class="{ selected: selectedStatus === 'Closed', unselected: selectedStatus !== 'Closed' }"
                @click="filterTickets('Closed')">Closed Tickets</button>
            <button
                class="vetifying"
                :class="{ selected: selectedStatus === 'Verifying', unselected: selectedStatus !== 'Verifying' }"
                @click="filterTickets('Verifying')">Verifying Tickets</button>
          </div>
          <div class="ticket_srch_filter_options">
            <div class="alltickets_search-container">
              <input type="text" placeholder="Search..." name="search">
              <button type="submit"><img src="../assets/searchbtn.png" alt="searchicon"></button>
            </div>
            <div class="filter-container">
              <button class="alltickets_filter"><img src="../assets/filter.png" alt="filter button"></button>
            </div>
          </div>
        </div>
        <div v-for="ticket in tickets" :key="ticket.id">
          <component
              :is="ticket.id === expandedTicketId ? 'extended-item' : 'ticket-item'"
              :ticket="ticket"
              @click="ticket.id !== expandedTicketId && toggleExpandedView(ticket.id)"

              @closeExtendedView="closeExtendedView(ticket.id)"
          />
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