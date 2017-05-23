import App from './App.jsx';
import Board from './Pages/Board.jsx';
import NotFound from './Pages/NotFound.jsx';
import services from '../services';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory, Redirect} from 'react-router';

import {Component} from 'react';

function redirectTo(to) {
	function replacePath(nextState, replace) {
	    replace({
	      pathname: to,
	      state: { nextPathname: nextState.location.pathname }
	    })
	}
	return replacePath
}

export default (
    <Router history={browserHistory} >
        <Route path='/' component={App}>
        	<IndexRoute component={Board}
        		onEnter={redirectTo('/board')} />
        	<Route path='board' component={Board} />
        </Route>
        <Route path='*' component={NotFound} />
    </Router>
);
