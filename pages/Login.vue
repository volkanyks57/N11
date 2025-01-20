<template>
  <div class="container-fluid">
    <div class="top-section position-relative">
      <a href="/"><img src="https://n11scdn.akamaized.net/custom/upload/69/25/1508786309677730767.svg" alt="Overlay Logo"
        class="overlay-logo" /></a>
    </div>

    <!-- Alt Yarım: Login Komponenti -->
    <div class="bottom-section d-flex align-items-center justify-content-center">
      <div class="login-container card p-4">
        <div class="Merhaba text-center">
          <span class="fw-bold">Merhaba!</span><br />
          <span>Üyelere özel kupon ve fırsatlar seni bekliyor</span>
        </div>
        <div class="card-header text-center">
          <div class="d-flex justify-content-between">
            <!-- Giriş Yap Button -->
            <button class="btn border" :class="{ active: !isSignUp, inactive: isSignUp }"
              style="background-color: white; color: black; width: 48%; font-weight: bolder;" @click="isSignUp = false">
              Giriş Yap
            </button>
            <!-- Üye Ol Button -->
            <button class="btn border" :class="{ active: isSignUp, inactive: !isSignUp }"
              style="background-color: white; color: black; width: 48%; font-weight: bolder;" @click="isSignUp = true">
              Üye Ol
            </button>
          </div>
        </div>
        <!-- Form Alanı -->
        <div class="card-body">
          <!-- Giriş Yap Formu -->
          <form v-if="!isSignUp" @submit.prevent="handleLogin">
            <!-- Email/Phone Input -->
            <div class="mb-3">
              <input type="text" id="username" class="form-control" placeholder="E-posta Adresi" v-model="username"
                required />
            </div>
            <!-- Password Input -->
            <div class="mb-3 position-relative">
              <input :type="showPassword ? 'text' : 'password'" id="password" class="form-control" placeholder="Şifre"
                v-model="password" required />
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                class="position-absolute top-50 end-0 translate-middle-y me-3" style="cursor: pointer;"
                @click="togglePasswordVisibility"></i>
            </div>
            <div class="text-end mb-3">
              <a href="#" class="text-decoration-none" style="background-color: white; color: #5D3EBC;">
                Şifremi Unuttum
              </a>
            </div>
            <!-- Login Button -->
            <button type="submit" class="btn w-100" style="background-color: #5D3EBC; color: white;">
              Giriş Yap
            </button>
          </form>
          <!-- Üye Ol Formu -->
          <form v-else @submit.prevent="handleSignUp">
            <div class="mb-3 d-flex gap-2">
              <input type="text" id="name" class="form-control" placeholder="Ad" v-model="name" required />
              <input type="text" id="surname" class="form-control" placeholder="Soyad" v-model="surname" required />
            </div>
            <div class="mb-3 d-flex gap-2">
              <input type="text" id="phone-code" class="form-control" placeholder="Ülke Kodu" v-model="phoneCode"
                readonly style="flex: 0 0 25%;" />
              <input type="text" id="phone" class="form-control" placeholder="(5__) ___-____" v-model="phone"
                @input="formatPhoneNumber" maxlength="15" required />
            </div>
            <div class="mb-3">
              <input type="email" id="email" class="form-control" placeholder="E-posta Adresi" v-model="email"
                required />
            </div>
            <div class="mb-3 position-relative">
              <input :type="showPassword ? 'text' : 'password'" id="signup-password" class="form-control"
                placeholder="Şifre" v-model="password" required />
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                class="position-absolute top-50 end-0 translate-middle-y me-3" style="cursor: pointer;"
                @click="togglePasswordVisibility"></i>
            </div>

            <div class="mb-3">
              <span style="font-size: 15px;">Cinsiyet (İsteğe Bağlı)</span>
              <div class="d-flex gap-2 mt-2">
                <button class="btn border" :class="{ 'gender-selected': selectedGender === 'Kadın' }"
                  @click="selectGender('Kadın')" style="flex: 1;">
                  Kadın
                </button>
                <button class="btn border" :class="{ 'gender-selected': selectedGender === 'Erkek' }"
                  @click="selectGender('Erkek')" style="flex: 1;">
                  Erkek
                </button>
              </div>
            </div>

            <div class="mb-3">
              <label>
                <input type="checkbox" v-model="termsAccepted" required /><span style="font-size: 15px;">Üyelik
                  sözleşmesini kabul ediyorum</span>
              </label>
            </div>
            <div class="mb-3">
              <label>
                <input type="checkbox" v-model="promotionsAccepted" /><span style="font-size: 15px;">n11'in bana özel
                  sunduğu kampanya ve
                  fırsatlardan haberdar olmak istiyorum.</span>
              </label>
            </div>
            <div class="mb-3">
              <span style="font-size: 15px;">KVKK kapsamının detaylarına, n11 Kişisel Verilerin Korunması ve İşlenmesi
                şartlarının yer aldığı sayfamızdan ulaşabilirsin.</span>
            </div>
            <button type="submit" class="btn w-100" style="background-color: #5D3EBC; color: white;">Üye Ol</button>
          </form>
          <!-- Diğer Seçenekler -->
          <div class="mt-4 text-center">
            <div class="line-wrapper">
              <span class="line-text">Diğer Seçenekler</span>
            </div>
            <div class="d-flex justify-content-around">
              <!-- Sosyal medya butonları sadece ikonlar -->
              <button class="btn btn-google border">
                <img
                  src="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22.7861 9.84563H21.9V9.79998H12V14.2H18.2167C17.3097 16.7613 14.8727 18.6 12 18.6C8.35515 18.6 5.4 15.6448 5.4 12C5.4 8.35513 8.35515 5.39999 12 5.39999C13.6825 5.39999 15.2131 6.03469 16.3786 7.07144L19.4899 3.96009C17.5253 2.12915 14.8974 1 12 1C5.92525 1 1 5.92524 1 12C1 18.0747 5.92525 23 12 23C18.0748 23 23 18.0747 23 12C23 11.2624 22.9241 10.5425 22.7861 9.84563Z' fill='%23FFC107'/%3E%3Cpath d='M2.26758 6.88004L5.88163 9.53048C6.85953 7.10939 9.22783 5.39999 11.9993 5.39999C13.6817 5.39999 15.2124 6.03469 16.3778 7.07144L19.4892 3.96009C17.5246 2.12915 14.8967 1 11.9993 1C7.77418 1 4.11008 3.38534 2.26758 6.88004Z' fill='%23FF3D00'/%3E%3Cpath d='M11.9998 23C14.8411 23 17.4228 21.9127 19.3747 20.1444L15.9702 17.2635C14.8658 18.1001 13.493 18.6 11.9998 18.6C9.13868 18.6 6.70933 16.7757 5.79413 14.2297L2.20703 16.9935C4.02753 20.5558 7.72463 23 11.9998 23Z' fill='%234CAF50'/%3E%3Cpath d='M22.786 9.8457H21.9V9.80005H12V14.2H18.2167C17.7811 15.4304 16.9896 16.4913 15.9688 17.2641L15.9704 17.263L19.375 20.1439C19.1341 20.3628 23 17.5 23 12C23 11.2625 22.9241 10.5425 22.786 9.8457Z' fill='%231976D2'/%3E%3C/svg%3E%0A"></img>
              </button>
              <button class="btn btn-facebook border">
                <i class="bi bi-facebook"></i>
              </button>
              <button class="btn btn-apple border">
                <i class="bi bi-apple"></i>
              </button>
            </div>
          </div>
          <!-- Yardım -->
          <div class="mt-3 text-center">
            <p>Yardıma mı ihtiyacın var?</p>
            <p>0850 333 0011 numarası üzerinden Müşteri Hizmetleri'ni arayabilirsin.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default defineComponent({
  name: 'Login',
  setup() {
    const isSignUp = ref(false); // Geçiş için
    const username = ref<string>('');
    const password = ref<string>('');
    const name = ref('');
    const surname = ref('');
    const email = ref('');
    const phone = ref('(5__) ___-____');
    const phoneCode = ref('TR(+90)');
    const termsAccepted = ref(false);
    const promotionsAccepted = ref(false);
    const rememberMe = ref<boolean>(false);
    const showPassword = ref<boolean>(false);
    const selectedGender = ref<string | null>(null);

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleLogin = async () => {
      try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, username.value, password.value);
        console.log('Giriş başarılı:', userCredential.user);
        alert('Giriş başarılı!');
        window.location.href = 'http://localhost:3000';
      } catch (error: any) {
        console.error('Giriş hatası:', error);
        alert('E-posta adresi veya şifre hatalı, kontrol edebilir misin?');
      }
    };

    const handleSignUp = async () => {
      if (!termsAccepted.value) {
        alert('Lütfen üyelik sözleşmesini kabul ediniz.');
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log('Üyelik başarılı:', userCredential.user);
        alert('Üyelik işlemi başarılı!');
        window.location.href = 'http://localhost:3000';
      } catch (error) {
        console.error('Üyelik hatası:', error);
        alert('Üyelik işlemi sırasında bir hata oluştu, tekrar deneyebilir misin?');
      }
    };

    const formatPhoneNumber = () => {
      const digits = phone.value.replace(/\D/g, '').substring(1);
      phone.value = `(5${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5, 9)}`;
    };

    const selectGender = (gender: string) => {
      selectedGender.value = gender;
    };

    return {
      username,
      password,
      rememberMe,
      showPassword,
      togglePasswordVisibility,
      handleLogin,
      handleSignUp,
      isSignUp,
      name,
      surname,
      email,
      phone,
      phoneCode,
      termsAccepted,
      promotionsAccepted,
      formatPhoneNumber,
      selectGender,
      selectedGender,
    };
  },
});
</script>

<style scoped>
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn.active {
  background-color: #ffffff !important;
  color: black !important;
  font-weight: bold;
  border-color: #e5e1f1;
}

.btn.inactive {
  opacity: 0.5;
}

.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.line-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.line-wrapper::before,
.line-wrapper::after {
  content: '';
  flex-grow: 1;
  height: 1px;
  background-color: #ccc;
  margin: 0 15px;
}

.line-text {
  font-weight: bold;
  color: #5D3EBC;
}

.d-flex button {
  width: 30%;
}

/* Renkli Sosyal Medya Butonları*/
.btn-google {
  background-color: white;
}

.btn-facebook {
  background-color: white;
  color: blue;
}

.btn-apple {
  background-color: white;
  color: black;
}

.btn i {
  font-size: 1.5rem;
}

.btn-google:hover,
.btn-facebook:hover,
.btn-apple:hover {
  opacity: 0.8;
}

.container {
  max-width: 1100px;
}

a:hover {
  color: #3E2A8C;
  /* İstediğiniz hover rengi */
  text-decoration: underline;
}

.d-flex.gap-2>* {
  flex: 1;
}

.gender-selected {
  border-color: #5D3EBC !important;
  font-weight: bold;
}

.container-fluid {
  height: 100vh;
  /* Tüm ekran yüksekliği */
  display: flex;
  flex-direction: column;
}

.top-section {
  height: 60%;
  background-image: url("/public/Icons/n11.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay-logo {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  z-index: 1;
}

.bottom-section {
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-top: 30px;
}

.login-container {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 100%;
  margin-top: -50px;
  transition: height 0.3s ease;
}

.login-container:has(form:last-child) {
  height: auto; /* Dinamik olarak alta doğru genişler */
  min-height: 60%;
}
</style>
