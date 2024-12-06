<template>
  <div>
    <Header :toggleMenu="toggleMenu" />
    <div class="favorites-container">
      <h1>Your Favorite Users</h1>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <div v-if="favoriteUsers.length">
          <div
            v-for="user in favoriteUsers"
            :key="user.id"
            class="favorite-user-card"
          >
            <img
              :src="user.avatar || '_nuxt/src/assets/no_pfp.svg'"
              alt="User Avatar"
              class="user-avatar"
            />
            <div class="user-info">
              <h2>{{ user.person_name }}</h2>
              <p class="user-email">{{ user.email }}</p>
              <p class="user-login">Username: {{ user.login }}</p>
            </div>
            <button @click="removeFromFavorites(user.id)" class="delete-button">Remove</button>
          </div>
        </div>
        <p v-else class="no-favorites-message">No favorite users found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "~/components/Header.vue";

export default {
  components: { Header },
  data() {
    return {
      favoriteUsers: [], // To store favorite users' data
      loading: true, // Loading indicator
    };
  },
  async created() {
    await this.fetchFavoriteUsers();
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    async fetchFavoriteUsers() {
      try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage.");
        }

        // Fetch the user's data
        const userResponse = await axios.get(
          `http://127.0.0.1:8000/api/users/${userId}`
        );
        const userData = userResponse.data;

        // Fetch data for each favorite user based on IDs in favorite_users
        const favoriteUserPromises = userData.favorite_users.map(
          (favoriteUserId) =>
            axios.get(`http://127.0.0.1:8000/api/users/${favoriteUserId}`)
        );
        const favoriteUsersResponses = await Promise.all(favoriteUserPromises);

        // Store favorite users' data in the component's data
        this.favoriteUsers = favoriteUsersResponses.map(
          (response) => response.data
        );
      } catch (error) {
        console.error("Error fetching favorite users:", error);
      } finally {
        this.loading = false;
      }
    },
    async removeFromFavorites(favoriteUserId) {
      try {
        // Get the user ID from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage.");
        }

        // Send a POST request to toggle the favorite status
        await axios.post(`http://127.0.0.1:8000/api/users/${userId}/toggle_favorite/`, {
          favorite_user_id: favoriteUserId,
        });

        // Remove the user from the local favoriteUsers array
        this.favoriteUsers = this.favoriteUsers.filter(user => user.id !== favoriteUserId);
      } catch (error) {
        console.error("Error removing user from favorites:", error);
      }
    },
  },
};
</script>

<style scoped>
.favorites-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.loading {
  font-size: 18px;
  color: #666;
}

.no-favorites-message {
  font-size: 16px;
  color: #999;
  margin-top: 20px;
}

.favorite-user-card {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
}

.favorite-user-card:hover {
  transform: translateY(-3px);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid #4caf50;
}

.user-info {
  text-align: left;
  flex-grow: 1;
}

.user-info h2 {
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.user-email {
  font-size: 14px;
  color: #555;
  margin: 4px 0;
}

.user-login {
  font-size: 13px;
  color: #777;
}

/* Style for the delete button */
.delete-button {
  background-color: #e57373;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>
