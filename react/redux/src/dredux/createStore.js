import applyMiddleware from "./applyMiddleware"

export default function createStore(reducer, enhancer) {
  // enhancer 加强函数 专门处理异步函数扩展reducer的功能
  // 调用的时候传入了thunk
  if(enhancer){
    // gs enhancer实际加强了dispatch
    // 1.enhancer是个函数
    // 2.dispatch来源于createStore
    // 3.最终还是修改state, 所以存下他的规则
    return enhancer(createStore)(reducer)
  }
  
  let currentState
  let currentListeners = []

  // get
  function getState() {
    return currentState
  }

  // set
  function dispatch(action) {
    currentState = reducer(currentState, action)

    // state改变，执行订阅函数
    currentListeners.forEach(listener => listener())
  }

  function subscribe(listener){
    currentListeners.push(listener)

    // 订阅时也执行一次
    return (() => {
      const index = currentListeners.indexOf(listener)
      currentListeners.splice(index, 1)
    })
  }

  // 初始化触发一次
  dispatch({type: "REDUX/XXXXXXXXXXXXXXXXXXXXXXXX"});

  return {
    getState,
    dispatch,
    subscribe,
  };
}
