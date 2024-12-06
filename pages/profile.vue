<template>
  <div>
    <Header :toggleMenu="toggleMenu" />
    <div class="profile-container">
      <div class="profile-header">
        <img
          :src="
            user?.avatar ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          "
          alt="User Avatar"
          class="user-avatar"
        />
        <h1>{{ user?.person_name || "User Profile" }}</h1>
      </div>

      <div v-if="user" class="user-info">
        <div class="user-details">
          <template v-if="editMode">
            <div class="input-group">
              <label for="person_name">Name</label>
              <input
                id="person_name"
                type="text"
                v-model="user.person_name"
                placeholder="Name"
                class="input-field"
              />
            </div>
            <div class="input-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                v-model="user.email"
                placeholder="Email"
                class="input-field"
              />
            </div>
            <div class="input-group">
              <label for="login">Username</label>
              <input
                id="login"
                type="text"
                v-model="user.login"
                placeholder="Username"
                class="input-field"
              />
            </div>
            <div class="input-group">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                v-model="user.password"
                placeholder="Password"
                class="input-field"
              />
            </div>
            <div class="input-group">
              <label for="age">Age</label>
              <input
                id="age"
                type="number"
                v-model="user.age"
                placeholder="Age"
                class="input-field"
              />
            </div>
            <div class="input-group">
              <label for="location">Location</label>
              <input
                id="location"
                type="text"
                v-model="user.location"
                placeholder="Location"
                class="input-field"
              />
            </div>
            <div class="input-group">
              <label for="avatar">Avatar</label>
              <input
                id="avatar"
                type="file"
                @change="onFileChange"
                class="input-file"
              />
            </div>
          </template>
          <template v-else>
            <div>
              <p><strong>Email:</strong> {{ user.email || "Not provided" }}</p>
              <p>
                <strong>Username:</strong> {{ user.login || "Not provided" }}
              </p>
              <p><strong>Age:</strong> {{ user.age || "Not provided" }}</p>
              <p>
                <strong>Location:</strong> {{ user.location || "Not provided" }}
              </p>
              <p>
                <strong>Last Activity:</strong>
                {{
                  user.activity
                    ? new Date(user.activity).toLocaleString()
                    : "Not provided"
                }}
              </p>
            </div>
          </template>
        </div>
      </div>

      <div class="button-group">
        <button @click="toggleEditMode" class="edit-button">
          {{ editMode ? "Cancel" : "Edit Profile" }}
        </button>
        <button v-if="editMode" @click="saveChanges" class="save-button">
          Save
        </button>
        <button @click="goToFriends" class="friends-button">Friends</button>
        <button @click="goToStatistic" class="statistic-button">Statistic</button>
      </div>

      <div class="user-posts">
        <h2>Your Posts</h2>
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post-item">
            <div class="post-header">
              <h3>{{ post.commentary }}</h3>
              <p class="post-date">
                {{ new Date(post.pub_date).toDateString() }}
              </p>
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
      editMode: false,
      newAvatar: null,
      errorMessage: "",
    };
  },
  async mounted() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      this.errorMessage = "User not found.";
      return;
    }

    try {
      const userResponse = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}`
      );
      const userData = await userResponse.json();

      if (userResponse.ok) {
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
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    onFileChange(event) {
      this.newAvatar = event.target.files[0];
    },
    async saveChanges() {
      const userId = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("person_name", this.user.person_name);
      formData.append("email", this.user.email);
      formData.append("login", this.user.login);
      formData.append("password", this.user.password);
      formData.append("age", this.user.age);
      formData.append("location", this.user.location || null);
      formData.append("activity", this.user.activity);
      if (this.newAvatar) {
        formData.append("avatar", this.newAvatar);
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (response.ok) {
          this.editMode = false;
          this.errorMessage = "";
          const updatedUser = await response.json();
          this.user = updatedUser;
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.error || "Failed to update profile.";
        }
      } catch (error) {
        this.errorMessage = "Error saving changes. Please try again.";
      }
    },
    goToFriends() {
      this.$router.push(`/friends`);
    },
    goToStatistic() {
      this.$router.push(`/statistic`);
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: black;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
}

h1 {
  color: #333;
  font-size: 24px;
  font-weight: bold;
}

.user-info {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.input-file {
  margin-top: 10px;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.edit-button,
.save-button,
.friends-button,
.statistic-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.edit-button {
  background-color: #3498db;
  color: white;
}

.save-button {
  background-color: #2ecc71;
  color: white;
}

.friends-button {
  background-color: #f39c12;
  color: white;
}

.statistic-button{
  background-color: #e131e7;
  color: white;
}

.user-posts h2 {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
}

.post-item {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-header h3 {
  color: #333;
  font-size: 16px;
}

.post-date {
  font-size: 12px;
  color: #777;
}

.post-content,
.post-rating,
.post-likes {
  font-size: 14px;
  color: #555;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
}
</style>
