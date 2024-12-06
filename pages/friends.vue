<template>
  <div>
    <Header :toggleMenu="toggleMenu" />
    <div class="friends-container">
      <div class="friends-header">
        <h1>Your Friends</h1>
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div v-else>
        <div v-if="friends.length" class="friends-list">
          <div
            v-for="friend in friends"
            :key="friend.friend.id"
            class="friend-card"
          >
            <img
              :src="friend.friend.avatar ? friend.friend.avatar : defaultAvatar"
              alt="Friend Avatar"
              class="friend-avatar"
            />
            <div class="friend-details">
              <h2>{{ friend.friend_name || friend.friend.person_name }}</h2>
              <p>
                <strong>Email:</strong>
                {{ friend.friend.email || "Not provided" }}
              </p>
              <p>
                <strong>Last Activity:</strong>
                {{
                  friend.friend.activity
                    ? new Date(friend.friend.activity).toLocaleString()
                    : "Not provided"
                }}
              </p>
            </div>
            <div class="friend-actions">
              <button
                @click="unfollow(friend.friend.id)"
                class="unfollow-button"
              >
                Unfollow
              </button>
              <button @click="rename(friend.friend.id)" class="rename-button">
                Rename
              </button>
              <button @click="resetName(friend.friend.id)" class="reset-button">
                Reset Name
              </button>
              <router-link :to="`/chat/${friend.friend.id}`">
                <button class="chat-button">Chat</button>
              </router-link>
            </div>
          </div>
        </div>
        <p v-else class="no-friends">You have no friends yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "~/components/Header.vue";

export default {
  components: {
    Header,
  },
  data() {
    return {
      friends: [],
      errorMessage: "",
      defaultAvatar:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    };
  },
  async mounted() {
    await this.fetchFriends();
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    async fetchFriends() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        this.errorMessage = "User not found.";
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/friends`
        );
        const friendsData = await response.json();

        if (response.ok) {
          this.friends = friendsData;
        } else {
          this.errorMessage = friendsData.error || "Failed to load friends.";
        }
      } catch (error) {
        this.errorMessage = "Error loading friends. Please try again.";
      }
    },
    async unfollow(friendId) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User not found.");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/toggle_favorite/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ favorite_user_id: friendId }),
          }
        );

        if (response.ok) {
          await this.fetchFriends();
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to unfollow friend.");
        }
      } catch (error) {
        alert("Error unfollowing friend. Please try again.");
      }
    },
    async rename(friendId) {
      const newName = prompt("Enter the new name for your friend:");
      if (!newName) return;

      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User not found.");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/set_friend_name/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ friend_id: friendId, friend_name: newName }),
          }
        );

        if (response.ok) {
          await this.fetchFriends(); // Refresh the friends list to show the updated name
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to rename friend.");
        }
      } catch (error) {
        alert("Error renaming friend. Please try again.");
      }
    },
    async resetName(friendId) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User not found.");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/set_friend_name/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ friend_id: friendId, friend_name: "" }), 
          }
        );

        if (response.ok) {
          await this.fetchFriends(); 
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to reset friend's name.");
        }
      } catch (error) {
        alert("Error resetting friend's name. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.friends-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.friends-header h1 {
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.error-message {
  color: #e74c3c;
  font-size: 16px;
  margin-top: 10px;
}

.no-friends {
  color: #555;
  font-size: 16px;
  margin-top: 20px;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.friend-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.friend-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.friend-details {
  flex-grow: 1;
  padding-left: 15px;
  text-align: left;
  min-width: 150px;
}

.friend-details h2 {
  font-size: 18px;
  color: #333;
  margin: 0 0 5px;
}

.friend-details p {
  font-size: 14px;
  color: #555;
  margin: 3px 0;
}

.friend-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.friend-actions button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}

.unfollow-button {
  background-color: #e74c3c;
  color: white;
}

.rename-button {
  background-color: #f39c12;
  color: white;
}

.chat-button {
  background-color: #3498db;
  color: white;
}

.reset-button {
  background-color: #f39c12;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}

/* Адаптивность */
@media (max-width: 768px) {
  .friends-container {
    padding: 15px;
    max-width: 90%;
  }

  .friend-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .friend-details {
    padding: 10px 0;
  }

  .friend-avatar {
    width: 60px;
    height: 60px;
  }

  .friend-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .friends-header h1 {
    font-size: 20px;
  }

  .friend-card {
    padding: 10px;
  }

  .friend-avatar {
    width: 50px;
    height: 50px;
  }

  .friend-details h2 {
    font-size: 16px;
  }

  .friend-details p {
    font-size: 12px;
  }

  .friend-actions button {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
