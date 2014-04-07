(function(win, doc, App) {

    App.Models = {};
    App.Models.Instances = {};
    App.Collections = {};
    App.Collections.Instances = {};
    App.Views = {};
    App.Views.Instances = {};
    App.Routers = {};
    App.Routers.Instances = {};
    App.Events = {};

    win.tpl = function(view) {
        console.log(view);
        return _.template(document.getElementById(view + '-viewtpl').innerHTML);
    };


    win.appTimesout = [];
    win.syncTimesout = [];
    win.TIMEOUT_BEFORE_HOME = 50;

    // Custom template for lodash with {{}}
    _.templateSettings = {
        evaluate: /{{([\s\S]+?)}}/g,
        interpolate: /{{=([\s\S]+?)}}/g,
        escape: /{{-([\s\S]+?)}}/g
    };

    /**
     * To prevent Memory leak we must reset each timeout after they are triggered
     * It also prevent from bugs
     */
    win.resetTimeout = function() {
        if (win.appTimesout.length) {
            console.log('[App@Kiwapp] Reset timeout for ' + win.TIMEOUT_BEFORE_HOME + 's');
            win.appTimesout.forEach(function(item) {
                win.clearTimeout(item);
            });
        }

        win.setTimeoutPage();
    };

    win.resetSyncTimeout = function() {
        if (win.syncTimesout.length) {
            win.syncTimesout.forEach(function(item) {
                win.clearTimeout(item);
            });
        }
    };


    win.setTimeoutPage = function(page, delay) {

        page = page || '';
        delay = delay || win.TIMEOUT_BEFORE_HOME;

        var _page = (page.length) ? page : "root";

        console.log('[App@Kiwapp] Open page ' + _page + ' in ' + delay + 's');

        win.appTimesout.push(setTimeout(function() {
            App.Routers.Instances.router.navigate(page, {trigger: true});
        }, delay * 1000));
    };


})(window, window.document, window.app || (window.app = {}));

// http://backbonejs.org/#Model
(function(win, doc, App) {

    /**
     * The model for the formulaire
     * This model is filled by the views
     */
    App.Models.FormModel = Backbone.Model.extend({
        /**
         * The default params and values for this model
         */
        
        defaults: {
            "appName": "Customer-survey",
            "datetime": "",
            "question_1": "",
            "question_2": "",
            "question_3": "",
            "question_4": "",
            "question_5": ""
        },
        
        TemplatesContext: {},

        initialize : function(){
            // create a shopParameters reference.
            var defaults_values ={
                        introduction:"customize this text for your shop on the Retail Manager inside config app instance",
                        question_1:"Text question 1: customize this text for your shop on the Retail Manager",
                        question_2:"Text question 2: customize this text for your shop on the Retail Manager",
                        question_3:"Text question 3: customize this text for your shop on the Retail Manager",
                        question_4:"Text question 4: customize this text for your shop on the Retail Manager",
                        question_5:"Text question 5: customize this text for your shop on the Retail Manager",
                        end:"Text end: customize go to http://retail.kiwapp.com/"
                    };


            var object = _.extend(defaults_values,Kiwapp.get().shopParameters);
            
            if(object.Class_Parse_name===""||object.X_Parse_Application_Id===""||object.X_Parse_REST_API_Key===""){
                Kiwapp.log('please go to manager and write url, X_Parse_REST_API_Key and X_Parse_Application_Id for send data to your Parse account');
            
            // test if '-' are presents inside Parse classe name and replace by a '_' cause parse does'nt understand '-' inside url name.
            object.Class_Parse_name = object.Class_Parse_name.replace("-","_");
            }

           this.TemplatesContext = object;
        },
        /**
         * The validation method for the datas
         * @param {array} attrs the attributes to validate
         */
        validate: function(attrs) {
            var msg = {};
            ['name', 'surname', 'email', 'mobile'].forEach(function(input) {
                if (!attrs[input].length) {
                    msg[input] = "This field cannot be empty";
                }

                if ("email" === input && attrs.email.length) {
                    var email_filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                    if (!email_filter.test(attrs.email)) {
                        msg[input] = "It is not a valid email.";
                    }
                }
            });

            if (Object.keys(msg).length) {
                return msg;
            }
        },
        /**
         * Method for sync the model to the server
         */
        sync: function() {
                this.attributes.datetime = moment().format("HH:mm:ss MM-DD-YYYY");
                
                var json = this.toJSON();

                this.clear().set(this.defaults);

                // If there aren't we
                // store and send to Parse Api and/or to one customUrl and if we have no connexion to offline entries.
                // CF off line enties to documentation
                if(this.TemplatesContext.X_Parse_REST_API_Key!==""||
                this.TemplatesContext.X_Parse_Application_Id!==""||
                this.TemplatesContext.Class_Parse_name!==""){

                    $.ajax({
                                headers: {
                                            "X-Parse-REST-API-Key":this.TemplatesContext.X_Parse_REST_API_Key,
                                            "X-Parse-Application-Id":this.TemplatesContext.X_Parse_Application_Id,
                                            "Content-Type": "application/json"
                                        },
                                url: "https://api.parse.com/1/classes/"+this.TemplatesContext.Class_Parse_name+"/" ,
                                method: "POST",
                                data : JSON.stringify(json),
                                error : function(request,statusText,error){
                                    Kiwapp.log("Error Parse Post");
                                    Kiwapp.log(error+" "+statusText);
                                },
                                success : function(request,statusText,error){
                                    Kiwapp.log("SUCCESS Parse Post");
                                }

                            });

                }
                if(this.TemplatesContext.customUrl!==""){                
                    var conf ={
                                headers: {"Content-Type": "application/json"},
                                url: this.TemplatesContext.customUrl,
                                method: "POST"
                            };
                    
                    Kiwapp.session().store(json).send(conf);
                }
        }
    });

})(window, window.document, window.app || (window.app = {}));

// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * Root View
     * @type {object}
     */
    App.Views.MasterView = Backbone.View.extend({
        el: '#wrapper',
        template: "",
        events: {},
        /**
         * Abstract method
         */
        initialize: function() {

        },
        /**
         * Abstract method
         */
        passPage: function() {
            // NOTHING 
        },
        /**
         * Abstract method
         */
        beforeRender: function() {
            return App.Models.Instances.formModel.TemplatesContext;
        },
        /**
         * Abstract method
         */
        afterRender: function() {
            // NOTHING
        },
        /**
         * Render the view, this use the template who is overrided in all childs views
         * @returns {MasterView}
         */
         render: function () {
            // Find a custom context for your view
            var myContext = this.beforeRender();

            this.$el.html(this.template(myContext));

            this.afterRender();
            return this;
        },
        /**
         * Input values changed
         * @param {type} evt
         */
        changed: function(evt) {
            // When a value is changed we reset the timeout
            this.resetTimeOutInteract();
            var changed = evt.currentTarget;
            var value = $(evt.currentTarget).val();
            var obj = {};

            // We get the name of input and the value and we store it in the form
            obj[changed.name] = encodeURIComponent(value);
            this.model.set(obj);
        },
        /**
         * Test Radio checked
         */
        testForm: function() {
            return this.$("input[type='radio']").is(":checked");
        },
        /**
         * Reset the app timeout
         */
        resetTimeOutInteract: function() {
            win.resetTimeout();
        }

    });


})(window, window.document, window.app || (window.app = {}));

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
            App.Routers.Instances.router.navigate('', {trigger: true});
        },
        /**
         * Put a specific timeout on this page
         */
        afterRender: function() {
            win.setTimeoutPage('', 10);
        }
    });


})(window, window.document, window.app || (window.app = {}));

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

/**
 * This is where all begins
 */
(function(win, doc, App){

    var wrap = document.getElementById('wrapper');
        wrap.style.width     = window.innerWidth + "px";
        wrap.style.maxWidth  = window.innerWidth + "px";
        wrap.style.height    = window.innerHeight + "px";
        wrap.style.maxHeight = window.innerHeight + "px";

    var $doc = $(doc);

    $doc.ready(function() {
         var urlConfig = "../config/kiwapp_config.js";
        if(win.APP_DEBUG){
            urlConfig = "assets/kiwapp_config.js";
        }


        // Load the configuration for kiwapp (this configuration is generated is store on the device)
        Kiwapp(urlConfig, function() {
            // Notify to the drive Kiwapp application (iOS or Android) : The DOM is ready (so we remove the device loader)

            Kiwapp.ready();

            // Allow only landscape mode
            Kiwapp.driver().trigger('callApp', {call:'rotation', data:{
                "orientation" : 10
            }});
            // Create the main router
            App.Routers.Instances.router = new App.Routers.Router();
            // Start the history
            Backbone.history.start();
        });
    });

     


})(window, window.document, window.app || (window.app = {}));

