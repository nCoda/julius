// ncoda-init.js
// Copyright 2015 Christopher Antila


requirejs.config({
    paths :{
        jquery: "/js/jquery/jquery.min-2.1.1",
        jqconsole: "/js/jquery/jqconsole-2.11.0.min",
    }
})

// Remember not to use JSX in this file!
define(["/js/react/react.js", "ncoda/ncoda"], function(React, NCoda) {
    pypyjs.ready().then(function () {
        React.render(
            React.createElement(NCoda.NCoda),
            document.getElementById("ncoda"));
        }
    );
});
