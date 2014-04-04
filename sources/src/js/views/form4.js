// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page 4
     * @type {Form4}
     */
    App.Views.Form4 = App.Views.MasterView.extend({
        // Use the partials/form4.html view
        template: tpl('form4'),
        events: {
            // Click on the next button
            "click .btn-basic4": "passPage",
            // Click on the back button
            "click .back4": "back",
            // Click on the screen
            "click #wrapper": "resetTimeOutInteract",
            // Save the input's value in the model
            "change input": "changed"
        },
        /**
         * Initialize the view this the form model
         * @param {FormModel} model
         */
        initialize: function(model) {
            this.model = model;
        },
        /**
         * Change to the next page
         */
        passPage: function() {
            // Test if a response have setted
            if (this.testForm()) {
                App.Routers.Instances.router.navigate('form5', {trigger: true});
            } else {
                this.$("input.radio").toggleClass("blink");
            }
        },
        /**
         * Go back on the page 3
         */
        back: function() {
            App.Routers.Instances.router.navigate('form3', {trigger: true});
        }
    });


})(window, window.document, window.app || (window.app = {}));
