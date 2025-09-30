import {productsInfo} from "../data/productInfo";

const Order = (function () {
    "use strict";

    const buttonPromocode = $(".js-button-promocode");
    const inputPromocode = $(".js-input-promocode");

    const productResidue = $(".js-product-residue");
    const inputChatbotHistory = $(`input[name="chatbot_history"]`);

    function updValueChatbotHistory() {
        inputChatbotHistory.val(JSON.stringify(data));
    }

    function prettify(num) {
        var n = num.toString();
        return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ");
    }

    let data = [];
    let count = 1;

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function randomInteger(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    return {
        submitForm: function () {
            $("#order-form").submit(function (e) {
                // e.preventDefault();

                $(`input[name='count']`).val(count);

                const dataForm = $(this).find("input.js-data").serializeArray();
                const [...object] = dataForm.map(function (item) {
                    return {
                        answer: item.value,
                        question: item.name,
                    };
                });
                data.push(...object);

                updValueChatbotHistory();
            });
        },
        createOrderForm: function () {
            const productName = getParameterByName("id");
            const productNameUnderscore = String(productName).split('-').join('_')
            const prodNameWithSpaces = String(productName).split('-').join(' ')
            const currentLangLower = localStorage.getItem('localization') ? localStorage.getItem('localization').toLowerCase() : false
            // console.log(productNameUnderscore);

            if (productName) {
                const countryCode = $(`input[name='country_code']`);
                countryCode.val(currentLangLower.toUpperCase());
                // console.log(countryCode);

                const orderForm = document.querySelector('#order-form')

                const productData = productsInfo[currentLangLower][productNameUnderscore]
                const imgModifier = productData?.modifier

                // const formData = formSetting[productData.company]

                if (orderForm) {
                    // const body = document.querySelector('body')
                    // const script = document.createElement('script')
                    // const scriptFirst = document.createElement('script')
                    //
                    // const startScript = `
                    //     window.lang = '${currentLangLower}';
                    //     window.country_code = '${currentLangLower.toUpperCase()}';
                    //     window.is_downloaded_from_dashboard = true;
                    //     window._locations = [{"offer_id":"1016","country_code":"CZ","price_current":0.01,"display_priority":2,"id":3077311,"name":"Czech Republic","type":"country","country_id":3077311,"region_name":null,"currency":"czk","country_name":"Czech Republic","price_previous":1,"price_delivery":0,"price_total":0.01},{"offer_id":"1016","country_code":"RO","price_current":0.01,"display_priority":4,"id":798549,"name":"Romania","type":"country","country_id":798549,"region_name":null,"currency":"ron","country_name":"Romania","price_previous":1,"price_delivery":0,"price_total":0.01},{"offer_id":"1016","country_code":"HU","price_current":0.01,"display_priority":3,"id":719819,"name":"Hungary","type":"country","country_id":719819,"region_name":null,"currency":"Ft","country_name":"Hungary","price_previous":20600,"price_delivery":0,"price_total":0.01},{"offer_id":"1016","country_code":"IT","price_current":0.01,"display_priority":1,"id":3175395,"name":"Italy","type":"country","country_id":3175395,"region_name":null,"currency":"€","country_name":"Italy","price_previous":78,"price_delivery":0,"price_total":0.01},{"offer_id":"1016","country_code":"CL","price_current":0.01,"display_priority":0,"id":3895114,"name":"Chile","type":"country","country_id":3895114,"region_name":null,"currency":"clp","country_name":"Chile","price_previous":1,"price_delivery":0,"price_total":0.01}];
                    //     window.additional_phone_in_downloaded = false;
                    //     window.is_namephone_validated = true;
                    //     window.back_button_enabled = true;
                    // `

                    // orderForm.setAttribute('action', String(formData.formAction))
                    // scriptFirst.textContent = startScript
                    // script.textContent = formData.formSendScript
                    // body.appendChild(scriptFirst)
                    // body.appendChild(script)
                }

                // console.log(productName);
                const productInfo = productsInfo[`${localStorage.getItem('localization')}`][`${productNameUnderscore}`];
                const productNewPrice = productInfo.newPrice;

                $(".js-product-name").html(prodNameWithSpaces);
                $(".js-product-photo").attr("src", `../img/${productName}.png`);
                imgModifier ? $(".order-block__product").addClass(imgModifier) : false
                $(".js-price-product").html(productNewPrice);

                $(`input[name='price']`).val(productData.newPrice);

                $(`input[name='campaign_id']`).val(productData.campaign_id);
                $(`input[name='redirect_url']`).val(`success.html?id=${productName}`);
                $(`input[name='product']`).val(`${productData.productName}`);
                $(`input[name='niche']`).val(productData.niche);
                $(`input[name='country']`).val(productData.country);
                $(`input[name='lang']`).val(currentLangLower);
                // window.addEventListener('load', () => $(`input[name='country_code']`).val(`${currentLangLower.toUpperCase()}`))

            }
        },
        choiceCountProduct: function () {
            $(".js-counter-arrow-inc").click(function (e) {
                e.preventDefault();
                count += 1;
                if (count > 20) {
                    count = 20;
                }
                $(".js-counter-number").html(count);

                const valueSale = $(".js-sale-product").text();

                if (Number(valueSale.replace(/\s/g, "")) > 0) {
                    Order.calcSaleProduct();
                }
                Order.calcOrderProduct(count);
            });
            $(".js-counter-arrow-dec").click(function (e) {
                e.preventDefault();
                count -= 1;
                if (count <= 1) {
                    count = 1;
                }
                $(".js-counter-number").html(count);

                const valueSale = $(".js-sale-product").text();

                if (Number(valueSale.replace(/\s/g, "")) > 0) {
                    Order.calcSaleProduct();
                }
                Order.calcOrderProduct(count);
            });
        },
        calcSaleProduct: function () {
            const productName = getParameterByName("id");
            // const productInfo = info[`${productName}`];
            const productInfo = productsInfo[`${localStorage.getItem('localization')}`][`${productName}`]
            const productNewPrice = Number(productInfo.newPrice.replace(/\s/g, ""));
            const productSalePrice = Number(productInfo.salePrice.replace(/\s/g, ""));
            const saleProduct = productNewPrice - productSalePrice;
            $(".js-sale-product").html(prettify(saleProduct * count));
        },
        calcOrderProduct: function (count = 1) {
            const priceProduct = Number(
                $(".js-price-product").text().replace(/\s/g, "") * count
            );
            const saleProduct = Number(
                $(".js-sale-product").text().replace(/\s/g, "")
            );

            let priceOrder = 0;
            if (priceProduct >= saleProduct) {
                priceOrder = priceProduct - saleProduct;
            } else {
                priceOrder = saleProduct - priceProduct;
            }

            $(".js-price-order").html(prettify(priceOrder));

            //фіксуємо всю суму замовлення
            $(`input[name='count']`).val(count);
            $(`input[name='total-price']`).val(priceOrder);
        },
        validatePromocode: function (promocode) {
            buttonPromocode.click(function (e) {
                e.preventDefault();
                const valueInput = inputPromocode.val().trim();
                if (valueInput === promocode) {
                    inputPromocode.addClass("check");
                    inputPromocode.attr("readonly", true);
                    buttonPromocode.attr("disabled", true);
                    const productName = getParameterByName("id");
                    // const productInfo = info[`${productName}`];
                    const productInfo = productsInfo[`${localStorage.getItem('localization')}`][`${productName}`]
                    const productSalePrice = Number(
                        productInfo.salePrice.replace(/\s/g, "")
                    );
                    const productNewPrice = Number(
                        productInfo.newPrice.replace(/\s/g, "")
                    );

                    //Фіксуємо, що користувач увів правильний промокод
                    $(`input[name='discount-price']`).val(
                        productNewPrice - productSalePrice
                    );

                    const countProduct = $(".price-item .js-counter-number").text();
                    const saleProduct =
                        (productNewPrice - productSalePrice) * countProduct;

                    $(".js-sale-product").html(prettify(saleProduct));

                    Order.calcOrderProduct(countProduct);
                } else {
                    inputPromocode.addClass("error");
                }
            });
        },
        checkButtonActive: function () {
            inputPromocode.on("input", function () {
                const _this = $(this);
                const value = _this.val();
                if (value.length >= 1) {
                    buttonPromocode.attr("disabled", false);
                } else {
                    buttonPromocode.attr("disabled", true);
                }
            });
        },
        createSuccessPage: function () {
            const productName = getParameterByName("id");

            if (productName) {
                const productNameUnderscore = String(productName).split('-').join('_')
                const currentLangLower = localStorage.getItem('localization') ? localStorage.getItem('localization').toLowerCase() : false

                const productData = productsInfo[currentLangLower][productNameUnderscore]
                const imgModifier = productData?.modifier

                $(".js-success-product-name").html(productName);
                $(".js-success-product-photo").attr("src", `../img/${productName}.png`);


                imgModifier ? $(".js-success-product-photo").addClass(imgModifier) : false
            }
        },
        showResiudePack: function () {
            let max = 60;
            let min = 12;
            setInterval(() => {
                let difference = randomInteger(1, 6);
                max = max - difference;
                if (max <= min) {
                    return;
                }
                productResidue.html(max);
            }, 12000);
        },
        init: function () {
            Order.createOrderForm();
            Order.choiceCountProduct();
            Order.createSuccessPage();
            Order.submitForm();
            Order.calcOrderProduct();
            Order.validatePromocode('0JH343');
            Order.checkButtonActive();
            Order.showResiudePack();
            // Order.calcSaleProduct();
        },
    };
})();

export default Order;