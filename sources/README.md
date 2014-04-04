Customer Survey
=================

## Customization

### Webservice URL

In the file **build/js/app.js**
Go At :  App.Models.FormModel
And Remplace the url by your in url param

``` Kiwapp.session().store(json, {
                        url: "{{PUT YOUR OWN URL HERE}}",
                        method: "POST"
                    }).send();```

### Change Pictures

Put yours images in the folder **src/assets/images/**
For exemple
`02-question.png`
Your link in your css (**build/styles/style.css**) will be :

`.page2{
    background-image : url("../assets/images/02-question.png");
}`

### Change Wording

You can change the text in the file build/index.html

For exemple you can change the welcome message in the script balise <script type="text/template" id="formend-viewtpl"></script>
Replace the message "Thanks you for staying with us!" by "You are a amazing you customize this application !!!"

### Add a question

For adding a page :
 * Add his template in build/index.html in <script type="text/template" id="xxx">template</script>
 * And his class view in build/js/app.js
 * Add his references in file build/js/app.js in router class

**For exemple if you want add a question 6  :**
 - Add the following lines in build/index.html
```html
<script type="text/template" id="form6-viewtpl"><div class = "pages form6">
    <button class="back back6">back</button>
    <div class="container-question-right">
        <p class = "N-question">question 6 / 6</p>
        <p class = 'question'>Good coffe?</p>
        <form>
            <label class = "label-radio-left 1star" for = 'radio-1-poor' >
                <span></span>
                <input class = "sprite radio" value = 'poor' type='radio' name = 'question-4' id = 'radio-1-poor'></input>
            </label>
            <label class = "label-radio-left 2star" for = 'radio-2-average' >
                <span></span>
                <input class = "sprite radio" value = 'average' type='radio' name = 'question-4' id = 'radio-2-average' ></input>
            </label>
            <label class = "label-radio-left 3star" for = 'radio-3-good' >
                <span></span>
                <input class = "sprite radio " value = 'good' type='radio' name = 'question-4' id= 'radio-3-good' = ></input>
            </label>
            <label class = "label-radio-left 4star" for = 'radio-4-excellent' >
                <span></span>
                <input class = "sprite radio" value = 'excellent' type='radio' name = 'question-4' id = 'radio-4-excellent'></input>
            </label>
        </form>
        <button class="btn-basic5 btn-basic">next</button>
    </div>
</div></script>
```

 - Dans le fichier build/js/app.js in App.Models.FormModel = Backbone.Model.extend({});

1- Add the new route in routes : {}
2- Add the router method after form5:function() :
```javascript
/**
         * Render the page six with the question five
         */
        form6: function() {
            this.before("form6");

            App.Views.Instances.form6.render();

            this.after("form6");
        },
```
3- After the class
```javascript
// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page 6
     * @type {Page6}
     */
    App.Views.Form5 = App.Views.MasterView.extend({
    });

})(window, window.document, window.app || (window.app = {}));
```

4- Add the following lines :
```javascript
(function(win, doc, App) {

    /**
     * The backview for the page 6
     * @type {Page6}
     */
    App.Views.Form5 = App.Views.MasterView.extend({
        // Use the partials/form6.html view
        template: tpl('form6'),
        events: {
            // Click on the next button
            "click .btn-basic3": "passPage",
            // Click on the back button
            "click .back6": "back",
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
            // Go to the page 7
            App.Routers.Instances.router.navigate('formEnd', {trigger: true});

        },
        /**
         * Go back on the page 5
         */
        back: function() {
            App.Routers.Instances.router.navigate('form5', {trigger: true});
        }
    });


})(window, window.document, window.app || (window.app = {}));
```

### Remove required field
Go in build/js/app.js

En remove the test
```
if (this.testForm()) {

}
```
 For exemple :
in the class
```
App.Views.Form4 = App.Views.MasterView.extend({

});
```

in the method
```
passPage: function() {

}
```

