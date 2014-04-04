// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page 3
     * @type {Form3}
     */
    App.Views.Form3 = App.Views.MasterView.extend({
        // Use the partials/form3.html view
        template: tpl('form3'),
        events: {
            // Click on the next button
            "click .btn-basic3": "passPage",
            // Click on the back button
            "click .back3": "back",
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
                App.Routers.Instances.router.navigate('form4', {trigger: true});
            } else {
                this.$("input.radio").toggleClass("blink");
            }
        },
        /**
         * Go back on the page 2
         */
        back: function() {
            App.Routers.Instances.router.navigate('form2', {trigger: true});
        }
    });


})(window, window.document, window.app || (window.app = {}));
