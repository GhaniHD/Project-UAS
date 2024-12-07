/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Sesuaikan dengan file yang digunakan di proyek Anda
  ],
  theme: {
    extend: {
      colors: {
        krem: '#f1e0d6', // Warna krem yang lebih cocok dengan oranye
         oranye: '#e26816', // Warna oranye yang lebih cerah
      },
    },
  },
  plugins: [],
}
