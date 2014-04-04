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
                        end:"Text end: customize go to http://retail.kiwapp.com/",
                    };
                    console.log(defaults_values,Kiwapp.get().shopParameters)
            var object = _.extend(defaults_values,Kiwapp.get().shopParameters);
            if(object.Class_Parse_name===""||object.X_Parse_Application_Id===""||object.X_Parse_REST_API_Key===""){
                Kiwapp.log('please go to manager and write url, X_Parse_REST_API_Key and X_Parse_Application_Id for send data to your Parse account');
            }
            // test if '-' are presents inside Parse classe name and replace by a '_' cause parse does'nt understand '-' inside url name.
            object.Class_Parse_name = object.Class_Parse_name.replace("-","_");

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
