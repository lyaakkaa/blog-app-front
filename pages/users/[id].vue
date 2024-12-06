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
        </div>
      </div>

      <div class="user-posts" v-if="user">
        <h2>{{ user.person_name }}'s Posts</h2>
        <div v-if="posts.length" class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-item">
            <div class="post-header">
              <h3>{{ post.commentary }}</h3>
              <p class="post-date">{{ post.pub_date }}</p>
            </div>
            <p class="post-content">Topic: {{ post.topic.name }}</p>
            <p class="post-rating">Rating: {{ post.rating }} ⭐</p>
            <p class="post-likes">Likes: {{ post.like_count }} ❤️</p>
          </div>
        </div>
        <p v-else class="no-posts">No posts available.</p>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
    this.checkIfFollowing();
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    async fetchUserData() {
      const userId = this.$route.params.id;
      try {
        const userResponse = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}`
        );
        const userData = await userResponse.json();

        if (userResponse.ok) {
          this.user = userData;
          this.checkIfFollowing();
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
    checkIfFollowing() {
      const favoriteUserId = parseInt(this.$route.params.id);
      if (this.user && this.user.favorite_users) {
        this.isFollowing = this.user.favorite_users.some(
          (favorite) => favorite.id === favoriteUserId
        );
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
</style>
