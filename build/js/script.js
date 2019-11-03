"use strict";

(function () {
  var TIME_OUT = 1100;

  var mainSliderContainer = document.querySelector('.slider__element--main');
  var sliderControlNextElement = document.querySelector('.slider__control--next');
  var thumbsSliderImg = document.querySelector('.slider__image');
  var animationClass = ('js-add-animation');
  var sliderControlClass = ('slider__control');
  var sliderWrapperClass = ('slider__element-wrapper');
  var slideClass = ('slider__slide');
  var sliderControlNextClass = ('.slider__control--next');
  var sliderControlPrevClass = ('.slider__control--prev');

  var mainSlider = new window.Swiper(mainSliderContainer, {
    slidesPerView: 1,
    spaceBetween: 2,
    loop: true,
    speed: 1000,
    allowTouchMove: false,
    wrapperClass: sliderWrapperClass,
    slideClass: slideClass,
    navigation: {
      nextEl: sliderControlNextClass,
      prevEl: sliderControlPrevClass,
    }
  });

  var addAnimationClass = function (element) {
    element.classList.add(animationClass);
  };

  var removeAnimationClass = function (element) {
    element.classList.remove(animationClass);
  };

  var getAnimationEndImgHandler = function (element) {

    element.addEventListener('animationend', function () {
      removeAnimationClass(element);
    });
  };

  var getNewImg = function (src, alt) {
    thumbsSliderImg.src = src;
    thumbsSliderImg.alt = alt;
    addAnimationClass(thumbsSliderImg);
  };

  var getTimeOut = function (src, alt) {

    setTimeout(function () {
      getNewImg(src, alt);
    }, TIME_OUT);
  };

  var getTargetIndex = function (evt) {
    var index;

    if (evt.target === sliderControlNextElement) {
      index = mainSlider.activeIndex - 1;
    } else {
      index = mainSlider.activeIndex + 1;
    }

    return index;
  };

  document.addEventListener('click', function (evt) {
    var target = evt.target.classList.contains(sliderControlClass);

    if (target) {
      var src = mainSlider.slides[getTargetIndex(evt)].querySelector('img').src;
      var alt = mainSlider.slides[getTargetIndex(evt)].querySelector('img').alt;

      getTimeOut(src, alt);
      getAnimationEndImgHandler(thumbsSliderImg);
    }
  });
})();
