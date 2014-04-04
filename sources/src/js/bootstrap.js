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
