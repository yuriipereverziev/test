import { debounce } from "./helpers";
import { WIN } from "./constants";

const layout = (function () {
   "use strict";
   //#region Private methods
   let L = {
      WIN_WIDTH: 0
   };
   let SETTINGS = {
      afterResize: false,
      onInit: false
   };
   function getLayout() {
      const WIN_WIDTH = WIN.width();

      return { WIN_WIDTH };
   };
   function resizeHandler() {
      WIN.resize(
         debounce(function () {
            L = getLayout();
            if (SETTINGS.afterResize) {
               SETTINGS.afterResize(L);
            }
         }, 100)
      );
   };
   //#endregion

   return {
      //#region Public methods
      layoutHandler: function (settings) {
         if (settings) {
            SETTINGS = { ...SETTINGS, ...settings };
         }
         L = getLayout();
         if (SETTINGS.onInit) {
            SETTINGS.onInit(L);
         }
         resizeHandler();
      }
      //#endregion
   };
})();

export default layout;