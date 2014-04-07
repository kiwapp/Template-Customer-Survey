// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page Welcome
     * @type {Welcome}
     */
    App.Views.Welcome = App.Views.MasterView.extend({
        
        template: tpl('welcome'),
        events: {
            "click .welcome": "passPage"
        },
        /**
         * Go to the page 2 who is the first question of formulaire
         */
        passPage: function() {
            App.Routers.Instances.router.navigate('form1', {trigger: true});
        }

    });


})(window, window.document, window.app || (window.app = {}));
