<template>
  <div class="tracker">
    <div class="title">
      <h1>Tracker Search Results (7 Items)</h1>
      <div class="buttons">
        <button class="btn">New Search</button>
        <button class="btn">Refine Search</button>
        <button class="btn export">Export</button>
      </div>
    </div>
    <div class="controls">
      <button class="btn" @click="toggleMenu('addColumn')">Add Column</button>
      <button class="btn" @click="toggleMenu('removeColumn')">Remove Column</button>
      <select class="btn">
        <option>Rows</option>
        <option value="10">10 Rows</option>
        <option value="20">20 Rows</option>
        <option value="30">30 Rows</option>
      </select>
    </div>

    <table :class="{ 'table-lower': showMenu }">
      <thead>
      <tr>
        <th><input type="checkbox"></th>
        <th>PRIORITY</th>
        <th>ARTIFACT ID : TITLE</th>
        <th>ASSIGNED TO</th>
        <th>CREATED BY</th>
        <th>STATUS</th>
        <th>EMPLOYMENT STATUS</th>
        <th>CATEGORY</th>
        <th>LAST MODIFIED</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td><input type="checkbox"></td>
        <td>HIGHEST</td>
        <td>artf161361 : please give access to Blabla database</td>
        <td>Name of Manager</td>
        <td>Name of user</td>
        <td>Closed</td>
        <td>Employee</td>
        <td>Very good project</td>
        <td>02/09/2022</td>
      </tr>
      <!-- Repeat the <tr>...</tr> for more entries -->
      </tbody>
    </table>
    <div v-if="showMenu" class="menu">
      <div v-if="activeButton === 'addColumn'">
        <!-- Content for 'Add Column' goes here -->
      </div>
      <div v-if="activeButton === 'removeColumn'">
        <!-- Content for 'Remove Column' goes here -->
      </div>
    </div>
    <p>showMenu: {{ showMenu }}</p>
    <p>activeButton: {{ activeButton }}</p>
  </div>
</template>

<script>
export default {
  name: 'TrackerComponent',
  data() {
    return {
      showMenu: false,
      activeButton: null,
      columns: [
        { name: 'PRIORITY', visible: true },
        { name: 'ARTIFACT ID : TITLE', visible: true },
        { name: 'ASSIGNED TO', visible: true },
        { name: 'CREATED BY', visible: true },
        { name: 'STATUS', visible: true },
        { name: 'EMPLOYMENT STATUS', visible: true },
        { name: 'CATEGORY', visible: true },
        { name: 'LAST MODIFIED', visible: true },
        // Add more columns as needed
      ],
    };
  },
  methods: {
    toggleMenu(button) {
      this.showMenu = !this.showMenu;
      this.activeButton = button;
    },
    // Add more methods as needed
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Alef:wght@700&family=Sarabun:wght@400&display=swap');

.tracker {
  font-family: 'Sarabun', sans-serif;
  background: #f3f3f3;
  padding: 1rem;
  border-radius: 8px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title h1 {
  font-family: 'Alef', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.buttons,
.controls {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  cursor: pointer;
  border-radius: 8px;
  width: auto; /* Adjust this value as needed */
  display: inline-block;
}
.table-lower {
  margin-top: 5rem; /* Adjust this value as needed */
}

.btn.export {
  background-color: #dddddd;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  border-radius: 8px; /* Add this line */
}

thead {
  background-color: #eeeeee;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border: 1px solid #cccccc;
}

th:first-child, td:first-child {
  text-align: center;
}

input[type="checkbox"] {
  margin: 0;
}

/* You may want to add more styles to match the screenshot more closely */
</style>