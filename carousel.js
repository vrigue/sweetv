$(document).ready(function () {
    $('.carousel').slick({
        arrows: true,
        dots: true,
        infinite: true,
        speed: 1600,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 6000,
        slidesToShow: 1,
        slidesToScroll: 1
    });
});