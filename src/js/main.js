// Main JS module
// objectFitImages polyfill
import objectFitImages from "object-fit-images";
import Sliders from "./modules/Sliders";
import Controls from "./modules/Controls";
import Popup from "./modules/Popup";
import Menu from "./modules/Menu";
import Order from "./modules/Order";
import layout from "./global/layout";
import Contacts from "./modules/Contacts";

$(function () {
  var year = new Date().getFullYear();
  var placeY = document.getElementsByClassName("year");
  for (let i = 0; i < placeY.length; i++) {
    var elemY = placeY[i];
    elemY.innerHTML = year;
  }

  Sliders.init();
  Controls.init();
  Popup.init();
  Menu.init();
  Order.init()
  Contacts.init()

  objectFitImages();

  layout.layoutHandler({
    onInit: (layout) => {
      Sliders.initProductSlider();
      if (layout.WIN_WIDTH >= 768) {
        Sliders.initProductsSlider();
      } else if (layout.WIN_WIDTH <= 767) {
        Sliders.destroyProductsSlider();
      }
    },

    afterResize: (layout) => {
      Sliders.initProductSlider();
      if (layout.WIN_WIDTH >= 768) {
        Sliders.initProductsSlider();
      } else if (layout.WIN_WIDTH <= 767) {
        Sliders.destroyProductsSlider();
      }
    },
  });
});
