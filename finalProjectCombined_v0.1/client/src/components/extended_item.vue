<script setup>
import {capitalize, computed, onMounted, ref} from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";

const route = useRoute();
const isArchiveRoute = computed(() => route.path.includes('/archive'));

function usersRole() {
  const userRole = ref(localStorage.getItem('userRole'));
    return userRole.value === 'Manager' || userRole.value === 'Administrator';
}

const props = defineProps({
  ticket: Object,
  isArchive: {
    type: Boolean,
    default: false
  }
});

const ticketDetails = ref({});
const ticketComments = ref([]);
const ticket_priority = ref({});
const ticket_status = ref({});
const required_category = ref({});
const ticket_manager = ref({});
const employment_status = ref({});
const permission_required = ref({});
const position = ref({});
const ticketEvents = ref([]);
let initialTicketDetails = ref({});


onMounted(async () => {
  try {
    const response = await fetch(`/api/tickets/${props.ticket.id}/details`, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    ticketDetails.value = data.ticket;
    ticketDetails.value.created_at = new Date(data.ticket.created_at).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).replace(',', ' at');

    ticketDetails.value = data.ticket;
    initialTicketDetails.value = { ...data.ticket }; // Create a copy of the initial ticket details

    ticketEvents.value = data.events.map(event => ({
      ...event,
      created_at: event.created_at // Store the raw created_at value
    }));

    // Format the created_at value for each comment
// Fetch user details for each comment
    ticketComments.value = await Promise.all(data.comments.map(async (comment) => {
      const fullName = `${data.f_name} ${data.l_name}`;
      return {
        ...comment,
        fullName,
        isSender: comment.user_id === parseInt(localStorage.getItem('uId')),
        created_at: comment.created_at,
      };
    }));

    const optionsResponse = await fetch('/api/tickets/options', {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }

    });
    const options = await optionsResponse.json();
    ticket_priority.value = options.ticket_priority;
    ticket_status.value = options.ticket_status;
    required_category.value = options.required_category;
    ticket_manager.value = options.ticket_manager;
    employment_status.value = options.employment_status;
    permission_required.value = options.permission_required;
    position.value = options.position;

    associateEventsWithComments();

  } catch (error) {
    console.error('Failed to fetch ticket options:', error);
    // Log the error message and stack trace
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
  }
});
async function associateEventsWithComments() {
  const timeThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Associate events with comments
  ticketComments.value.forEach(comment => {
    comment.events = ticketEvents.value.filter(event => {
      const eventDate = new Date(event.created_at);
      const commentDate = new Date(comment.created_at);
      const timeDiff = Math.abs(eventDate - commentDate);
      return timeDiff <= timeThreshold && event.aggregate_id === comment.ticket_id;
    });
  });

  // Remove associated events from the main events array
  ticketEvents.value = ticketEvents.value.filter(event =>
      !ticketComments.value.some(comment =>
          comment.events.some(commentEvent => commentEvent.event_id === event.event_id)
      )
  );

  // Get unassociated events
  const unassociatedEvents = await getUnassociatedEvents();

  // Combine comments and unassociated events
  const combinedData = [...ticketComments.value, ...unassociatedEvents];

  // Sort combined data by created_at date
  combinedData.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateA - dateB;
  });

  // Update ticketComments.value with sorted combined data
  ticketComments.value = combinedData;
}

function getUnassociatedEvents() {
  // Assuming ticketEvents.value is an array of event objects
  return ticketEvents.value.map(event => ({
    ...event,
    comment: getEventDetails(event), // Construct a comment-like string for events
    created_at: event.created_at,
    id: event.event_id, // Ensure each event has a unique key
    wbi_id: event.wbi
  }));
}

//async function getWbiFromuser_id(user_id) {
 // const response = await axios.post(`/api/tickets/event_store`, { user_id }, {
 //   headers: {
 //     'Authorization': `${localStorage.getItem('token')}`
 //   }
 // });
 // const wbiData = response.data;
 // console.log('wbiData:', wbiData.get_wbi_by_user_id);
 // return wbiData.get_wbi_by_user_id;
//}

function getEventDetails(event) {
  const payload = event.payload;

  switch (event.event_type) {
    case 'category_change':
      return `Category changed to: ${payload.new_category}`;
    case 'priority_change':
      return `Priority changed to: ${payload.new_priority}`;
    case 'position_change':
      return `Position changed to: ${payload.new_position}`;
    case 'permission_change':
      return `Permission changed to: ${payload.new_permission}`;
    case 'ticket_updated':
      const changes = payload.changes;
      const changeDetails = Object.entries(changes)
          .map(([key, value]) => `${capitalize(key)} changed to: ${value}`)
          .join(', ');
      return `${changeDetails}`;
    default:
      return '';
  }
}

function formatCreatedAt(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).replace(',', ' at');
}
</script>

<script>
import {ref} from "vue";

export default {
  props: {
    ticket: Object
  },
  data() {
    return {
      isEditing: false,
      selectedFile: null,
      fileUploaded: false,
      responseMessage: '',
      userId: localStorage.getItem('uId') || null,
      ticketDetails: {},
      initialTicketDetails: {}, // Store the initial ticket details

    }
  },
  methods: {
    async toggleEditing() {
      if (this.isEditing) {
        try {
          const updatedFields = {};

          // Compare each field and add it to updatedFields if it has changed
          if (this.ticket.status !== this.initialTicketDetails.status) {
            updatedFields.status_name = this.ticket.status;
          }
          if (this.ticket.priority !== this.initialTicketDetails.priority) {
            updatedFields.priority_name = this.ticket.priority;
          }
          if (this.ticket.assignedTo !== this.initialTicketDetails.assignedTo) {
            updatedFields.assigned_to_name = this.ticket.assignedTo;
          }
          if (this.ticket.category !== this.initialTicketDetails.category) {
            updatedFields.category_name = this.ticket.category;
          }
          if (this.ticket.permission_required !== this.initialTicketDetails.permission_required) {
            updatedFields.permission_required = this.ticket.permission_required;
          }
          if (this.ticket.requester_position !== this.initialTicketDetails.requester_position) {
            updatedFields.requester_position = this.ticket.requester_position;
          }
          if (this.ticket.employment_type !== this.initialTicketDetails.employment_type) {
            updatedFields.employment_type = this.ticket.employment_type;
          }

          // Send only the updated fields to the backend API
          const response = await fetch(`/api/tickets/${this.ticket.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedFields)
          });

          if (response.ok) {
            // Update successful, refresh the ticket data
            this.fetchTicketDetails();
            this.initialTicketDetails = { ...this.ticketDetails }; // Update the initial ticket details
            this.responseMessage = ''; // Clear the comment input

          } else {
            // Handle error case
            console.error('Failed to update ticket:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating ticket:', error);
        }
      }
      this.isEditing = !this.isEditing;
    },

    getAttachmentUrl(attachment) {
      if (!attachment || !attachment.data) {
        console.error('Attachment data is missing or incomplete');
        return '';
      }

      try {
        const byteCharacters = atob(attachment.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const fileBlob = new Blob([byteArray], { type: attachment.type });

        // Check if the file type is supported for rendering
        const supportedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (supportedTypes.includes(attachment.type)) {
          // Render the file
          return URL.createObjectURL(fileBlob);
        } else {
          // Provide a download URL for unsupported file types
          return URL.createObjectURL(fileBlob);
        }
      } catch (error) {
        console.error('Error processing attachment data:', error);
        return '';
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      if (file && file.size <= maxSize) {
        this.selectedFile = file;
        this.fileUploaded = true;
      } else {
        alert('Please select a file with a size less than or equal to 5MB.');
        this.selectedFile = null;
        this.fileUploaded = false;
      }
    },

    async submitResponse() {
      if (this.responseMessage.trim() !== '' || this.selectedFile) {
        const formData = new FormData();
        formData.append('userId', this.userId);
        formData.append('comment', this.responseMessage);
        if (this.selectedFile) {
          formData.append('attachment', this.selectedFile);
          formData.append('attachmentType', this.selectedFile.type);
        }

        try {
          console.log('Adding comment:', formData);
          const response = await fetch(`/api/tickets/${this.ticket.id}/comment`, {
            method: 'POST',
            headers: {
              'Authorization': `${localStorage.getItem('token')}`
            },
            body: formData
          });
          console.log('Retrieved userId:', this.userId);

          if (response.ok) {
            // Comment added successfully, refresh comments
            this.fetchTicketDetails();
            this.responseMessage = '';
            this.selectedFile = null;
            this.fileUploaded = false;
          } else {
            console.error('Failed to add comment');
          }
        } catch (error) {
          console.error('Error adding comment:', error);
        }
      }
    },

    async fetchTicketDetails() {
      try {
        const response = await fetch(`/api/tickets/${this.ticket.id}/details`, {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`
          }
        });
        console.log('Retrieved ticket details:', response);
        const data = await response.json();
        this.ticketDetails = data.ticket;
        this.initialTicketDetails = { ...data.ticket }; // Update the initial ticket details
        this.ticketEvents = data.events;
        console.log('ticketEvents:', this.ticketEvents);



      } catch (error) {
        console.error('Failed to fetch ticket details:', error);
      }
    },

    handleBeforeUnload(event) {
      if (this.isEditing) {
        event.preventDefault();
        event.returnValue = '';
      }
    },

  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },

  beforeRouteLeave(to, from, next) {
    if (this.isEditing) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirmLeave) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
}
</script>


<template>
  <div class="extended_container">
    <div class="alltickets_item_upperrow">
      <div class = "header_edit_style">
        <h3 id="extended_subject_item">{{ ticket.title}}</h3>
        <button v-if="!isArchive && ticket.closedOn === '' && usersRole()" class="edit-button" @click="toggleEditing">
          {{ isEditing ? 'Save' : 'Edit' }}
        </button>
      </div>
      <button class="X" @click.stop="$emit('closeExtendedView')"><img src="../assets/Plus.png" alt="X"></button>
    </div>

    <div class="extended-item">
      <div class="ticket-summary">

        <div class="ticket-info">
          <div class="ticket-row">
            <span class="label">Ticket ID:</span>
            <div class="content">#{{ ticket.id }}</div>
          </div>
          <div class="ticket-row">
            <span class="label">Created:</span>
            <div class="content">{{ ticket.createdOn }}</div>
          </div>
          <div class="ticket-row">
            <span class="label">Last Update:</span>
            <div class="content">{{ ticket.updatedOn }}</div>
          </div>
          <div class="ticket-row">
            <span class="label">Closed On:</span>
            <div class="content">{{ ticket.closedOn }}</div>
          </div>
          <div class="ticket-row">
            <span class="label">Priority:</span>
            <div v-if="isArchive || !isEditing" class="content">{{ ticket.priority }}</div>
            <select v-else v-model="ticket.priority">
              <option v-for="(label, value) in ticket_priority" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Status:</span>
            <div v-if="isArchive ||  !isEditing" class="content">{{ ticket.status }}</div>
            <select v-else v-model="ticket.status">
              <option v-for="(label, value) in ticket_status" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Project:</span>
            <div v-if="isArchive || !isEditing" class="content">{{ ticket.category }}</div>
            <select v-else v-model="ticket.category">
              <option v-for="(label, value) in required_category" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Permission Requested:</span>
            <div v-if="isArchive || !isEditing" class="content">{{ ticket.permission_required }}</div>
            <select v-else v-model="ticket.permission_required">
              <option v-for="(label, value) in permission_required" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Role:</span>
            <div v-if="isArchive || !isEditing" class="content">{{ ticket.requester_position}}</div>
            <select v-else v-model="ticket.requester_position">
              <option v-for="(label, value) in position" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Employment Status:</span>
            <div v-if="isArchive || !isEditing" class="content">{{ ticket.employment_type}}</div>
            <select v-else v-model="ticket.employment_type">
              <option v-for="(label, value) in employment_status" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
        </div>
        <div class="assignedto-detail">
          <span class="label">Assigned to:</span>
          <div v-if="isArchive || !isEditing" class="content">{{ ticket.assignedTo}}</div>
          <select v-else v-model="ticket.assignedTo">
            <option v-for="(label, value) in ticket_manager" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="requester-detail">
          <span class="label">Requester Detail:</span>
          <p>{{ ticket.requester}}</p>
        </div>
      </div>

      <div class="ticket-details">

        <div class="ticket-description">
          <p><span class="label"></span> {{ticketDetails.content }}</p>
          <span class="timestamp">{{ ticketDetails.created_at }}</span>
          <!-- Display or link the attachment -->
          <div v-if="ticket.attachment">
            <div v-if="['image/jpeg', 'image/png'].includes(ticket.attachment.type)">
              <img :src="getAttachmentUrl(ticket.attachment)" alt="Attachment" :width=300 :height=300>
            </div>
            <div v-else-if="ticket.attachment.type === 'application/pdf'">
              <embed :src="getAttachmentUrl(ticket.attachment)" type="application/pdf" style="width:300px; height:300px;">
            </div>
            <div v-else>
              <a :href="getAttachmentUrl(ticket.attachment)" :download="ticket.attachment.name">
                Download {{ ticket.attachment.name }}
              </a>
            </div>
          </div>
        </div>
        <div class="table-container">
          <div class="ticket-chat">
            <div v-for="comment in ticketComments" :key="comment.id" class="ticket-description">
              <p>
                  <span :class="{
                    'sender-name': comment.isSender,
                    'other-user-name': !comment.isSender,
                    'update-label': !(comment.f_name || comment.l_name)
                  }">
                    {{ (comment.f_name || comment.l_name) ? `${comment.f_name} ${comment.l_name}` :  `${comment.wbi_id} Updated` }}:
                  </span>
                            {{ comment.comment }}
              </p>
              <div v-if="comment.attachment" class="attachment">

              <a :href="getAttachmentUrl(comment.attachment)"
                   :download="comment.attachment.type.startsWith('image') || comment.attachment.type === 'application/pdf' ? '' : comment.attachment.name"
                   target="_blank" class="attachment-link">
                  <span class="attachment-name">{{ comment.attachment.name }}</span>
                  <div class="attachment-preview">
                    <img v-if="comment.attachment.type.startsWith('image/jpeg') || comment.attachment.type === 'image/png'" :src="getAttachmentUrl(comment.attachment)" alt="Attachment Preview" :width=300 :height=300>

                    <embed v-else-if="comment.attachment.type === 'application/pdf'" :src="getAttachmentUrl(comment.attachment)" type="application/pdf">
                    <!-- Add more conditions for other file types as needed -->
                    <div v-else class="unsupported-preview">
                      <p>Unsupported file type: {{ comment.attachment.type }}</p>
                    </div>
                  </div>
                </a>
              </div>

              <div class="comment-events">
                <div v-for="event in comment.events" :key="event.event_id">
                  <span class="event-label">{{ event.event_type}}:</span>
                  <span class="event-details">{{ getEventDetails(event) }}</span>
                </div>
              </div>
              <span class="timestamp">{{formatCreatedAt(comment.created_at) }}</span>
            </div>
          </div>
        </div>
        <div v-if="!isArchive && ticket.closedOn === ''" class="ticket-response">
          <span v-if="fileUploaded" class="file-uploaded-indicator">File uploaded</span>
          <textarea v-model="responseMessage" placeholder="Write your response for the issue"></textarea>
          <div class="button_extended_container">
            <label class="add_attachment">
              <input type="file" @change="handleFileUpload" accept=".jpg,.jpeg,.png,.pdf" style="display: none;">
              Attachment <img class="paperclip" src="../assets/Paperclip.png" alt="add attachments">
            </label>

            <button class="add_comment" @click="submitResponse">Comment</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@import '../styles/main.sass'
.sender-name
  font-weight: bold
  color: green


.other-user-name
  font-weight: normal
  color: blue

.update-label
  font-weight: bold
  color: red



</style>