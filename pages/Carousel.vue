<template>
  <div id="carouselExampleRide" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button
        v-for="(image, index) in carouselImages"
        :key="index"
        type="button"
        :data-bs-target="'#carouselExampleRide'"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        :aria-label="'Slide ' + (index + 1)"
      ></button>
    </div>
    <div class="carousel-inner">
      <div
        v-for="(image, index) in carouselImages"
        :key="index"
        :class="['carousel-item', { active: index === 0 }]"
      >
        <img :src="image.img" class="d-block w-100" alt="Carousel image" />
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleRide"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleRide"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<style scoped>
/* Mevcut CSS'i koruyorum */
#carouselExampleRide {
  margin-top: 20px;
  position: relative;
}
.carousel-control-prev,
.carousel-control-next {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.carousel-control-prev:hover,
.carousel-control-next:hover {
  opacity: 1;
}
.carousel-control-prev-icon,
.carousel-control-next-icon {
  border-radius: 50%;
  width: 48px;
  height: 48px;
  background-color: white;
  border: 2px solid black;
  background-image: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}
.carousel-control-prev {
  left: 100px;
}
.carousel-control-next {
  right: 100px;
}
.carousel-control-prev-icon::before,
.carousel-control-next-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(225deg);
  border-top: 3px solid black;
  border-right: 3px solid black;
  width: 10px;
  height: 10px;
}
.carousel-control-next-icon::after {
  transform: translate(-50%, -50%) rotate(45deg);
}
.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  border: none;
}
.carousel-indicators .active {
  background-color: black;
}
.carousel-inner {
  height: 43x;
  width: 1162px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px;
  border-radius: 8px;
}
.carousel-item {
  height: 100%;
  object-fit: cover;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app'; // Nuxt plugin'e erişim
import { getDocs, collection } from 'firebase/firestore';

// Reactive değişken
const carouselImages = ref([]); // Firebase'den çekilecek carousel resimleri

// Nuxt app içinden Firebase servisine erişim
const { $db } = useNuxtApp();

// Firebase'den verileri çekmek için method
const fetchCarouselImages = async () => {
  try {
    const querySnapshot = await getDocs(collection($db, 'Carousel'));
    const imageData = querySnapshot.docs.map((doc) => doc.data());
    console.log(imageData); // Verileri kontrol edin
    carouselImages.value = imageData;
  } catch (error) {
    console.error('Veriler alınırken hata oluştu:', error);
  }
};

// Component yüklendiğinde verileri çek
onMounted(() => {
  fetchCarouselImages();
});
</script>
