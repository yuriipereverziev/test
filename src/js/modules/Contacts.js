const Contacts = (function () {

    return {
        submitContacts: function () {
            $(".js-order-form").on("submit", function (event) {
                event.stopPropagation();
                event.preventDefault();

                let form = this,
                    submit = $(".submit", form),
                    data = new FormData();

                const name = document.querySelector('[name="name"]')
                const phone = document.querySelector('[name="phone"]')
                const text = document.querySelector('[name="comment"]')
                const email = document.querySelector('[name="email"]')


                data.append("name", $('[name="name"]', form).val());
                data.append("phone", $('[name="phone"]', form).val());
                text ? data.append("text", $('[name="comment"]', form).val()) : false
                email ? data.append("email", $('[name="email"]', form).val()) : false
                data.append("company", 'Naturallic');

                function getContactsValidStats() {
                    function isNameValid(name) {
                        return name.value.trim().length >= 5
                    }
                    function isPhoneValid(phone) {
                        return phone.value.trim().length >= 8
                    }
                    function isCommentValid(text) {
                        return text ? text.value.trim().length >= 1 : true
                    }
                    function isEmailValid(email) {
                        return email ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email.value.trim()) : true
                    }

                    return {
                        name: isNameValid(name),
                        phone: isPhoneValid(phone),
                        text: isCommentValid(text),
                        email: isEmailValid(email)
                    }
                }

                function removeInputErrors() {
                    name ? name.classList.remove('valid-err') : false
                    phone ? phone.classList.remove('valid-err') : false
                    text ? text.classList.remove('valid-err') : false
                    email ? email.classList.remove('valid-err') : false
                }

                function sendContactsMessage() {
                    $.ajax({
                        url: "ajax.php",
                        type: "POST",
                        data: data,
                        cache: false,
                        dataType: "json",
                        processData: false,
                        contentType: false,
                        xhr: function () {
                            let myXhr = $.ajaxSettings.xhr();

                            if (myXhr.upload) {
                                myXhr.upload.addEventListener(
                                    "progress",
                                    function (e) {
                                        if (e.lengthComputable) {
                                            let percentage = (e.loaded / e.total) * 100;
                                            percentage = percentage.toFixed(0);
                                            $(".submit", form).html(percentage + "%");
                                        }
                                    },
                                    false
                                );
                            }

                            return myXhr;
                        },
                        error: function (jqXHR, textStatus) {
                            $("input, textarea, button", form).removeAttr("disabled");
                            // Тут выводим ошибку
                        },
                        complete: function () {
                            // Тут можем что-то делать ПОСЛЕ успешной отправки формы
                            $(".js-content-form").hide();
                            $(".popup__title--main").hide();
                            $(".js-success-form").show();
                        },
                    });
                }

                const fieldsStats = getContactsValidStats()
                const isFormValid = Object.values(fieldsStats).every(field => field === true)

                if (isFormValid) {
                    $(".submit", form).val("Отправка...");
                    $("input, textarea, button", form).attr("disabled", "");
                    removeInputErrors()
                    sendContactsMessage()
                } else {
                    removeInputErrors()
                    name && !fieldsStats.name ? name.classList.add('valid-err') : false
                    phone && !fieldsStats.phone ? phone.classList.add('valid-err') : false
                    text && !fieldsStats.text ? text.classList.add('valid-err') : false
                    email && !fieldsStats.email ? email.classList.add('valid-err') : false
                }
                return false;
            });
        },
        init: function () {
            Contacts.submitContacts()
        },
    };
})();

export default Contacts;




// const Contacts = (function () {
//   "use strict";
//   const form = $(".js-order-form");

//   return {
//     submitForm: function () {
//       form.submit(function (e) {
//         e.preventDefault();
//         $.ajax({
//           url: "../submit.php",
//           type: "POST",
//           contentType: false,
//           processData: false,
//           data: new FormData(this),
//           success: function success(data) {
//             $(".js-content-form").hide();
//             $(".popup__title--main").hide();
//             $(".js-success-form").show();

//             console.log("success");
//           },
//           error: function () {
//             console.log("error");
//           },
//         });
//       });
//     },
//     init: function () {
//       Contacts.submitForm();
//     },
//   };
// })();

// export default Contacts;
