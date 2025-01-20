<template>
  <div id="carouselExampleRide" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button
        v-for="(image, index) in carouselStore.images"
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
        v-for="(image, index) in carouselStore.images"
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

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useCarouselStore } from '../stores/carouselStore';

// Store'u kullan
const carouselStore = useCarouselStore();

// Bileşen yüklendiğinde verileri çek
onMounted(() => {
  carouselStore.fetchCarouselImages();
});
</script>

<style scoped>
/* Mevcut CSS */
#carouselExampleRide {
  margin-top: 20px;
  position: relative;
  width: 100%; /* Genişlik yüzde 100 yapıldı */
  max-width: 1162px; /* Maksimum genişlik belirtildi */
  margin-left: auto;
  margin-right: auto; /* Ortalanmasını sağlar */
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
  left: 10px; /* Butonları daha yakın konumlandırdık */
}

.carousel-control-next {
  right: 10px; /* Butonları daha yakın konumlandırdık */
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
  width: 100%; /* Container genişliğini %100 yapıyoruz */
  height: 100%; /* Yüksekliği de %100 yapıyoruz */
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 8px;
}

.carousel-item {
  height: 100%;
  object-fit: cover; /* Görsellerin düzgün şekilde sığmasını sağlar */
}

</style>