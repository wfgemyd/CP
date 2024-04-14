<script setup>
import { ref } from 'vue';

</script>
<script>
export default {
  props: {
    ticket: Object
  }
}
</script>

<template>
  <div class="alltickets_item">
    <div class="alltickets_item_upperrow">
      <div class="alltickets_item_header">
        <h3>{{ ticket.title }}</h3>
      </div>
      <div class="alltickets_item_ID">
        <h4>#{{ ticket.id }}</h4>
      </div>
    </div>
    <div class="alltickets_item_lowerrow">
      <div class="alltickets_item_dates">
        <ul>
          <li id="created_on"><span class="label">Created on:</span> {{ ticket.createdOn }}</li>
          <li id="updated_on"><span class="label">Updated on:</span> {{ ticket.updatedOn }}</li>
          <li id="closed_on"><span class="label">Closed on:</span> {{ ticket.closedOn }}</li>
        </ul>
      </div>
      <div class="alltickets_item_status_priority">
        <ul>
          <li id="status_"><span class="label">Status:</span> {{ ticket.status }}</li>
          <li id="priority_"><span class="label">Priority:</span> {{ ticket.priority }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>




<style lang="sass">

</style>