/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}', './public/index.html'],
  theme: {
      extend: {
          backgroundImage: {
              'hanoi-image':
                  "url('https://vcdn1-dulich.vnecdn.net/2022/05/11/hoan-kiem-lake-7673-1613972680-1508-1652253984.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=2wB1cBTUcNKuk68nrG6LMQ')",
              'namdinh-image':
                  "url('https://upload.wikimedia.org/wikipedia/commons/f/f4/Statue_of_Tran_Hung_Dao%2C_Nam_Dinh_City%2C_Vietnam_%2803%29.jpg')",
              'halong-image':
                  "url('https://ik.imagekit.io/tvlk/blog/2022/10/kinh-nghiem-du-lich-vinh-ha-long-1.jpg?tr=dpr-2,w-675')",
              'default':
                  "url('https://t3.ftcdn.net/jpg/04/60/01/36/360_F_460013622_6xF8uN6ubMvLx0tAJECBHfKPoNOR5cRa.jpg')",
          },
          width: {
              1124: '1124px',
          },
          backgroundColor: {
              primary: '#ffffff',
              secondary: '#5392f9',
              third: '#e12d2d',
          },
          dropShadow: {
              '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
              '4xl': ['0 35px 35px rgba(0, 0, 0, 0.25)', '0 45px 65px rgba(0, 0, 0, 0.15)'],
              blue: '0 1px 1px #5392f9',
              red: '0 1px 1px #e12d2d',
          },
      },
  },
  plugins: [],
};
