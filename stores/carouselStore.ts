import { defineStore } from 'pinia';
import { getDocs, collection } from 'firebase/firestore';
import { useNuxtApp } from '#app';

// Firebase'den gelecek verilerin tipini tanımlayın
interface CarouselImage {
  img: string;
}

export const useCarouselStore = defineStore('carousel', {
  state: () => ({
    images: [] as CarouselImage[],
  }),
  actions: {
    async fetchCarouselImages(): Promise<void> {
      try {
        const { $db } = useNuxtApp(); // Nuxt plugin'den Firebase DB'ye erişim
        const querySnapshot = await getDocs(collection($db, 'Carousel'));
        this.images = querySnapshot.docs.map((doc) => doc.data() as CarouselImage);
      } catch (error) {
        console.error('Carousel verileri alınırken hata oluştu:', error);
      }
    },
  },
});