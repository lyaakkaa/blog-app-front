<template>
  <div class="card">
    <div class="card__header">
      <div class="card__user">
        <img
          class="card__avatar"
          :src="
            post.Avatar
              ? `http://127.0.0.1:8000${post.Avatar}`
              : '_nuxt/src/assets/no_pfp.svg'
          "
          alt="Avatar"
        />
      </div>
      <div class="card__info">
        <div class="card__posted">
          <router-link :to="`/users/${post.user.id}`" class="user-name">
            <h2 class="card__username">{{ post.PersonName }}</h2>
          </router-link>
          <p class="card__date">{{ formattedDate(post.PubDate) }}</p>
        </div>

        <div class="card__rating">
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
    formattedDate(dateString) {
      if (!dateString) return "Invalid date";

      const options = { year: "numeric", month: "long", day: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-EN", options);
    },
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
/* --- Базовые стили (Desktop по умолчанию) --- */
.card {
  background: linear-gradient(135deg, #006600, #00cc66);
  border-radius: 12px;
  padding: 24px;
  width: 600px;
  max-width: 100%;
  text-align: left;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border: none;
  margin: 20px auto;
}

.card__header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
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
  font-weight: bold;
  color: #ffffff;
  margin: 0;
}

.card__date {
  font-size: 14px;
  color: #d3ffd3;
  margin-top: 5px;
}

.card__user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card__avatar {
  border-radius: 50%;
  width: 56px;
  height: 56px;
  border: 2px solid #e5fa02;
  object-fit: cover;
}

.card__content {
  font-size: 16px;
  margin-bottom: 16px;
  color: #e6ffe6;
  line-height: 1.5;
}

.card__like-button {
  padding: 8px 16px;
  border-radius: 24px;
  background-color: #e1e1e1;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.card__like-button:hover {
  background-color: #003300;
  color: #ffffff;
}

.card__rating {
  display: flex;
  color: #eeff04;
  gap: 4px;
}

/* --- Для планшетов (макс. ширина: 1024px) --- */
@media (max-width: 1024px) {
  .card {
    width: 90%;
    padding: 20px;
  }

  .card__rating{
    font-size: 9px;
    margin-right: 10px;
  }

  .card__header {
    flex-direction: row;
    align-items: flex-start;
  }
  .card__date {
    display: none;
  }
  .card__username {
    font-size: 16px;
  }

  .card__date {
    font-size: 13px;
  }

  .card__content {
    font-size: 14px;
  }

  .card__like-button {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* --- Для телефонов (макс. ширина: 768px) --- */
@media (max-width: 768px) {
  .card {
    padding: 16px;
  }

  .card__avatar {
    width: 48px;
    height: 48px;
  }

  .card__username {
    font-size: 14px;
  }

  .card__content {
    font-size: 13px;
  }

  .card__like-button {
    padding: 6px 10px;
    font-size: 12px;
  }
  .card__date {
    display: none;
  }
}

/* --- Для маленьких гаджетов (макс. ширина: 480px) --- */
@media (max-width: 480px) {
  .card {
    padding: 12px;
  }

  .card__avatar {
    width: 40px;
    height: 40px;
  }

  .card__username {
    font-size: 12px;
  }

  .card__content {
    font-size: 11px;
  }

  .card__like-button {
    padding: 4px 8px;
    font-size: 11px;
  }
  .card__date {
    display: none;
  }
}
</style>
