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
  <div class="extended-item">
    <button class="X" @click.stop="$emit('closeExtendedView')"><img src="../assets/Plus.png" alt="X"></button>
    <div class="ticket-summary">
      <h3>{{ ticket.subject || 'Placeholder Title' }}</h3>
      <div class="ticket-info">
        <p><span class="label">Ticket ID:</span> {{ ticket.id }}</p>
        <p><span class="label">Created:</span> {{ ticket.createdOn }}</p>
        <p><span class="label">Last Update:</span> {{ ticket.updatedOn }}</p>
        <p><span class="label">Closed On:</span> {{ ticket.closedOn }}</p>
        <p><span class="label">Priority:</span> {{ ticket.priority }}</p>
        <p><span class="label">Status:</span> {{ ticket.status }}</p>
        <p><span class="label">Project:</span> {{ ticket.project }}</p>
        <p><span class="label">Assigned to:</span> {{ ticket.assignedTo }}</p>
      </div>
    </div>

    <div class="ticket-details">
      <div class="requester-detail">
        <p><span class="label">Requester Detail:</span> {{ ticket.requester }}</p>
      </div>
      <div class="ticket-description">
        <p><span class="label">Description:</span> {{ ticket.description || 'Placeholder Description' }}</p>
      </div>
      <div class="ticket-chat">
        <div v-for="message in chatMessages" :key="message.id" class="chat-message" :class="{ 'sender': message.isSender, 'receiver': !message.isSender }">
          <p>{{ message.content }}</p>
          <span class="timestamp">{{ message.timestamp }}</span>
        </div>
      </div>
      <div class="ticket-response">
        <textarea v-model="responseMessage" placeholder="Write your response for the issue"></textarea>
        <button @click="submitResponse">Send</button>
      </div>
    </div>

  </div>
</template>

<style scoped lang="sass">
@import '../styles/main.sass'

</style>