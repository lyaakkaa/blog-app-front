<template>
  <div>
    <Header :toggleMenu="toggleMenu" />
    <div class="create-post-container">
      <h1>Create a New Post</h1>
      <div class="form-group">
        <label for="commentary">Commentary</label>
        <textarea
          id="commentary"
          v-model="form.commentary"
          placeholder="Write something amazing..."
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="topic">Select Topic</label>
        <select id="topic" v-model="form.topicId" required>
          <option v-for="topic in topics" :key="topic.id" :value="topic.id">
            {{ topic.name }}
          </option>
        </select>
      </div>
      <button @click="submitPost" class="submit-button">Submit</button>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
      form: {
        commentary: "",
        topicId: null,
      },
      topics: [],
      successMessage: "",
      errorMessage: "",
    };
  },
  async created() {
    await this.fetchTopics();
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    async fetchTopics() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/topics/");
        this.topics = response.data;
      } catch (error) {
        console.error("Error fetching topics:", error);
        this.errorMessage = "Failed to load topics. Please try again.";
      }
    },
    async submitPost() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          this.errorMessage = "You need to log in to create a post.";
          return;
        }
        await axios.post("http://127.0.0.1:8000/api/posts/", {
          user: userId,
          topic: this.form.topicId,
          commentary: this.form.commentary,
        });
        this.successMessage = "Post created successfully!";
        this.errorMessage = "";
        this.form.commentary = "";
        this.form.topicId = null;
      } catch (error) {
        console.error("Error creating post:", error);
        this.errorMessage =
          error.response?.data?.error || "Failed to create post.";
      }
    },
  },
};
</script>

<style scoped>
.create-post-container {
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

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

textarea,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

textarea {
  resize: none;
  height: 100px;
}

textarea:focus,
select:focus {
  border-color: #4caf50;
  outline: none;
}

.submit-button {
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #388e3c;
}

.success-message {
  color: #4caf50;
  font-weight: bold;
  margin-top: 20px;
}

.error-message {
  color: #f44336;
  font-weight: bold;
  margin-top: 20px;
}

/* --- Адаптивность для планшетов (макс. ширина: 1024px) --- */
@media (max-width: 1024px) {
  .create-post-container {
    padding: 16px;
    max-width: 90%;
  }

  h1 {
    font-size: 22px;
  }

  textarea,
  select {
    font-size: 14px;
    padding: 8px;
  }

  .submit-button {
    padding: 8px 16px;
    font-size: 15px;
  }
}

/* --- Адаптивность для телефонов (макс. ширина: 768px) --- */
@media (max-width: 768px) {
  .create-post-container {
    padding: 14px;
    max-width: 95%;
  }

  h1 {
    font-size: 20px;
  }

  textarea,
  select {
    font-size: 13px;
    padding: 6px;
  }

  .submit-button {
    padding: 8px 14px;
    font-size: 14px;
  }
}

/* --- Адаптивность для маленьких гаджетов (макс. ширина: 480px) --- */
@media (max-width: 480px) {
  .create-post-container {
    padding: 10px;
  }

  h1 {
    font-size: 18px;
  }

  textarea,
  select {
    font-size: 12px;
    padding: 5px;
  }

  .submit-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  label {
    font-size: 12px;
  }
}

/* --- Для совсем маленьких экранов (макс. ширина: 360px) --- */
@media (max-width: 360px) {
  .create-post-container {
    padding: 8px;
  }

  h1 {
    font-size: 16px;
  }

  textarea,
  select {
    font-size: 11px;
    padding: 4px;
  }

  .submit-button {
    padding: 5px 10px;
    font-size: 12px;
  }

  label {
    font-size: 11px;
  }
}
</style>
