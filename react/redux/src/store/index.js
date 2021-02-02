// import {createStore, applyMiddleware, combineReducers} from "redux";
// import {createStore, applyMiddleware} from "../kredux/";
import {createStore, applyMiddleware} from "../dredux/";
// import thunk from "redux-thunk";
// import logger from "redux-logger";
import isPromise from "is-promise";

// 定义修改规则
function countReducer(state = 0, action) {
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "MINUS":
      return state - action.payload || 1;
    default:
      return state;
  }
}

const store = createStore(
  countReducer,
  // combineReducers({count: countReducer}),
  // applyMiddleware(thunk, promise, logger)
  applyMiddleware(thunk)
);

export default store;

// 处理异步的中间件
function thunk({getState, dispatch}) {
  // 看下调用回忆下
  // const middleChain = middlewares.map(middleware => middleware(midAPI)) // 这里的middleware就是thunk
  //  dispatch = compose(...middleChain)(store.dispatch) 

  // 这里的middleware就是thunk
  // 所以next有可能是dispatch 或者聚合函数  store.dispatch({type: "ADD"}); 或者dispatch(() => setTimout(xxx))
  return (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    }
    // next 就是compose里的函数 f1 23 f1(action)
    return next(action);
  };
}

// 打印日志
function logger({getState, dispatch}) {
  return (next) => (action) => {
    console.log("------------------------------"); //sy-log

    console.log(action.type + "执行了！"); //sy-log

    const preState = getState();

    console.log("prev state", preState); //sy-log

    const returnValue = next(action);
    const nextState = getState();

    console.log("next state", nextState); //sy-log

    console.log("------------------------------"); //sy-log
    return returnValue;
  };
}

function promise({dispatch}) {
  return (next) => (action) => {
    return isPromise(action) ? action.then(dispatch) : next(action);
  };
}
