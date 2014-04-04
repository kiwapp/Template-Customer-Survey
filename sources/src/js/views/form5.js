// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page 5
     * @type {Form5}
     */
    App.Views.Form5 = App.Views.MasterView.extend({
        // Use the partials/form5.html view
        template: tpl('form5'),
        events: {
            // Click on the next button
            "click .btn-basic5": "passPage",
            // Click on the back button
            "click .back5": "back",
            // Click on the screen
            "click #wrapper": "resetTimeOutInteract",
            // Save the input's value in the model
            "change textarea": "changed"
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
            // Force the sync of the model with the backend
            this.model.sync();
            // Go to the end of form
            App.Routers.Instances.router.navigate('formEnd', {trigger: true});

        },
        /**
         * Go back on the page 4
         */
        back: function() {
            App.Routers.Instances.router.navigate('form4', {trigger: true});
        }
    });


})(window, window.document, window.app || (window.app = {}));
