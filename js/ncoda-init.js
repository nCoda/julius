// ncoda-init.js
// Copyright 2015 Christopher Antila


// Remember not to use JSX in this file!
define(["/js/react/react.js", "ncoda/ncoda"], function(React, NCoda) {
    pypyjs.ready().then(function () {
        React.render(
            React.createElement(NCoda.NCoda),
            document.getElementById("ncoda"));
        }
    );
});
