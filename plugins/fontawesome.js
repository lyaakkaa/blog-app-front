import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Импорт нужных иконок
import { faStar as fasStar, faHeart } from '@fortawesome/free-solid-svg-icons'  // solid иконки
import { faStar as farStar, faStarHalfStroke } from '@fortawesome/free-regular-svg-icons'  // regular иконки
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


// Добавляем иконки в библиотеку
library.add(fasStar, faHeart, farStar, faStarHalfStroke, faChevronLeft, faChevronRight)

// Экспортируем плагин
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
