// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page 1
     * @type {Form1}
     */
    App.Views.Form1 = App.Views.MasterView.extend({
        // Use the partials/form1.html view
        template: tpl('form1'),
        events: {
            // Click on the next button
            'click .btn-basic1': 'passPage',
            // Click on the screen
            "click #wrapper": "resetTimeOutInteract",
            // Click on the button back
            "click .back1": "backHome",
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
                // Change to the page 2
                App.Routers.Instances.router.navigate('form2', {trigger: true});
            } else {
                // Blink on the radio element
                this.$("input.radio").toggleClass("blink");
            }
        },
        /**
         * Return to the home (previous page)
         */
        
        backHome: function() {
            App.Routers.Instances.router.navigate('', {trigger: true});
        }

    });


})(window, window.document, window.app || (window.app = {}));
