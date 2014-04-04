// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page 7
     * @type {FormEnd}
     */
    App.Views.FormEnd = App.Views.MasterView.extend({
        // Use the partials/formend.html view
        template: tpl('formend'),
        events: {
            // Click on the next button
            'click .btn-basic6': 'passPage'
        },
        /**
         * Go to the next page
         */
        passPage: function() {
            App.Routers.Instances.router.navigate('tutorial', {trigger: true});
        },
        /**
         * Put a specific timeout on this page
         */
        afterRender: function() {
            win.setTimeoutPage('tutorial', 10);
        }
    });


})(window, window.document, window.app || (window.app = {}));
