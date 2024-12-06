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
</style>
