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

            // There it is, we bind events to the view.
            // this.delegateEvents();

            this.afterRender();
            return this;
        
             // Find a custom context for your view

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
