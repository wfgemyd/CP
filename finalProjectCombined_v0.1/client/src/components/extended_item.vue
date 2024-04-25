<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  ticket: Object,
  isArchive: {
    type: Boolean,
    default: false
  }
});

const ticketDetails = ref({});
const ticketComments = ref([]);
const ticketEvents = ref([]);

onMounted(async () => {
  try {
    const response = await fetch(`/api/tickets/${props.ticket.id}/details`, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    ticketDetails.value = data.ticket;
    ticketComments.value = data.comments;
    ticketEvents.value = data.events;
  } catch (error) {
    console.error('Failed to fetch ticket details:', error);
  }
});

const ticket_priority = { low: "low", medium: "medium", high: "high", urgent: "urgent" };
const ticket_status = { open: "open", verifying: "verifying", rejected: "rejected", closed: "closed" };
const required_category = { gendalf: "gendalf", banana: "banana", coolchip: "coolchip" };
const ticket_manager = { manager1: "Manager", manager2: "manager2", manager3: "manager3" };
const employment_status = { contractor: "contractor", fullTime: "full-time", partTime: "part-time", intern: "intern" };
const permission_required = { read: "read", write: "write" };
const user_role = { designer: "designer", developer: "developer", manager: "Manager", tester: "tester" };
const attachment = { none: null };
</script>

<script>
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

    }
  },
  methods: {
    toggleEditing() {
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
    }

    ,

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
        const data = await response.json();
        this.ticketDetails = data.ticket;
        this.ticketComments = data.comments;
        this.ticketEvents = data.events;

        console.log('Ticket details:', this.ticketDetails);
        console.log('Ticket comments:', this.ticketComments);
        console.log('Ticket events:', this.ticketEvents);

      } catch (error) {
        console.error('Failed to fetch ticket details:', error);
      }
    }
  }
}
</script>


<template>
  <div class="extended_container">
    <div class="alltickets_item_upperrow">
      <div class = "header_edit_style">
        <h3 id="extended_subject_item">{{ ticket.title || 'Placeholder Title' }}</h3>
        <button v-if="!isArchive && ticket.status !== 'Closed'" class="edit-button" @click="toggleEditing">
          <img src='../assets/NotePencil.png' alt="Edit & save">
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
            <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.priority }}</div>
            <select v-else v-model="ticket.priority">
              <option v-for="(label, value) in ticket_priority" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Status:</span>
            <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.status }}</div>
            <select v-else v-model="ticket.status">
              <option v-for="(label, value) in ticket_status" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Project:</span>
            <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.project }}</div>
            <select v-else v-model="ticket.project">
              <option v-for="(label, value) in required_category" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Role:</span>
            <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.role}}</div>
            <select v-else v-model="ticket.role">
              <option v-for="(label, value) in user_role" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Employment Status:</span>
            <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.employmentStatus}}</div>
            <select v-else v-model="ticket.employmentStatus">
              <option v-for="(label, value) in employment_status" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
        </div>
        <div class="assignedto-detail">
          <span class="label">Assigned to:</span>
          <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.assignedTo}}</div>
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
        </div>
        <div class="table-container">
          <div class="ticket-chat">
            <div v-for="comment in ticketComments" :key="comment.id" class="chat-message">
              <p>{{ comment.comment }}</p>
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


              <span class="timestamp">{{ comment.created_at }}</span>
            </div>
          </div>
        </div>
        <div v-if="!isArchive && ticket.status !== 'Closed'" class="ticket-response">
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


</style>