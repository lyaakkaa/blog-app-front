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
        <button @click="goToStatistic" class="statistic-button">
          Statistic
        </button>
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

      // Добавляем только те поля, которые изменились
      if (this.user.password) formData.append("password", this.user.password);
      if (this.user.age) formData.append("age", this.user.age);
      if (this.user.location) formData.append("location", this.user.location);
      if (this.newAvatar) formData.append("avatar", this.newAvatar);

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/`,
          {
            method: "PATCH", // Используем PATCH вместо PUT
            body: formData,
          }
        );

        if (response.ok) {
          const updatedUser = await response.json();

          // Сохраняем favorites, если сервер не возвращает их
          const currentFavorites = this.user.favorite_users || [];
          this.user = {
            ...this.user,
            ...updatedUser,
            favorite_users: updatedUser.favorite_users || currentFavorites,
          };

          this.editMode = false;
          this.errorMessage = "";
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
/* Контейнер профиля */
.profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: black;
  overflow: auto;
}

/* Заголовок профиля */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-bottom: 10px;
}

h1 {
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

/* Информация о пользователе */
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

/* Группа кнопок */
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

.statistic-button {
  background-color: #e131e7;
  color: white;
}

/* Посты */
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

/* Ошибка */
.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
}

/* --- Адаптивность для планшетов (макс. ширина: 768px) --- */
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
  }

  h1 {
    font-size: 20px;
  }

  .user-info {
    padding: 15px;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .edit-button,
  .save-button,
  .friends-button,
  .statistic-button {
    padding: 10px;
    font-size: 14px;
  }

  .user-posts h2 {
    font-size: 18px;
  }

  .post-header h3 {
    font-size: 14px;
  }

  .post-date {
    font-size: 16px;
  }

  .post-content,
  .post-rating,
  .post-likes {
    font-size: 12px;
  }
}

/* --- Адаптивность для мобильных устройств (макс. ширина: 480px) --- */
@media (max-width: 480px) {
  .profile-container {
    padding: 10px;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
  }

  h1 {
    font-size: 18px;
  }

  .user-info {
    padding: 10px;
  }

  .button-group {
    flex-direction: column;
    gap: 8px;
  }

  .edit-button,
  .save-button,
  .friends-button,
  .statistic-button {
    padding: 8px 12px;
    font-size: 12px;
  }

  .user-posts h2 {
    font-size: 18px;
  }

  .post-header h3 {
    font-size: 12px;
  }

  .post-date {
    font-size: 10px;
  }

  .post-content,
  .post-rating,
  .post-likes {
    font-size: 10px;
  }
}
</style>
