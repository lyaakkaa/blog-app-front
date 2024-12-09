<template>
  <div>
    <Header :toggleMenu="toggleMenu" />
    <div class="profile-container">
      <h1 v-if="user">{{ user.person_name }}'s Profile</h1>
      <h1 v-else>Loading Profile...</h1>

      <div v-if="user" class="user-info">
        <img
          :src="
            user.avatar
              ? user.avatar
              : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          "
          alt="User Avatar"
          class="user-avatar"
        />
        <div class="user-details">
          <h2>{{ user.person_name }}</h2>
          <p class="user-username">@{{ user.login }}</p>
          <p class="user-field">
            Age: <span>{{ user.age || "Not provided" }}</span>
          </p>
          <p class="user-field">
            Location: <span>{{ user.location || "Not provided" }}</span>
          </p>
          <p class="user-field">
            Last Activity:
            <span>{{
              user.activity
                ? new Date(user.activity).toLocaleString()
                : "Not provided"
            }}</span>
          </p>
          <button @click="toggleFollow" class="follow-button">
            {{ isFollowing ? "Unfollow" : "Follow" }}
          </button>
          <router-link :to="`/users/${user.id}/friends`">
            <button class="friends-button">Friends</button>
          </router-link>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
        
      </div>

      <div class="user-posts" v-if="user">
        <h2>{{ user.person_name }}'s Posts</h2>
        <div v-if="posts.length" class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-item">
            <div class="post-header">
              <h3>{{ post.commentary }}</h3>
              <p class="post-date">{{ formattedDate(post.pub_date) }}</p>
            </div>
            <p class="post-content">Topic: {{ post.topic.name }}</p>
            <p class="post-rating">Rating: {{ post.rating }} ⭐</p>
            <p class="post-likes">Likes: {{ post.like_count }} ❤️</p>
          </div>
        </div>
        <p v-else class="no-posts">No posts available.</p>
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
      user: null,
      posts: [],
      isFollowing: false,
      errorMessage: "",
    };
  },
  async mounted() {
    await this.fetchUserData();
    await this.fetchIsFollowing();
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    async fetchUserData() {
      const userId = this.$route.params.id;
      const loggedInUserId = localStorage.getItem("userId");

      try {
        const userResponse = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}`
        );
        const userData = await userResponse.json();

        if (userResponse.ok) {
          // Fetch custom name if the user is a friend
          const nameResponse = await fetch(
            `http://127.0.0.1:8000/api/users/${loggedInUserId}/friends`
          );
          const nameData = await nameResponse.json();

          if (nameResponse.ok) {
            const friend = nameData.find(
              (friend) => friend.friend.id === parseInt(userId)
            );
            if (friend && friend.friend_name) {
              userData.person_name = friend.friend_name; // Use the custom name if available
            }
          }

          this.user = userData;
        } else {
          this.errorMessage =
            userData.error || "Failed to load user information.";
        }

        const postsResponse = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/posts`
        );
        const postsData = await postsResponse.json();
        if (postsResponse.ok) {
          this.posts = postsData;
        } else {
          this.errorMessage = postsData.error || "Failed to load user posts.";
        }
      } catch (error) {
        this.errorMessage = "Error loading profile data. Please try again.";
      }
    },

    formattedDate(dateString) {
      if (!dateString) return "Invalid date";

      const options = { year: "numeric", month: "long", day: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-EN", options);
    },

    async toggleFollow() {
      const loggedInUserId = localStorage.getItem("userId");
      const favoriteUserId = this.$route.params.id;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${loggedInUserId}/toggle_favorite/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ favorite_user_id: favoriteUserId }),
          }
        );

        if (response.ok) {
          this.isFollowing = !this.isFollowing;
        } else {
          const errorData = await response.json();
          this.errorMessage =
            errorData.error || "Failed to toggle follow status.";
        }
      } catch (error) {
        this.errorMessage =
          "Error following/unfollowing user. Please try again.";
      }
    },
    async fetchIsFollowing() {
      const userId = this.$route.params.id;
      const loggedInUserId = localStorage.getItem("userId");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/is_favorite/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              logged_in_user_id: loggedInUserId,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          this.isFollowing = data.is_following;
        } else {
          this.errorMessage = data.error || "Failed to check follow status.";
        }
      } catch (error) {
        this.errorMessage = "Error checking follow status. Please try again.";
      }
    },
  },
  watch: {
    "$route.params.id": "fetchUserData",
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 28px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f4f8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
}

.user-avatar {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.user-details h2 {
  font-size: 22px;
  color: #333;
  margin: 0;
}

.user-username {
  color: #666;
  font-size: 16px;
  margin-top: 5px;
}

.follow-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.follow-button:hover {
  background-color: #357abd;
}

.user-posts {
  text-align: left;
}

.user-posts h2 {
  color: #333;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 22px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-item {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.post-header h3 {
  color: #333;
  font-size: 18px;
  margin: 0;
}

.post-date {
  font-size: 12px;
  color: #999;
}

.post-content {
  font-size: 16px;
  color: #555;
  margin: 8px 0;
}

.post-rating,
.post-likes {
  font-size: 14px;
  color: #555;
}

.error-message {
  color: #d32f2f;
  margin-top: 20px;
  font-size: 14px;
}

.user-field {
  margin: 5px 0;
  font-size: 16px;
  color: #444;
}

.user-field span {
  font-weight: bold;
  color: #333;
}

.friends-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;
}

.friends-button:hover {
  background-color: #16a085;
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
    max-width: 90%;
  }

  h1 {
    font-size: 24px;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
  }

  .user-details h2 {
    font-size: 18px;
  }

  .user-field {
    font-size: 14px;
  }

  .follow-button,
  .friends-button {
    font-size: 14px;
    padding: 8px 16px;
  }

  .user-posts h2 {
    font-size: 18px;
  }

  .post-header h3 {
    font-size: 16px;
  }

  .post-content,
  .post-rating,
  .post-likes {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 10px;
  }

  h1 {
    font-size: 20px;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
  }

  .user-details h2 {
    font-size: 16px;
  }

  .user-field {
    font-size: 12px;
  }

  .follow-button,
  .friends-button {
    font-size: 12px;
    padding: 6px 12px;
  }

  .user-posts h2 {
    font-size: 16px;
  }

  .post-header h3 {
    font-size: 14px;
  }

  .post-content,
  .post-rating,
  .post-likes {
    font-size: 12px;
  }
}
</style>
