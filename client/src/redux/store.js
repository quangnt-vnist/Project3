import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
    createLogger
} from 'redux-logger';
import rootReducer from './combine-reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();

var store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    )
);



export default store;