<script setup>
import { ref } from 'vue';


const props = defineProps({
  ticket: Object,
  isArchive: {
    type: Boolean,
    default: false
  }
});
const ticket_priority = { low: "low", medium: "medium", high: "high", urgent: "urgent", none: "none"};
const ticket_status = { open: "open", verifying: "verifying", rejected: "rejected", closed: "closed" };
const required_category = { gendalf: "gendalf", banana: "banana", coolchip: "coolchip" };
const ticket_manager = { manager1: "Manager", manager2: "manager2", manager3: "manager3" };
const employment_status = { contractor: "contractor", fullTime: "full-time", partTime: "part-time", intern: "intern" };
const permission_required = { read: "read", write: "write", none: "none" };
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
      chatMessages: [
        { id: 1, content: "We are checking if the slot is open", isSender: false, timestamp: "Today, 11:15 PM" },
        { id: 2, content: "Okay, keep me updated", isSender: true, timestamp: "Today, 11:30 PM" },
        { id: 3, content: "need access to gandalf", isSender: true, timestamp: "Today, 11:35 PM" }
      ],
      responseMessage: ''
    }
  },
  methods: {
    toggleEditing() {
      this.isEditing = !this.isEditing;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const maxSize = 25 * 1024 * 1024; // 25MB in bytes

      if (file && file.size <= maxSize) {
        this.selectedFile = file;
        this.fileUploaded = true; // Set fileUploaded to true when a file is selected
      } else {
        alert('Please select a file with a size less than or equal to 25MB.');
        this.selectedFile = null;
        this.fileUploaded = false; // Set fileUploaded to false if no file is selected or size exceeds limit
      }
    },
    async submitResponse() {
      if (this.responseMessage.trim() !== '' || this.selectedFile) {
        const newMessage = {
          id: this.chatMessages.length + 1,
          content: this.responseMessage,
          isSender: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachment: this.selectedFile ? {
            name: this.selectedFile.name,
            type: this.selectedFile.type,
            url: URL.createObjectURL(this.selectedFile)
          } : null
        };
        this.chatMessages.push(newMessage);
        this.responseMessage = '';
        this.selectedFile = null;
        this.fileUploaded = false;
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
            <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.role || "Developer" }}</div>
            <select v-else v-model="ticket.role">
              <option v-for="(label, value) in user_role" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="ticket-row">
            <span class="label">Employment Status:</span>
            <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.employmentStatus || "Contractor" }}</div>
            <select v-else v-model="ticket.employmentStatus">
              <option v-for="(label, value) in employment_status" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          </div>
        <div class="assignedto-detail">
          <span class="label">Assigned to:</span>
          <div v-if="isArchive || ticket.status === 'Closed' || !isEditing" class="content">{{ ticket.assignedTo || "Super Manager Patron" }}</div>
          <select v-else v-model="ticket.assignedTo">
            <option v-for="(label, value) in ticket_manager" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>

        <div class="requester-detail">
          <span class="label">Requester Detail:</span>
          <p>{{ ticket.requester || "Don Patron" }}</p>
        </div>
      </div>

    <div class="ticket-details">

      <div class="ticket-description">
        <p><span class="label"></span> {{ ticket.description || 'n common usage, randomness is the apparent or actual lack of definite pattern or predictability in information.[1][2] A random sequence of events, symbols or steps often has no order and does not follow an intelligible pattern or combination. Individual random events are, by definition, unpredictable, but if there is a known probability distribution, the frequency of different outcomes over repeated events (or "trials") is predictable.[note 1] For example, when throwing two dice, the outcome of any particular roll is unpredictable, but a sum of 7 will tend to occur twice as often as 4. In this view, randomness is not haphazardness; it is a measure of uncertainty of an outcome.' }}</p>
        <span class="timestamp">{{ ticket.createdOn }}</span>
      </div>
      <div class="table-container">
      <div class="ticket-chat">
        <div v-for="message in chatMessages" :key="message.id" class="chat-message" :class="{ 'sender': message.isSender, 'receiver': !message.isSender }">
          <p>{{ message.content }}</p>
          <div v-if="message.attachment" class="attachment">
            <a :href="message.attachment.url" target="_blank" class="attachment-link">
              <span class="attachment-name">{{ message.attachment.name }}</span>
              <div class="attachment-preview">
                <img v-if="message.attachment.type.startsWith('image')" :src="message.attachment.url" alt="Attachment Preview">
                <embed v-else-if="message.attachment.type === 'application/pdf'" :src="message.attachment.url" type="application/pdf">
                <video v-else-if="message.attachment.type.startsWith('video')" :src="message.attachment.url" controls></video>
                <iframe v-else-if="message.attachment.type === 'text/html'" :src="message.attachment.url"></iframe>
                <pre v-else-if="message.attachment.type.startsWith('text/')" class="text-preview">{{ message.attachment.content }}</pre>
                <div v-else class="unsupported-preview">
                  <p>Unsupported file type: {{ message.attachment.type }}</p>
                </div>
              </div>
            </a>
          </div>
          <span class="timestamp">{{ message.timestamp }}</span>
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