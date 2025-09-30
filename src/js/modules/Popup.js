import noScroll from "../global/noScroll";
const Popup = (function () {
  "use strict";
  const popUpBlock = $(".js-popup");
  const linkShowPopUp = $(".js-show-popup");
  const ButtonShowFramePopUp = $(".js-show-frame-popup");
  const framePopUpBlock = $(".js-frame-popup");
  const overlay = $(".js-overlay");
  return {
    addFramePopup: function (){
        if($('.js-show-frame-popup')){
          var link = $(".js-show-frame-popup").attr("data-src");
          var frame = document.createElement("iframe");
          frame.setAttribute("src", link)
          frame.classList.add("frame-popup__iframe");
          $('.frame-popup__content').append(frame)
        }
    },
    initFramePopup: function (){
      ButtonShowFramePopUp.click(function (e){
        framePopUpBlock.toggleClass("active");
        overlay.addClass("active");
        framePopUpBlock.removeClass("menu-mobile--active");
        $(".js-burger").removeClass("burger--active");
        noScroll.on();
      })
    },
    closeFramePopup: function () {
      $(".js-frame-close").click(function (e) {
        framePopUpBlock.removeClass("active");
        overlay.removeClass("active");
        noScroll.off();
      });
    },
    initPopUp: function () {
      linkShowPopUp.click(function (e) {
        e.preventDefault();
        const _this = $(this);
        const target = $(_this.data("target"));
        _this.toggleClass("active");
        target.toggleClass("active");
        overlay.addClass("active");
        $(".menu-mobile").removeClass("menu-mobile--active");
        $(".js-burger").removeClass("burger--active");
        noScroll.on();
      });
    },
    closePopup: function () {
      const popup = document.querySelector('.js-popup')

      popup.addEventListener('click', event => {
        const { target } = event
        const isOverlay = target.classList.contains('popup')

        if (isOverlay) {
          popUpBlock.removeClass("active");
          linkShowPopUp.removeClass("active");
          overlay.removeClass("active");
          noScroll.off();
        }
      })

      $(".js-close").click(function (e) {
        e.preventDefault();
        popUpBlock.removeClass("active");
        linkShowPopUp.removeClass("active");
        overlay.removeClass("active");
        noScroll.off();
      });
    },
    init: function () {
      Popup.addFramePopup();
      Popup.initPopUp();
      Popup.closePopup();
      Popup.initFramePopup();
      Popup.closeFramePopup();
    },
  };
})();

export default Popup;
