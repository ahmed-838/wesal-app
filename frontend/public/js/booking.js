const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,  // عرض صورة واحدة فقط في المرة
    spaceBetween: 10,   // المسافة بين الصور
    navigation: {
        nextEl: '.swiper-button-next', // زر الانتقال للصورة التالية
        prevEl: '.swiper-button-prev'  // زر الانتقال للصورة السابقة
    },
    loop: true
});
