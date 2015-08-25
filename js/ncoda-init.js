// ncoda-init.js
// Copyright 2015 Christopher Antila


requirejs.config({
    paths: {
        jquery: "/js/jquery/jquery.min-2.1.1",
        jqconsole: "/js/jquery/jqconsole-2.11.0.min",
    }
});


// Remember not to use JSX in this file!
define(["/js/react/react.js", "ncoda/ncoda"], function(React, NCoda) {

    var renderNCoda = function(params) {
        // The top-level function to render nCoda with React.
        //
        // @param params (object): With all the props that might be sent to the NCoda component.
        //     - meiForVerovio (string): an MEI file that Verovio will render
        //
        // This function can be called from Python:
        // >>> import js
        // >>> js.globals['renderNCoda']()

        // prepare the props
        var props = {
            meiForVerovio: ""
        };

        if (undefined !== params) {
            if (params.meiForVerovio) {
                props.meiForVerovio = params.meiForVerovio;
            }
        }

        // do the render
        React.render(
            React.createElement(NCoda.NCoda, props),
            document.getElementById("ncoda")
        );
    };

    // initial rendering on load
    pypyjs.ready().then(renderNCoda);

    // Set the renderNCoda function so it can be used by anyone. But set it now, so that it's not
    // available for others (to mess up) until after the initial rendering.
    window["renderNCoda"] = renderNCoda;
});
