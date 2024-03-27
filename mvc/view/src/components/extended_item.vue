<script setup>
import { ref } from 'vue';

const props = defineProps({
  ticket: Object
});

const chatMessages = ref([
  { id: 1, content: "We are checking if the slot is open", isSender: false, timestamp: "Today, 11:15 PM" },
  { id: 2, content: "Okay, keep me updated", isSender: true, timestamp: "Today, 11:30 PM" },
  { id: 3, content: "need access to gandalf", isSender: true, timestamp: "Today, 11:35 PM" }
]); // This will be populated with chat messages fetched from the database

const responseMessage = ref(''); // This will hold the response message

function submitResponse() {
  if (responseMessage.value.trim() !== '') {
    // Here you would typically send the responseMessage to your backend server
    // For demonstration purposes, we'll just add it to the chatMessages array
    const newMessage = {
      id: chatMessages.value.length + 1,
      content: responseMessage.value,
      isSender: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    chatMessages.value.push(newMessage);
    responseMessage.value = ''; // Clear the input field after sending the message
  }
}
</script>

<template>
  <div class="extended_container">
    <div class ="alltickets_item_upperrow">
      <h3 id="extended_subject_item">{{ ticket.subject || 'Placeholder Title' }}</h3>
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
            <div class="content">{{ ticket.priority }}</div>
          </div>
          <div class="ticket-row">
            <span class="label">Status:</span>
            <div class="content">{{ ticket.status }}</div>
          </div>
          <div class="ticket-row">
            <span class="label">Project:</span>
            <div class="content">{{ ticket.project }}</div>
          </div>
        </div>
        <div class="assignedto-detail">
          <span class="label">Assigned to:</span>
          <p>{{ ticket.assignedTo || "Super Manager Patron" }}</p>
        </div>
        <div class="requester-detail">
          <span class="label">Requester Detail:</span>
          <p>{{ ticket.requester || "Don Patron" }}</p>
        </div>
      </div>

    <div class="ticket-details">

      <div class="ticket-description">
        <p><span class="label"></span> {{ ticket.description || 'Placeholder Description' }}</p>
        <span class="timestamp">{{ ticket.createdOn }}</span>
      </div>
      <div class="ticket-chat">
        <div v-for="message in chatMessages" :key="message.id" class="chat-message" :class="{ 'sender': message.isSender, 'receiver': !message.isSender }">
          <p>{{ message.content }}</p>
          <span class="timestamp">{{ message.timestamp }}</span>
        </div>
      </div>
      <div class="ticket-response">
        <textarea v-model="responseMessage" placeholder="Write your response for the issue"></textarea>
        <div class="button_extended_container">
          <button class="add_attachment"> Attachment <img class="paperclip" src = "../assets/Paperclip.png" alt="add attachments"> </button>

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