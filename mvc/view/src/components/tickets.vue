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
      expandedTicketId: null
    }
  },
  mounted() {
    this.fetchTickets();
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
      this.tickets = [
        { id: '61', title: 'Ticket 1', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Open', priority: 'High' },
        { id: '396731', title: 'Tictjuae69', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Open', priority: 'High' },
        { id: '185658356', title: 'TickEJEJ369', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Open', priority: 'High' },
        { id: '17617171', title: 'Ticket 3691', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Open', priority: 'High' },
        { id: '12376127', title: 'Tickwyw96', createdOn: '2024-01-01', updatedOn: '2024-01-02', closedOn: '2024-01-03', status: 'Open', priority: 'High' },

        // Add more mock ticket objects as needed
      ];
    }
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
            <button class="open_tickets">Open Tickets</button>
            <button class="closed_tickets">Closed Tickets</button>
            <button class="all_tickets">All Tickets</button>
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