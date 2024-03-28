<script setup>
import { ref } from 'vue';
import Navbar from "./nav_bar.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const goTotickets = () => {
  router.push('/tickets');
};

// Assuming these constants are received from the backend and can be updated dynamically
const ticket_priority = { low: "low", medium: "medium", high: "high", urgent: "urgent", none: "none"};
const ticket_status = { open: "open", verifying: "verifying", rejected: "rejected", closed: "closed" };
const required_category = { gendalf: "gendalf", banana: "banana", coolchip: "coolchip" };
const ticket_WBI = { WBI1: "WBI1", WBI2: "WBI2", WBI3: "WBI3" };
const ticket_manager = { manager1: "manager1", manager2: "manager2", manager3: "manager3" };
const onboarding_was_completed = { false: "false", true: "true" };
const employment_status = { contractor: "contractor", fullTime: "full-time", partTime: "part-time", intern: "intern" };
const permission_required = { read: "read", write: "write", none: "none" };
const user_role = { designer: "designer", developer: "developer", manager: "manager", tester: "tester" };
const attachment = { none: null };

// Reactive properties for selected values
const selectedPriority = ref('');
const selectedStatus = ref('');
const selectedCategory = ref('');
const selectedWBI = ref('');
const selectedManager = ref('');
const selectedOnboarding = ref('');
const selectedEmploymentStatus = ref('');
const selectedPermissionRequired = ref('');
const selectedUserRole = ref('');
const selectedAttachment = ref('');
const ticketSubject = ref('');
const ticketDescription = ref('');
</script>

<template>
  <div class="wrapper2">
    <Navbar/>
    <div class="newticket_container">
    <div class="newticket_window">

    <div class="newticket_header">
      <h1>New ticket</h1>
      <button class="X" ><img @click="goTotickets" src="../assets/Plus.png" alt="X"></button>
    </div>
    <div class="newticket_subject">
      <div class="label-container">
      <label for="subject">Subject:</label>
      <div class="circle"><p class="question-mark">?</p></div></div>
      <input type="text" id="subject" name="subject" v-model="ticketSubject" placeholder="Enter the subject of the ticket" required>
    </div>
    <div class="newticket_description">
      <div class="label-container">
      <label for="description">Description:</label>
      <div class="circle"><p class="question-mark">?</p></div></div>
      <textarea id="description" name="description" v-model="ticketDescription" placeholder="Enter the description of the ticket" required></textarea>
    </div>
    <div class="choosing_fields">
      <ul class="fields">
        <li>
          <div class="label-container">
          <label for="WBI">WBI: </label>
          <div class="circle"><p class="question-mark">?</p></div></div>

          <select id="WBI" name="WBI" v-model="selectedWBI">
            <option v-for="(label, value) in ticket_WBI" :key="value" :value="value">{{ label }}</option>
          </select>
        </li>
        <li>
          <div class="label-container">
          <label for="priority">Priority:</label>
          <div class="circle"><p class="question-mark">?</p></div></div>

          <select id="priority" name="priority" v-model="selectedPriority" >
            <option v-for="(label, value) in ticket_priority" :key="value" :value="value">{{ label }}</option>
          </select>
        </li>
        <li>
          <div class="label-container">
          <label for="employment_status">Employment status:</label>
          <div class="circle"><p class="question-mark">?</p></div></div>

          <select id="employment_status" name="employment_status" v-model="selectedEmploymentStatus">
            <option v-for="(label, value) in employment_status" :key="value" :value="value">{{ label }}</option>
          </select>
        </li>
        <li>
          <div class="label-container">
          <label for="manager">User's Direct Manager:</label>
          <div class="circle"><p class="question-mark">?</p></div></div>

          <select id="manager" name="manager" v-model="selectedManager">
            <option v-for="(label, value) in ticket_manager" :key="value" :value="value">{{ label }}</option>
          </select>
        </li>
      </ul>
      <ul class="fields2">

        <li>
          <div class="label-container">
          <label for="category">Project's Name:</label>
          <div class="circle"><p class="question-mark">?</p></div></div>

          <select id="category" name="category" v-model="selectedCategory">
            <option v-for="(label, value) in required_category" :key="value" :value="value">{{ label }}</option>
          </select>
        </li>
        <li>
          <div class="label-container">
          <label for="permission_required">Permission Required:</label>
          <div class="circle"><p class="question-mark">?</p></div></div>

          <select id="permission_required" name="selectedPermissionRequired" v-model="selectedPermissionRequired">
            <option v-for="(label, value) in permission_required" :key="value" :value="value">{{ label }}</option>
          </select>
        </li>
        <li>
          <div class="label-container">
          <label for="user_role">User's Role:</label>
          <div class="circle"><p class="question-mark">?</p></div></div>

          <select id="user_role" name="selectedUserRole" v-model="selectedUserRole">
            <option v-for="(label, value) in user_role" :key="value" :value="value">{{ label }}</option>
          </select>
        </li>

        <li class="add_attachment">
          <div class="button_extended_container">
            <button class="add_attachment">Attachment <img class="paperclip" src="../assets/Paperclip.png" alt="add attachments"></button>
          </div>
        </li>
      </ul>
      </div>
      <div class="finalize_ticket">
        <button class="finalize_ticket_btn" @click="goTotickets">Submit</button>
      </div>
    </div>
    </div>
  </div>
</template>


<style scoped lang="sass">
  @use '../styles/_colors.sass' as *
  @use '../styles/_navbar.sass' as *
  @use '../styles/extended_item_tickets.sass' as *
  :deep(.tickets_tab)
    color: $n_in_nxp
    text-decoration: underline
    text-underline-offset: 3px
    text-decoration-thickness: 3px
  .X
    cursor: pointer
    margin: 0
    padding: 0
    border: none
    background: none

    &:hover
      border: none
      background: none
      scale: 110%
    &:active
      border: none
      background: none
      scale: 120%

  .label-container
    display: flex
    justify-content: center
    align-items: start
    .circle
      width: 0.8rem
      height: 0.8rem
      background-color: #00BFFF
      border-radius: 50% //makes it a circle
      display: flex //centers the text
      justify-content: center //centers the text
      align-items: center //centers the text
      margin-top: 0.15rem
      margin-left: 0.2rem

      .question-mark
        font-size: 0.7rem
        font-weight: bold
        color: white
</style>