<template>
  <div class="card">
    <div class="card__header">
      <div class="card__user">
        <img
          class="card__avatar"
          :src="post.Avatar ? post.Avatar : '_nuxt/src/assets/no_pfp.svg'"
          alt="Avatar"
        />
      </div>
      <div class="card__info">
        <div class="card__posted">
          <router-link :to="`/users/${post.user.id}`" class="user-name">
            <h2 class="card__username">{{ post.PersonName }}</h2>
          </router-link>
          <!-- <router-link :to="{ name: 'UserProfile', params: { id: post.user.id } }" class="user-name">
            <h2 class="card__username">{{ post.PersonName }}</h2>
          </router-link> -->
          <!-- <h2 class="card__username">{{ post }}</h2> -->
          <p class="card__date">{{ post.PubDate }}</p>
        </div>

        <div class="card__rating">
          <!-- Звезды рейтинга -->
          <font-awesome-icon
            v-for="star in Math.floor(post.likeCount / 4)"
            :key="star"
            :icon="['fas', 'star']"
          />
          <font-awesome-icon
            v-if="post.likeCount % 4 >= 2"
            :icon="['far', 'star-half-stroke']"
          />
          <font-awesome-icon
            v-for="star in 5 -
            Math.floor(post.likeCount / 4) -
            (post.likeCount % 4 >= 2 ? 1 : 0)"
            :key="star"
            :icon="['far', 'star']"
          />
        </div>
      </div>
    </div>
    <p class="card__content">{{ post.Commentary }}</p>

    <button
      class="card__like-button"
      @click="addLike"
      :style="{ color: post.isLiked ? '#fb0000' : '#616161' }"
    >
      <!-- Кнопка лайка -->
      <font-awesome-icon :icon="['fas', 'heart']" />
      {{ post.likeCount }}
    </button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    post: Object,
  },
  methods: {
    async addLike() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("User ID не найден в localStorage");
          return;
        }

        const response = await axios.post(
          `http://127.0.0.1:8000/api/posts/${this.post.id}/like/`,
          {
            user_id: userId,
          }
        );

        this.post.isLiked = !this.post.isLiked;
        this.post.likeCount = response.data.like_count;
      } catch (error) {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.error === "You cannot like your own post."
        ) {
          alert("Вы не можете лайкать свой собственный пост.");
        } else {
          alert("Произошла ошибка при добавлении лайка. Попробуйте снова.");
        }
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.card {
  background: linear-gradient(135deg, #006600, #00cc66);
  border-radius: 12px;
  padding: 24px;
  width: 600px;
  text-align: left;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border: none;
}

.card__header {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-bottom: 16px;
}

.card__info {
  width: 100%;
}

.card__posted {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card__username {
  font-size: 18px;
  color: black;
}

.card__date {
  font-size: 14px;
  font-weight: bold;
}

.card__user {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}

.card__avatar {
  border-radius: 100%;
  width: 56px;
  height: 56px;
  border: 2px solid #e5fa02;
}

.card__content {
  font-size: 16px;
  margin-bottom: 16px;
  color: #e6ffe6;
}

.card__like-button {
  padding: 8px 16px;
  border-radius: 24px;
  background-color: #e1e1e1;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card__like-button:hover {
  background-color: #003300;
}

.card__rating {
  display: flex;
  flex-direction: row;
  color: #eeff04;
  gap: 4px;
}

button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #ffffff;
}

button i {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .card {
    width: 90%;
    padding: 16px;
  }

  .card__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card__user {
    gap: 8px;
  }

  .card__username {
    font-size: 16px;
  }

  .card__date {
    font-size: 12px;
  }

  .card__content {
    font-size: 14px;
  }

  .card__like-button {
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 12px;
  }

  .card__username {
    font-size: 14px;
  }

  .card__date {
    font-size: 10px;
  }

  .card__content {
    font-size: 12px;
  }
}
</style>
