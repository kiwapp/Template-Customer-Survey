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

