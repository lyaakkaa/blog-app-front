<template>
  <div>
    <Header :toggleMenu="toggleMenu" />
    <div class="main-container">
      <Sidebar
        :menuVisible="menuVisible"
        :toggleMenu="toggleMenu"
        :filterByTopic="filterByTopic"
      />

      <div class="box">
        <div class="filters">
          <label class="filter-icon" for="sort-options"
            ><i class="fa-solid fa-filter"></i
          ></label>
          <select id="sort-options" v-model="sortingType" @change="resetPage">
            <option value="date">Date</option>
            <option value="likes">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div class="posts-grid">
          <div
            v-for="(person, ind) in paginatedPersons"
            :key="person.id"
            :class="{ 'friend-post': isFriend(person.user.id) }"
          >
            <Post :post="person" />
          </div>
        </div>

        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <span> {{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Post from "./Post.vue";
import _ from "lodash";
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";

export default {
  components: {
    Header,
    Sidebar,
    Post,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 4,
      menuVisible: false,
      persons: [], // Array for posts
      friendsMap: {}, // Object to map user IDs to custom names
      sortingType: "date",
      selectedTopic: null,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredPersons.length / this.itemsPerPage);
    },
    paginatedPersons() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPersons.slice(start, end);
    },
    filteredPersons() {
      let filtered = this.persons;

      // Filter by selected topic if a topic is chosen
      if (this.selectedTopic) {
        filtered = _.filter(
          filtered,
          (person) => person.Topic === this.selectedTopic
        );
      }

      // Apply sorting based on sortingType
      if (this.sortingType === "date") {
        return _.orderBy(filtered, ["PubDate"], ["desc"]);
      } else if (this.sortingType === "likes") {
        return _.orderBy(filtered, ["likeCount"], ["desc"]);
      } else if (this.sortingType === "name") {
        return _.orderBy(filtered, ["PersonName"], ["asc"]);
      }

      return filtered;
    },
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    filterByTopic(topic) {
      this.selectedTopic = topic;
      this.currentPage = 1;
      this.toggleMenu();
    },
    resetPage() {
      this.currentPage = 1;
    },
    isFriend(userId) {
      return userId in this.friendsMap;
    },
    async fetchPosts() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User not found.");
          return;
        }

        // Fetch posts
        const postsResponse = await axios.get(
          "http://127.0.0.1:8000/api/posts/"
        );
        const postsData = postsResponse.data;

        // Fetch friends with custom names
        const friendsResponse = await axios.get(
          `http://127.0.0.1:8000/api/users/${userId}/friends`
        );
        const friendsData = friendsResponse.data;

        // Map friends to an object for easy lookup
        this.friendsMap = friendsData.reduce((map, friend) => {
          map[friend.friend.id] =
            friend.friend_name || friend.friend.person_name;
          return map;
        }, {});

        // Combine posts with custom friend names (if applicable)
        this.persons = postsData.map((post) => ({
          id: post.id,
          PersonName: this.friendsMap[post.user.id] || post.user.person_name, // Use custom name if available
          Avatar: post.user.avatar,
          PubDate: post.pub_date,
          Rating: post.rating,
          Commentary: post.commentary,
          Topic: post.topic.name,
          isLiked: post.is_liked,
          likeCount: post.like_count,
          user: post.user, // Store full user object for future use
        }));
      } catch (error) {
        console.error("Error fetching posts or friends:", error);
      }
    },
  },
  mounted() {
    this.fetchPosts(); // Fetch posts and friends when the component is mounted
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 35px;
}

.filters {
  margin-bottom: 10px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filters label {
  margin-right: 10px;
}

.filters select {
  border-radius: 10px;
  padding: 4px 8px;
  font-size: 16px;
  background-color: green;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.pagination {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.pagination button {
  padding: 8px;
  color: #d2e037;
}

.menu-btn {
  float: left;
  font-size: 24px;
  margin: 10px;
  cursor: pointer;
}

.filter-icon {
  font-size: 32px;
  color: green;
}

/* Адаптация для мобильных телефонов */
@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 2fr;
    gap: 16px;
  }

  .filters {
    flex-direction: row;
    gap: 5px;
  }

  .filters select {
    width: 100%;
    padding: 8px;
    font-size: 14px;
  }

  .pagination {
    flex-direction: column; /* Изменено на column */
    align-items: stretch; /* Растягиваем кнопки по ширине */
    gap: 8px; /* Увеличен зазор между кнопками */
  }

  .pagination button {
    padding: 8px;
    font-size: 14px;
    width: 100%; /* Кнопки занимают всю ширину контейнера */
    margin-bottom: 0; /* Убираем лишние отступы */
  }

  .filter-icon {
    font-size: 24px;
  }

  .box {
    margin-top: 20px;
  }
}

/* Адаптация для маленьких гаджетов */
@media (max-width: 480px) {
  .filters {
    margin-bottom: 5px;
  }

  .filters select {
    width: 100%;
    padding: 8px;
    font-size: 12px;
  }

  .pagination {
    flex-direction: column; /* Остается в column */
    align-items: stretch;
    gap: 10px;
  }

  .pagination button {
    width: 100%; /* Растягиваем кнопки */
    margin-bottom: 0;
    padding: 6px;
    font-size: 12px;
  }

  .filter-icon {
    font-size: 20px;
  }

  .box {
    margin-top: 10px;
  }
}

</style>
