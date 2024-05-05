<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import a from "./new_ticket.vue";
import { io } from 'socket.io-client';
import axios from "axios";

const fullName = ref('');
const wbi = ref('');
const router = useRouter();
const hasUnreadNotifications = ref(false);
const searchTerm = ref('');
const emit = defineEmits(['search', 'user-info']);

onMounted(() => {
  // Retrieve the user's full name and WBI from local storage or API
  fullName.value = localStorage.getItem('fullName') || '';
  wbi.value = localStorage.getItem('wbi') || '';
  fetchUnreadNotifications();

  // Emit the user information when the component is mounted
  emitUserInfo();

  // Connect to WebSocket server
  const socket = io('http://localhost:3000');

  // Emit the user ID to associate the socket with the user
  socket.emit('setUserId', localStorage.getItem('uId'));

  // Listen for new notification event
  socket.on('new-notification', () => {
    fetchUnreadNotifications();
  });

});

const logout = () => {
  // Clear the user information from local storage
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('fullName');
  localStorage.removeItem('wbi');
  localStorage.removeItem('uId');
  localStorage.removeItem('employment_name');
  // Redirect to the login page
  router.push('/login');
};

const searchTickets = () => {
  emit('search', searchTerm.value);
};

const emitUserInfo = () => {
  const userId = localStorage.getItem('uId');
  emit('user-info', userId);
};

const unreadNotifications = ref(0);

const fetchUnreadNotifications = async () => {

  try {
    const response = await axios.get(`/api/notifications/unread/${parseInt(localStorage.getItem('uId'), 10)}`, {
    headers: {
      'Authorization': `${localStorage.getItem('token')}`
    }
  });
    unreadNotifications.value = response.data.count;
    console.log('Unread notifications:', unreadNotifications.value);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
  }
};
const markNotificationsAsRead = async () => {
  try {
    await axios.put(`/api/notifications/read/${parseInt(localStorage.getItem('uId'), 10)}`, null, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    unreadNotifications.value = 0;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
};
</script>


<template>

  <div class="navbar-container">
    <nav class="nav_">
      <div id="nav-left">
        <a href="#" title="Home page"> <img class="nav-logo" src="../assets/nxp__logo.svg.png" alt="firm logo"> </a>
      </div>
      <ul id="nav_items">
        <li>
          <a href="/tickets" title="Tickets" class="tickets_tab" @click="markNotificationsAsRead">
            Tickets
            <span v-if="unreadNotifications > 0" class="notification-count">{{ unreadNotifications }}</span>
          </a>
        </li>
        <li><a href="/archive" title="Archive" class="archive_tab">Archive </a></li>
        <li><div class="search-container">
          <input type="text" placeholder="Search..." name="search" v-model="searchTerm">
          <button type="submit" @click="searchTickets"><img src="../assets/searchbtn.png" alt="searchicon"></button>        </div></li>
        <li class="user_picture"> <img src = "../assets/derp.png" alt="profile_pic"> </li>
        <li class="user-info">
          <div>{{ fullName }}</div>
          <div class="wbi">@{{ wbi }}</div>
        </li>
        <li><a @click="logout" title="Logout" class="logout-btn"><img src="../assets/logout.png" alt="logoutbtn"></a></li>
      </ul>
    </nav>
  </div>
</template>


<style lang="sass">
  @import '../styles/main.sass'



</style>