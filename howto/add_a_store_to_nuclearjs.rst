How to Add a Store to NuclearJS
===============================

NuclearJS manages state (data) for Julius. When you want to add something to NuclearJS, you must
follow this admittedly complicated and convoluted procedure. I'll try to make it easier in the
future, somehow. Sorry!


1. Find the module the Store belongs in, or maybe make a new one.
1. Start writing in the Store, then
1. In the "signals" module, define the signals the Store will listen to, then
1. Go back to the Store module and write the "on" updating function. NOTE: this function should
   verify its input.
1. go to "ncoda-init.js" and:
   1. Import the module, if it isn't already.
   1. Add the new Store to the reactor.registerStores() call.
1. Go to "getters.js" and add a getter with the name with which the Store is registered.
1. Go to "signals.js" and:
   1. Add a signal in "names."
   1. Add a function that calls it to "emitters."
1. Go to the component that uses the state, and:
   1. add "mixins: [reactor.ReactMixin]"
   1. add a getDataBindings() function that returns an object like this:
      ``{partsList: getters.listOfInstruments}`` such that "this.state.partsList" will hold what
      "listOfInstruments" getter gets
