// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page 2
     * @type {Form2}
     */
    App.Views.Form2 = App.Views.MasterView.extend({
        // Use the partials/form2.html view
        template: tpl('form2'),
        events: {
            // Click on the next button
            "click .btn-basic2": "passPage",
            // Click on the back button
            "click .back2": "back",
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
                // Change to the page 3
                App.Routers.Instances.router.navigate('form3', {trigger: true});
            } else {
                // Blink on the radio element
                this.$("input.radio").toggleClass("blink");
            }
        },
        /**
         * Go back on the page 1
         */
        back: function() {
            App.Routers.Instances.router.navigate('form1', {trigger: true});
        }
    });


})(window, window.document, window.app || (window.app = {}));
