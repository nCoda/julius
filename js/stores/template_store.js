// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/template_store.js
// Purpose:                A template to use when writing new Redux stores for Julius.
//
// Copyright (C) 2017 Christopher Antila
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// ------------------------------------------------------------------------------------------------

// Template Documentation
// ----------------------
// Technically, Redux only uses one store. In practice, we talk about and treat the store as several
// discrete components. Each file in this "stores" directly can therefore roughly be understood as
// "one store," each of which consists of several parts described below.
//
// Our recommended strategy for understanding how Redux works:
// 1. Understand which store is responsible for what data.
// 2. Understand what the parts of the store do (actions, action types, etc.).
// 3. Assume that Redux takes care of connecting everything. I promise, it does!
//
// Important Note 1: A store's "actions" and "getters" are the store's public API. You should never
// change data in another store (instead use the target store's actions). You should never access
// data in another store (instead use that store's getters). However, it is *rarely* acceptable for
// one store to change its own state in response to the action type of another store.
//
// Important Note 2: A store must never import any other Julius module. No React components,
// nothing in "util," nothing from another Julius module (and ideally nothing except Immutable).
// This is because many other Julius modules import the Redux stores; if the stores in turn import
// Julius other modules then it often leads to circular imports (that surface as the wonderful
// error messages like "undefined is not a function" that make JavaScript great).
//
//
// Parts of the Store
// ------------------
// In each store file, some or all of the following parts will appear. Please keep this order of
// parts. The examples are for an imaginary store about hot dogs. The store has bugs, may lead to
// inconsistent data, and is not complete... it's just an example, okay?
//
//
// Description of the State: "hotdogs" Store
// -----------------------------------------
//
// Very important---describe the "shape" of this store's state (data). In Julius we will use
// ImmutableJS Map and List objects to the fullest extent possible, rather than plain JavaScript
// object and array instances. It should look something like this example. Note that, for proper
// syntax highlighting in many text editors, you must use /** to start the following comment.

/**
 * Root Store
 * ----------
 * @param {number} nr_uncooked_weiners - The number of uncooked weiners available.
 * @param {number} nr_cooked_weiners - The number of cooked weiners available.
 * @param {bool} requested_more - Whether we sent an API request for more weiners.
 * @param {ImmutableMap} condiments - See below.
 * @param {string} error - If present, this is an error message to show the user.
 *
 * Condiment Map
 * -------------
 * For elements in the the "condiments" Map in the root store. The condiment "name" is also its
 * key in the "condiments" Map of the root store.
 * @param {string} name
 * @param {number} servings_left
 */


// Action types.
//
// Required, called "types." Plain JavaScript object. Members are named in all
// capitals, and they correspond to an action that can be done to the store. Each member is
// assigned a string that describes the action in a human-readable way, providing enough context
// to understand the action without knowing what store it's from. By themselves, action types
// don't do anything, but they are used by "actions" when something will definitely change the
// data in the store.

export const types = {
    COOK: 'cook a hot dog',
    EAT: 'eat hot dogs',

    APPLY_CONDIMENT: 'apply a condiment',

    REQUEST_WEINERS: 'ask API for more weiners',
    RECEIVE_WEINERS: 'receive more weiners',
};



// Actions.
//
// Required. Plain JavaScript object. Members are functions that either cause, or may cause,
// something to happen. If an action function produces a change to the store, this happens with
// a call to store.dispatch(), which is given one argument, a Flux Standard Action (documented
// https://github.com/acdlite/flux-standard-action although we are not using the library). Actions
// will not usually return anything unless the action is asynchronous with a Promise, in which case
// the Promise is returned so the action's caller knows when the action has completed.

export const actions = {
    eatOne() {
        // Just a convenience; this action by itself doesn't do anything.
        actions.eatMany(1);
    },

    eatMany(howMany) {
        // Checks if we have enough hot dogs to eat the required number. Notice how an action is
        // dispatched either way, but the reducer will do something different depending on whether
        // the "error" member is there.
        if (store.getState().hotdogs.get('nr_cooked_weiners') >= howMany) {
            store.dispatch({type: types.EAT, payload: howMany});
        }
        else {
            store.dispatch({type: types.EAT, payload: 'Not enough cooked hot dogs.', error: true});
        }
    },

    cook(howMany) {
        // Uses an imaginary, external "bbq" store. Doesn't dispatch an action directly.
        const theStore = store.getState();
        // Notice how we're using the "bbq" store's getter rather than accessing the store directly.
        if (bbqGetters.isStarted(theStore)) {
            if (theStore.hotdogs.get('nr_uncooked_weiners') >= howMany) {
                // No idea what the barbecue does next... but eventually we finishCooking()
                bbqActions.cook(howMany);
            }
        }
    },

    finishCooking(howMany) {
        // We imagine that bbqActions.cook() will call this function when cooking is finished.
        //
        // Sometimes, an action function is so simple that it's tempting to cut out the action
        // function entirely. In this case, you could even dispatch types.COOK from the "bbq" store.
        //
        // Don't do it!
        store.dispatch({type: types.COOK, payload: howMany});
    },

    applyCondiment(whichOne) {
        // Let's say it takes a remote API call to apply condiments, and the API returns a Promise.
        // Note that the Promise is also returned, just in case this function's caller wants to do
        // something when the action completes.
        if (store.getState().hotdogs.hasIn(['condiments', whichOne])) {
            // We dispatch the same action type for success and failure; it's the "error" member
            // of the Flux Standard Action that tells the reducer what happened.
            return apiModule.applyCondiment(whichOne)
                .then(() => store.dispatch({type: types.APPLY_CONDIMENT, payload: whichOne}))
                .catch(() => store.dispatch({type: types.APPLY_CONDIMENT, error: true}));
        }
    },

    buyMoreWeiners() {
        // This is just to show a common pattern: we have the "requested_more" member in this store
        // to tell us whether a request to buy more weiners has already been submitted. This prevents
        // multiple simultaneous requests for the same thing.
        if (!store.getState().hotdogs.get('requested_more')) {
            // so we tell the store we requested more weiners
            store.dispatch({type: types.REQUEST_WEINERS});
            // *then* we submit the request
            return apiModule.buyWeiners()
                .then(() => store.dispatch({type: types.RECEIVE_WEINERS}))
                .catch((err) => store.dispatch({type: types.RECEIVE_WEINERS, payload: err.msg, error: true}))
        }
    },
};


// Getters.
//
// Required. Plain JavaScript object. Members are functions that accept the whole state (from all
// stores) and return some value. If a getter function requires data from another store, it should
// use the other store's getter functions. The purpose of getter functions is to consolidate data
// manipulation in the stores, reducing the logic held in React components to the minimum possible.
// The ideal situation is a React component with no conditional logic because all data are provided
// by the getter functions in the exact format required, though this is often impossible.

export const getters = {
    weinersRemaining(state) {
        // Use two other getters to figure it out.
        return numOfCookedHotdogs(state) + numOfUncookedHotdogs(state);
    },

    numOfCookedHotdogs(state) {
        // Just return the field we already have.
        return state.hotdogs.get('nr_cooked_weiners');
    },

    numOfUncookedHotdogs(state) {
        // This store isn't updated until the weiners are finished cooking, so we have to ask the
        // "bbq" store how many weiners are currently being cooked.
        return state.hotdogs.get('nr_uncooked_weiners') - bbqGetters.numOfCookingHotdogs(state);
    },

    whichCondimentsAreLow(state) {
        // We're going to return a List of the names of condiments for which fewer than ten
        // servings remain. (It's better to use reduce() for this type of thing, but this is
        // probably easier to read).
        const post = [];
        for (const eachCondiment of state.hotdogs.get('condiments')) {
            if (eachCondiment.get('servings_left') < 10) {
                post.push(eachCondiment.get('name'));
            }
        }
        return Immutable.List(post);
    },
};


// makeInitialState().
//
// Optional. Function. makeInitialState() creates the root Map for this store in an "empty"
// condition. Strongly recommended to use a function for this in all but the simplest stores.
// You'll want to initialize every possible field the store might have. The function cannot take
// arguments, and (therefore) must produce identical output every time it is called.

export function makeInitialState() {
    return Immutable.Map({
        nr_uncooked_weiners: 0,
        nr_cooked_weiners: 0,
        requested_more: false,
        condiments: Immutable.Map(),
        error: '',
    });
}


// makeEmptySomething().
//
// Optional. Function. Use these functions, as many as required, if there are any sub-Map objects
// in the store. The purpose and rules are similar to makeInitialState() but applied only to one
// part of the store. For this "hotdogs" store we only need one such function.

export function makeEmptyCondiment() {
    return Immutable.Map({
        name: '',
        servings_left: 0,
    });
}


// Verifiers.
//
// Optional. Plain JavaScript object. Members are functions that accept one of the sub-Map objects
// in the store (in this example store, it's condiments) and return a "verified" version of the
// object that is guaranteed to be valid.
//
// If it makes sense, the function's second argument may be a previous version of the sub-Map
// object to be updated with values from the first argument.
//
// The level of verification varies depending on the store and the sub-Map object, but you must at
// least make the following guarantees:
// - no undocumented fields are added
// - all documented fields are present
// - the data type of every field is the same as documented

export const verifiers = {
    condiment(nextCondiment, prevCondiment = makeEmptyCondiment()) {
        // makeEmptyCondiment() is so handy! We already know we have safe defaults for all fields.
        // Converting from Map to JS simply makes it easier to work with.
        const post = prevCondiment.toJS();

        // For some fields, it's enough to check the data type and whether it's not a falsy value.
        const fieldNames = [
            ['name', 'string'],
        ];

        for (const field of fieldNames) {
            if (nextCondiment.get(fieldName) && typeof nextCondiment.get(fieldName) === fieldType) {
                post[fieldName] = nextCondiment.get(fieldName);
            }
        }

        // For other fields, we want to do a more detailed verification.
        if (Number.isInteger(nextCondiment.get('servings_left'))) {
            post.servings_left = nextCondiment.get('servings_left');
        }

        // Remember to convert back to ImmutableJS before you return.
        return Immutable.toJS(post);
    },
};


// Reducer helper functions.
//
// Optional. Functions. If you find yourself putting a lot of logic in the reducer function, you
// may wish to use helper functions.

function applyCondiment(state, action) {
    // Just an example, friends!
    if (action.error !== true) {
        return state.setIn(
            ['condiments', action.payload, 'servings_left'],
            state.getIn(['condiments', action.payload, 'servings_left']),
        );
    }
    return state;
}


// Reducer.
//
// Required. Function. The store's reducer accepts two arguments: first, the current state of this
// store; second, the Flux Standard Action being dispatched. Use a "switch" statement to check for
// and react to the action types this store must react to. There are several ways you might
// accidentally screw up the reducer, so be sure that you:
//
// - always return the root Map that will become the new state of this store,
// - ignore action types you don't care about, returning the current state unchanged,
// - return an empty/default root Map when the first argument is undefined.
//
// Remember that the reducer must return the new state of this store every time it is called,
// no matter what.
//
// If you're wondering "what is the action?" Or "what is in action.payload?" It's up to you.
// You can basically decide anything; it's a contract you keep with yourself between the action
// functions in a store and that store's reducer.

export default function reducer(state = makeInitialState(), action) {
    // Note that there's no way to clear the "error_message" in this store as written.

    switch (action.type) {
        case types.COOK:
            state = state.set('nr_cooked_weiners', state.get('nr_cooked_weiners') + action.payload);
            state = state.set('nr_uncooked_weiners', state.get('nr_uncooked_weiners') - action.payload);
            break;

        case types.EAT:
            if (action.error === true) {
                state = state.set('error_message', action.payload);
            }
            else {
                state = state.set('nr_cooked_weiners', state.get('nr_cooked_weiners') - action.payload);
            }
            break;

        case types.APPLY_CONDIMENT:
            // The reducer helper handles everything. With "return" we don't need "break."
            return applyCondiment(state, action);

        case types.REQUEST_WEINERS:
            state = state.set('requested_more', true);
            break;

        case types.RECEIVE_WEINERS:
            if (action.error === true) {
                return state.set('requested_more', false);
            }
            else {
                state = state.set('requested_more', false);
                // let's say we always receive one pack of eight weiners
                state = state.set('nr_uncooked_weiners', state.get('nr_uncooked_weiners') + 8);
            }
            break;

        case 'RESET':
            // NOTE: that *every* store must implement the "RESET" action type, and must return the
            //       initial condition of the store.
            return makeInitialState();
    }

    // this one is important!
    return state;
}
