<template>
  <svg v-if="name === 'history'" height="18" viewBox="0 0 33 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.5 0.5C11.045 0.5 5 6.545 5 14H0.5L6.335 19.835L6.44 20.045L12.5 14H8C8 8.195 12.695 3.5 18.5 3.5C24.305 3.5 29 8.195 29 14C29 19.805 24.305 24.5 18.5 24.5C15.605 24.5 12.98 23.315 11.09 21.41L8.96 23.54C11.405 25.985 14.765 27.5 18.5 27.5C25.955 27.5 32 21.455 32 14C32 6.545 25.955 0.5 18.5 0.5ZM17 8V15.5L23.42 19.31L24.5 17.495L19.25 14.375V8H17Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'comment'" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.985 3C29.985 1.35 28.65 0 27 0H3C1.35 0 0 1.35 0 3V21C0 22.65 1.35 24 3 24H24L30 30L29.985 3ZM22.5 13.5H16.5V19.5H13.5V13.5H7.5V10.5H13.5V4.5H16.5V10.5H22.5V13.5Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'share'" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14 4C14 1.79086 15.7909 0 18 0C20.2091 0 22 1.79086 22 4C22 6.20914 20.2091 8 18 8C16.7961 8 15.7164 7.46811 14.9831 6.6265L7.91208 10.162C7.96969 10.4322 8 10.7126 8 11C8 11.2874 7.96969 11.5678 7.91208 11.838L14.9831 15.3735C15.7164 14.5319 16.7961 14 18 14C20.2091 14 22 15.7909 22 18C22 20.2091 20.2091 22 18 22C15.7909 22 14 20.2091 14 18C14 17.7126 14.0303 17.4322 14.0879 17.162L7.01694 13.6265C6.28363 14.4681 5.20393 15 4 15C1.79086 15 0 13.2091 0 11C0 8.79086 1.79086 7 4 7C5.20393 7 6.28363 7.53189 7.01694 8.3735L14.0879 4.83801C14.0303 4.56777 14 4.28742 14 4ZM18 2C16.8954 2 16 2.89543 16 4C16 5.10457 16.8954 6 18 6C19.1046 6 20 5.10457 20 4C20 2.89543 19.1046 2 18 2ZM4 9C2.89543 9 2 9.89543 2 11C2 12.1046 2.89543 13 4 13C5.10457 13 6 12.1046 6 11C6 9.89543 5.10457 9 4 9ZM18 16C16.8954 16 16 16.8954 16 18C16 19.1046 16.8954 20 18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'new-page'" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 11V13.5H12.5V15.5H10V18H8V15.5H5.5V13.5H8V11H10Z" fill="black"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H11.4142L18 6.58579V22H0V0ZM2 2V20H16V8H10V2H2ZM12 3.41421L14.5858 6H12V3.41421Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'save'" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.4142 13L8 18.4142L4.58579 15L6 13.5858L8 15.5858L12 11.5858L13.4142 13Z" fill="black"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H11.4142L18 6.58579V22H0V0ZM2 2V20H16V8H10V2H2ZM12 3.41421L14.5858 6H12V3.41421Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'edit-page'" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9992 0.585693L22.4134 4.99994L4.4134 22.999H0V18.5857L17.9992 0.585693ZM14.4993 6.91424L2 19.4141L2 20.999L3.58501 20.999L16.0849 8.49981L14.4993 6.91424ZM17.4991 7.08563L15.9135 5.49999L17.9992 3.41415L19.585 4.9999L17.4991 7.08563Z" fill="black"/>
    <path d="M21.999 22.9999L9.99896 22.9999V20.9999L21.999 20.9999V22.9999Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'settings'" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 11C6 8.23858 8.23858 6 11 6C13.7614 6 16 8.23858 16 11C16 13.7614 13.7614 16 11 16C8.23858 16 6 13.7614 6 11ZM11 8C9.34315 8 8 9.34315 8 11C8 12.6569 9.34315 14 11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8Z" fill="#343434"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.27936 0H13.7209L14.5395 2.45577L16.8553 1.29806L20.703 5.14575L19.5454 7.46106L22.0002 8.27952V13.721L19.5444 14.5395L20.7018 16.8544L16.854 20.7021L14.5392 19.5446L13.7208 22H8.27926L7.46083 19.5447L5.14633 20.7018L1.29863 16.8541L2.45598 14.5394L0 13.721V8.27935L2.45604 7.46074L1.29851 5.14568L5.14629 1.2979L7.46088 2.45543L8.27936 0ZM9.72088 2L8.62896 5.27574L5.54111 3.73151L3.73203 5.54058L5.2762 8.62893L2 9.7209V12.2793L5.27621 13.371L3.73215 16.4592L5.5413 18.2683L8.62901 16.7247L9.72077 20H12.2793L13.3711 16.7244L16.4592 18.2686L18.2683 16.4595L16.7241 13.3712L20.0002 12.2794V9.72094L16.7253 8.62906L18.2695 5.54066L16.4604 3.7315L13.3713 5.27573L12.2794 2H9.72088Z" fill="#343434"/>
  </svg>
  <svg v-else-if="name === 'profile'" width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5C5 2.23858 7.23858 0 10 0C12.7614 0 15 2.23858 15 5C15 7.76142 12.7614 10 10 10C7.23858 10 5 7.76142 5 5ZM10 2C8.34315 2 7 3.34315 7 5C7 6.65685 8.34315 8 10 8C11.6569 8 13 6.65685 13 5C13 3.34315 11.6569 2 10 2Z" fill="#343434"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 21C0 15.4772 4.47715 11 10 11C15.5228 11 20 15.4772 20 21V22H0V21ZM2.06189 20H17.9381C17.446 16.0537 14.0796 13 10 13C5.92038 13 2.55399 16.0537 2.06189 20Z" fill="#343434"/>
  </svg>
  <svg v-else-if="name === 'book'" width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 0H3C1.35 0 0 1.35 0 3V27C0 28.65 1.35 30 3 30H21C22.65 30 24 28.65 24 27V3C24 1.35 22.65 0 21 0ZM3 3H10.5V15L6.75 12.75L3 15V3Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'search'" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 11.125 17.2635 13.078 16.0319 14.6177L22.4142 21L21 22.4142L14.6177 16.0319C13.078 17.2635 11.125 18 9 18C4.02944 18 0 13.9706 0 9ZM9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'more'" width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 18V14H4V18H0Z" fill="black"/>
    <path d="M0 11V7H4V11H0Z" fill="black"/>
    <path d="M0 4V0H4V4H0Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'link'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12C1 8.68629 3.68629 6 7 6H10V8H7C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16H10V18H7C3.68629 18 1 15.3137 1 12Z" fill="black"/>
    <path d="M14 6H17C19.973 6 22.441 8.16229 22.917 11H23V12C23 15.3137 20.3137 18 17 18H14V16H17C19.2091 16 21 14.2091 21 12C21 9.79086 19.2091 8 17 8H14V6Z" fill="black"/>
    <path d="M7 11L17 11V13L7 13V11Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'expand'" width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.00015 0.585693L0.585938 7.99991L8.00015 15.4141L9.41436 13.9999L3.41436 7.99991L9.41436 1.99991L8.00015 0.585693Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'restore'" width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.99985 15.4143L9.41406 8.00009L1.99985 0.585881L0.585634 2.00009L6.58564 8.00009L0.585635 14.0001L1.99985 15.4143Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'page'" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H11.4142L18 6.58579V22H0V0ZM2 2V20H16V8H10V2H2ZM12 3.41421L14.5858 6H12V3.41421Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'preview'" width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11 1.51569C9.56981 0.558586 7.8491 0 6 0C3.87259 0 1.91514 0.739382 0.37453 1.97438L0 2.27462V19.0879L1.62547 17.7849C2.82406 16.8241 4.34362 16.25 6 16.25C7.65638 16.25 9.17594 16.8241 10.3745 17.7849L11 18.2863L11.6255 17.7849C12.8241 16.8241 14.3436 16.25 16 16.25C17.6564 16.25 19.1759 16.8241 20.3745 17.7849L22 19.0879V2.27462L21.6255 1.97438C20.0849 0.739382 18.1274 0 16 0C14.1509 0 12.4302 0.558586 11 1.51569ZM2 3.25457V15.1858C3.20526 14.5869 4.56391 14.25 6 14.25C7.43609 14.25 8.79474 14.5869 10 15.1858V3.25457C8.8662 2.46348 7.48833 2 6 2C4.51167 2 3.1338 2.46348 2 3.25457ZM12 3.25457V15.1858C13.2053 14.5869 14.5639 14.25 16 14.25C17.4361 14.25 18.7947 14.5869 20 15.1858V3.25457C18.8662 2.46348 17.4883 2 16 2C14.5117 2 13.1338 2.46348 12 3.25457Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'bold'" width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.1 6.79C10.07 6.12 10.75 5.02 10.75 4C10.75 1.74 9 0 6.75 0H0.5V14H7.54C9.63 14 11.25 12.3 11.25 10.21C11.25 8.69 10.39 7.39 9.1 6.79ZM3.5 2.5H6.5C7.33 2.5 8 3.17 8 4C8 4.83 7.33 5.5 6.5 5.5H3.5V2.5ZM7 11.5H3.5V8.5H7C7.83 8.5 8.5 9.17 8.5 10C8.5 10.83 7.83 11.5 7 11.5Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'italic'" width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 0V3H6.71L3.29 11H0.5V14H8.5V11H6.29L9.71 3H12.5V0H4.5Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'unordered-list'" width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 6.5C0.67 6.5 0 7.17 0 8C0 8.83 0.67 9.5 1.5 9.5C2.33 9.5 3 8.83 3 8C3 7.17 2.33 6.5 1.5 6.5ZM1.5 0.5C0.67 0.5 0 1.17 0 2C0 2.83 0.67 3.5 1.5 3.5C2.33 3.5 3 2.83 3 2C3 1.17 2.33 0.5 1.5 0.5ZM1.5 12.5C0.67 12.5 0 13.18 0 14C0 14.82 0.68 15.5 1.5 15.5C2.32 15.5 3 14.82 3 14C3 13.18 2.33 12.5 1.5 12.5ZM4.5 15H18.5V13H4.5V15ZM4.5 9H18.5V7H4.5V9ZM4.5 1V3H18.5V1H4.5Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'ordered-list'" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.5 13H2.5V13.5H1.5V14.5H2.5V15H0.5V16H3.5V12H0.5V13ZM1.5 4H2.5V0H0.5V1H1.5V4ZM0.5 7H2.3L0.5 9.1V10H3.5V9H1.7L3.5 6.9V6H0.5V7ZM5.5 1V3H19.5V1H5.5ZM5.5 15H19.5V13H5.5V15ZM5.5 9H19.5V7H5.5V9Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'diagram'" width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 0H22.5V8H6.5V15H10.5V12H22.5V20H10.5V17H4.5V8H0.5V0ZM12.5 18H20.5V14H12.5V18ZM2.5 2V6H20.5V2H2.5Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'asset'" width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.5 0V3H21.5V5H18.5V8H16.5V5H13.5V3H16.5V0H18.5Z" fill="black"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 1H11.5V3H2.5V16.5858L8.5 10.5858L12 14.0858L14.5 11.5858L18.5 15.5858V10H20.5V21H0.5V1ZM18.5 18.4142L14.5 14.4142L13.4142 15.5L16.9142 19H18.5V18.4142ZM14.0858 19L8.5 13.4142L2.91421 19H14.0858Z" fill="black"/>
  </svg>
  <svg v-else-if="name === 'dropdown'" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.91 0.589844L6.5 5.16984L11.09 0.589844L12.5 1.99984L6.5 7.99984L0.5 1.99984L1.91 0.589844Z" fill="black"/>
  </svg>
</template>

<script>
export default {
  props: ['name', 'size']
}
</script>
