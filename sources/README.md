Customer Survey
=================

# Kiwapp Backbone.js boilerplate

A boilerplate for **backbone.js**. From [Marrow](http://mdwn.in/gh/kud/marrow) and [Serval Backbone](https://github.com/dhoko/serval-backbone).

## How to install ?

### Requirements

- node.js
- npm
- bower

Ok, let's run : `npm install && bower install`

### Included:

- A structure
- A great compilation process via Gulp
- Templating via lodash
- Lo-Dash instead of underscore for performance!
- Kiwapp.js
- Normalize.css
- jQuery 2.1
- Moment.js
- An HTTP server
- pushState
- some helpers
- ... all you need to begin a great app and being happy

## Helpers

This application contains some helepers :

- `openPage(page,delay)`
- `resetTimeout()`
- `tpl()`

> You can view these helpers inside `src/js/bootstrap.js`.

## Some tips

```shell
.
├── GulpFile.js
├── README.md
├── .jshintrc
├── .editorconfig
├── .bowerrc
├── bower.json
├── build // final files
├── config // Application config
    └── kiwapp_config.js
├── package.json
└── src // where you code
    ├── layout // Your app layout (header,footer...)
    ├── partials // HTML partials
    ├── styles // Your css
    ├── assets // static files
    └── js // Your backbone app
        ├── app.js // $(document).ready
        ├── bootstrap.js
        ├── collections // http://backbonejs.org/#Collection
        ├── models // http://backbonejs.org/#Model
        ├── routers // http://backbonejs.org/#Router
        └── views // http://backbonejs.org/#View
```

## Config

Create a `kiwapp_config.js` inside the directory `config`

Ex :

```JavaScript
Kiwapp.set({
    appParameters : {
        deviceType : "webbrowser",
        osID : "webbrowser",
        deviceIdentifier : "Guillaume Chrome"
    },
    shopParameters : {
        shopParameters : {Class_Parse_name:"Customer-survey",
        X_Parse_Application_Id:"SsNc2beriSMghddtEc78DQ8B2GzpjOBI7Muqhjqh",
        X_Parse_REST_API_Key:"4nVYnxxI3wukGvGYgCUPo9YO4hBqpvjdlfBI2679"}
    },
    shopInfosConfig : {
        external_identifier : "1",
        address1 : "Your shop adress",
        zipcode : "your zipcode",
        phone : "your phone",
        name : "your name",
        country_id : 72, //FRANCE
        country_name : "fr"
    }
});
```


## Development

```shell
$ gulp
```

## Production

```shell
$ gulp prod
```

It build the zip, update your manifest and aslo generate your API documention for the application.


## Customization

### Webservice URL

Go to retails manager, select options of your app inside your app Set and write your Parse Rest-api-key, Application-id and Class name.
Or write url of your own server where you will send your form datas.

### Change Pictures

Put yours images in the folder **/images/**
For exemple
`02-question.png`
Your link in your css (**src/styles/style.css**) will be :

`.page2{
    background-image : url("../../images/02-question.png");
}`

### Change Wording

You can change the text in the file build/index.html

For exemple you can change the welcome message in the script balise <script type="text/template" id="formend-viewtpl"></script>
Replace the message "Thanks you for staying with us!" by "You are a amazing you customize this application !!!"

### Add a question

For adding a page :
 * Add his template in src/partial/
 * And his class view in src/js/views
 * Add his references in file src/js/router/router.js 

**For exemple if you want add a question 6  :**
 - Add new file in src/partial/
```html
    <button class="back back6">back</button>
    <div class="container-question-right">
        <p class = "N-question">question 6 / 6</p>
        <p class = 'question'>Good coffe?</p>
        <form>
            <label class = "label-radio-left 1star" for = 'radio-1-poor' >
                <span></span>
                <input class = "sprite radio" value = 'poor' type='radio' name = 'question-6' id = 'radio-1-poor'></input>
            </label>
            <label class = "label-radio-left 2star" for = 'radio-2-average' >
                <span></span>
                <input class = "sprite radio" value = 'average' type='radio' name = 'question-6' id = 'radio-2-average' ></input>
            </label>
            <label class = "label-radio-left 3star" for = 'radio-3-good' >
                <span></span>
                <input class = "sprite radio " value = 'good' type='radio' name = 'question-6' id= 'radio-3-good' = ></input>
            </label>
            <label class = "label-radio-left 4star" for = 'radio-4-excellent' >
                <span></span>
                <input class = "sprite radio" value = 'excellent' type='radio' name = 'question-6' id = 'radio-4-excellent'></input>
            </label>
        </form>
        <button class="btn-basic6 btn-basic">next</button>
    </div>
</div>
```

1- Add the new route in routes : {}

2- Add in src/js/router/router.js the router method after form5:function() :
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
3- Create new view class
```javascript
// http://backbonejs.org/#View
(function(win, doc, App) {

    /**
     * The backview for the page 6
     * @type {Page6}
     */
    App.Views.Form6 = App.Views.MasterView.extend({
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
    App.Views.Form6 = App.Views.MasterView.extend({
        // Use the partials/form6.html view
        template: tpl('form6'),
        events: {
            // Click on the next button
            "click .btn-basic6": "passPage",
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

5- Add new line inside src/js/models/form.js :

 add new value inside defaults object with this key name : `question_6` 

```javascript
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
            "question_5": "",
            "question_6": ""
        }
```

5- Don't forget to instantiate inside src/js/routers/router.js :
 
 inside Initialize function add you new view instance and pass your model to your view.

```javascript
    App.Views.Instances.form6 = new App.Views.Form6(App.Models.Instances.formModel);
```
