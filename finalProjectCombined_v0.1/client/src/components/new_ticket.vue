<script setup>
import Navbar from "./nav_bar.vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from 'vue';


const props = defineProps({
  ticket: Object,
  isArchive: {
    type: Boolean,
    default: false
  }
});
const router = useRouter();

const ticket_priority = ref([]);
const ticket_status = ref([]);
const required_category = ref([]);

const permission_required = ref([]);
const position = ref([]);
const ticket_WBI = ref('');
const selectedFile = ref(null);
const fileUploaded = ref(false);

onMounted(async () => {
  try {
    const optionsResponse = await fetch('/api/tickets/options', {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    const options = await optionsResponse.json();
    ticket_priority.value = options.ticket_priority || {};
    ticket_status.value = options.ticket_status || {};
    required_category.value = options.required_category || {};
    permission_required.value = Object.entries(options.permission_required || {})
        .filter(([value, label]) => value !== 'None')
        .reduce((acc, [value, label]) => ({ ...acc, [value]: label }), {});
    position.value = options.position || {};
    ticket_WBI.value = localStorage.getItem('wbi');
  } catch (error) {
    console.error('Failed to fetch ticket options:', error);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
  }
});

const selectedPriority = ref('Low'); //y
const selectedStatus = ref('Open'); //n
const selectedCategory = ref(''); //y
const selectedManager = ref(''); //y
const selectedEmploymentStatus = ref(localStorage.getItem('employment_name')); //y
const selectedPermissionRequired = ref(''); //y
const selectedUserPosition = ref(''); //y
const ticketSubject = ref(''); //y
const ticketDescription = ref(''); //y


async function fetchProjectManager() {
  try {
    const response = await fetch(`/api/new_ticket/${selectedCategory.value}/manager`, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    const manager = await response.json();
    console.log('manager:', manager);
    selectedManager.value = manager.wbi;
  } catch (error) {
    console.error('Failed to fetch project manager:', error);
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes

  if (file && file.size <= maxSize) {
    selectedFile.value = file;
    console.log('selectedFile:', selectedFile.value);
    fileUploaded.value = true; // Set fileUploaded to true when a file is selected
  } else {
    alert('Please select a file with a size less than or equal to 5MB.');
    selectedFile.value = null;
    fileUploaded.value = false; // Set fileUploaded to false if no file is selected or size exceeds limit
  }
}


async function submitTicket() {
  const formData = new FormData();
  formData.append('subject', ticketSubject.value);
  formData.append('content', ticketDescription.value);
  formData.append('status_name', selectedStatus.value);
  formData.append('priority_name', selectedPriority.value);
  formData.append('userId', localStorage.getItem('uId'));
  formData.append('category_name', selectedCategory.value);
  formData.append('requested_position', selectedUserPosition.value);
  formData.append('manager_wbi', selectedManager.value);
  formData.append('permission_required_name', selectedPermissionRequired.value);

  if (selectedFile.value) {
    console.log('selectedFile.value',selectedFile.value);
    // Append the file data
    formData.append('attachment', selectedFile.value);
    formData.append('attachment_type', selectedFile.value.type);
    console.log('formData:', formData.keys());
  }

  try {
    const response = await fetch(`/api/new_ticket/${localStorage.getItem('uId')}/new_ticket`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to submit ticket');
    }

    const result = await response.json();
    console.log('Ticket submitted successfully:', result);
    router.push('/tickets');
  } catch (error) {
    console.error('Error submitting ticket:', error);
  }
}

</script>

<script>

import Tooltip from "./tooltip.vue";

export default {
  props: {
    ticket: Object
  },
  components: {
    Tooltip,
  }
}

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
          <Tooltip text="Enter a brief summary or title for the ticket">
            <div class="circle">
              <p class="question-mark">?</p>
            </div>
          </Tooltip>
        </div>
        <input type="text" id="subject" name="subject" v-model="ticketSubject" placeholder="Enter the subject of the ticket" required>
      </div>

      <div class="newticket_description">
        <div class="label-container">
          <label for="description">Description:</label>
          <Tooltip text="Provide a detailed description of the issue or request">
            <div class="circle">
              <p class="question-mark">?</p>
            </div>
          </Tooltip>
        </div>
        <textarea id="description" name="description" v-model="ticketDescription" placeholder="Enter the description of the ticket" required></textarea>
      </div>
      <div class="choosing_fields">
        <ul class="fields">
          <li>
            <div class="label-container">
              <label for="WBI">WBI: </label>
              <Tooltip text="Enter the user's WBI (Work Breakdown Identifier)">
                <div class="circle">
                  <p class="question-mark">?</p>
                </div>
              </Tooltip>
            </div>
            <select id="WBI" name="WBI" v-model="ticket_WBI" disabled>
              <option :value="ticket_WBI">{{ ticket_WBI }}</option>
            </select>
          </li>
          <li>
            <div class="label-container">
              <label for="priority">Priority:</label>
              <Tooltip text="Select the priority level of the ticket">
                <div class="circle">
                  <p class="question-mark">?</p>
                </div>
              </Tooltip>
            </div>
            <select id="priority" name="priority" v-model="selectedPriority" disabled>
              <option v-for="(label, value) in ticket_priority" :key="value" :value="value">{{ label }}</option>
            </select>
          </li>
          <li>
            <div class="label-container">
              <label for="employment_status">Employment status:</label>
              <Tooltip text="Select the employment status of the user">
                <div class="circle">
                  <p class="question-mark">?</p>
                </div>
              </Tooltip>
            </div>
            <select id="employment_status" name="employment_status" v-model="selectedEmploymentStatus" disabled>
              <option  :value="selectedEmploymentStatus">{{ selectedEmploymentStatus }}</option>
            </select>
          </li>

          <li>
            <div class="label-container">
              <label for="manager">User's Direct Manager:</label>
              <Tooltip text="Select the user's direct manager">
                <div class="circle">
                  <p class="question-mark">?</p>
                </div>
              </Tooltip>
            </div>
            <select id="manager" name="manager" v-model="selectedManager" disabled>
              <option :value="selectedManager">{{ selectedManager }}</option>
            </select>
          </li>
        </ul>
        <ul class="fields2">
          <li>
            <div class="label-container">
              <label for="category">Project's Name:</label>
              <Tooltip text="Select the project associated with the ticket">
                <div class="circle">
                  <p class="question-mark">?</p>
                </div>
              </Tooltip>
            </div>
            <select id="category" name="category" v-model="selectedCategory" @change="fetchProjectManager">
              <option v-for="(label, value) in required_category" :key="value" :value="value">{{ label }}</option>
            </select>
          </li>
          <li>
            <div class="label-container">
              <label for="permission_required">Permission Required:</label>
              <Tooltip text="Select the permission level required for the ticket">
                <div class="circle">
                  <p class="question-mark">?</p>
                </div>
              </Tooltip>
            </div>
            <select id="permission_required" name="selectedPermissionRequired" v-model="selectedPermissionRequired">
              <option v-for="(label, value) in permission_required" :key="value" :value="value">{{ label }}</option>
            </select>
          </li>
          <li>
            <div class="label-container">
              <label for="user_role">User's Role:</label>
              <Tooltip text="Select the user's role">
                <div class="circle">
                  <p class="question-mark">?</p>
                </div>
              </Tooltip>
            </div>
            <select id="user_role" name="selectedUserRole" v-model="selectedUserPosition">
              <option v-for="(label, value) in position" :key="value" :value="value">{{ label }}</option>
            </select>
          </li>

        <li>
          <div class="button_extended_container">
            <label class="add_attachment">
              <input type="file" @change="handleFileUpload" accept=".jpg,.jpeg,.png,.pdf" style="display: none;">
              Attachment <img class="paperclip" src="../assets/Paperclip.png" alt="add attachments">
            </label>
            <span v-if="fileUploaded" class="file-uploaded-indicator">File uploaded</span>
          </div>
        </li>
      </ul>
      </div>
      <div class="finalize_ticket">
        <button class="finalize_ticket_btn" @click="submitTicket">Submit</button>
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