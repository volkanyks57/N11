// stores/favoritesStore.ts
import { defineStore } from 'pinia';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const db = getFirestore();

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    activeTab: 'favorilerim',
    selectedCategory: 'Tümü',
    favoriteProducts: [] as any[],
    menuItems: [
      'Siparişlerim',
      'İptal/Değişim/İade',
      'Kuponlarım',
      'Garajım',
      'pet11e Kayıtlı Dostlarım',
      'Favorilerim & Listelerim',
      'Değerlendirmelerim',
      'Soru ve Cevaplarım',
      'Üyelik Bilgilerim',
      'Adreslerim',
      'Şifre Değiştir',
      'Üyelik İptali',
    ],
    categoryIcons: {
      Elektronik: 'bi bi-phone',
      'Spor & Outdoor': 'bi bi-bicycle',
      Moda: 'bi bi-bag',
      Ev: 'bi bi-house',
      Otomotiv: 'bi bi-car-front-fill',
    } as Record<string, string>,
  }),
  getters: {
    groupedProducts(state) {
      return state.favoriteProducts.reduce((groups: Record<string, any[]>, product) => {
        if (!groups[product.category]) {
          groups[product.category] = [];
        }
        groups[product.category].push(product);
        return groups;
      }, { Tümü: state.favoriteProducts });
    },
  },
  actions: {
    async fetchFavorites() {
      try {
        const querySnapshot = await getDocs(collection(db, 'Favorites'));
        this.favoriteProducts = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Bilinmeyen Ürün',
            image: (data.image && data.image[0]) || '/placeholder.jpg',
            price: Number(data.newPrice || 0),
            category: data.category || 'Diğer',
            rating: data.rating || 0,
            reviewCount: data.reviews || 0,
            freeShipping: data.freeShipping || false,
          };
        });
      } catch (error) {
        console.error('Veriler alınırken bir hata oluştu:', error);
      }
    },
    async deleteProduct(id: string) {
      try {
        await deleteDoc(doc(db, 'Favorites', id));
        this.favoriteProducts = this.favoriteProducts.filter(product => product.id !== id);
      } catch (error) {
        console.error('Ürün silinirken bir hata oluştu:', error);
      }
    },
    setActiveTab(tab: string) {
      this.activeTab = tab;
    },
    setSelectedCategory(category: string) {
      this.selectedCategory = category;
    },
  },
});