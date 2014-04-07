// http://backbonejs.org/#Router
(function(win, doc, App) {

    /**
     * Router
     * @type {object}
     */
    App.Routers.Router = Backbone.Router.extend({
        /**
         * Declare all routes for the application
         */
        routes: {
            '': 'welcome',
            'form1': 'form1',
            'form2': 'form2',
            'form3': 'form3',
            'form4': 'form4',
            'form5': 'form5',
            'formEnd': 'formEnd',
            'tutorial': 'tutorial',
            '*path': 'redirect404' // ALWAYS MUST BE THE LAST ROUTE
        },
        /**
         * Router init
         */
        initialize: function() {
            window.addEventListener("webkitAnimationEnd", function(e) {

                if (e.target.className.indexOf("page") === 0)
                    $(e.target).toggleClass('transition-in');
                else
                    $(e.target).toggleClass('blink');

            });

            // Init all object (model and view) for he application
            App.Models.Instances.formModel = new App.Models.FormModel();
            App.Views.Instances.welcome = new App.Views.Welcome();
            App.Views.Instances.form1 = new App.Views.Form1(App.Models.Instances.formModel);
            App.Views.Instances.form2 = new App.Views.Form2(App.Models.Instances.formModel);
            App.Views.Instances.form3 = new App.Views.Form3(App.Models.Instances.formModel);
            App.Views.Instances.form4 = new App.Views.Form4(App.Models.Instances.formModel);
            App.Views.Instances.form5 = new App.Views.Form5(App.Models.Instances.formModel);
            App.Views.Instances.formEnd = new App.Views.FormEnd();

            Kiwapp.log("here, backbone router init !");
        },
        /**
         * Used before every action
         */
        before: function(page) {
            // If the page is the first (called root) and the history is clean
            if ('root' === page && Backbone.history.history.length > 1) {
                // And the Kiwapp session
                Kiwapp.session().end();
            }
            // Reset the interaction timeout
            win.resetTimeout();

            // Send the statistique 'page' with the page name to the kiwapp server
            Kiwapp.stats().page(page);
        },
        /**
         * Used after every action
         */
        after: function(page) {

            // I fthe page is the first (called root) we display the first page
            // And we start the kiwapp session
            if ('welcome' === page) {
                $(".welcome").toggleClass('transition-in');

                win.resetSyncTimeout();
                Kiwapp.session().start();
            }
            else {
                win.setTimeoutPage('', 60);
            }

            // Add the transition class (used for the fade in animation)
            $("." + page).toggleClass('transition-in');

        },
        /**
         * Render the first page (root)
         */
        welcome: function() {
            this.before('welcome');

            App.Views.Instances.welcome.render();

            this.after('welcome');
        },
        /**
         * Render the page two with the question one
         */
        form1: function() {
            this.before("form1");

            App.Views.Instances.form1.render();

            this.after("form1");
        },
        /**
         * Render the page three with the question two
         */
        form2: function() {
            this.before("form2");

            App.Views.Instances.form2.render();

            this.after("form2");
        },
        /**
         * Render the page four with the question three
         */
        form3: function() {
            this.before("form3");

            App.Views.Instances.form3.render();

            this.after("form3");
        },
        /**
         * Render the page five with the question four
         */
        form4: function() {
            this.before("form4");

            App.Views.Instances.form4.render();

            this.after("form4");
        },
        /**
         * Render the page six with the question five
         */
        form5: function() {
            this.before("form5");

            App.Views.Instances.form5.render();

            this.after("form5");
        },
         /**
         * Render the end page
         */
        formEnd: function() {
            this.before("formEnd");

            App.Views.Instances.formEnd.render();

            this.after("formEnd");
        },
        //=route=//

        /**
         * Used when a page isn't found
         */
        redirect404: function() {
            console.log('Oops, 404!');
        }

    });

})(window, window.document, window.app || (window.app = {}));
