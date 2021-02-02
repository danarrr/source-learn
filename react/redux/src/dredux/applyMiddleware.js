
export default function applyMiddleware(...middlewares) {
  // middles为接受的thunk中间件 但是不确定有几个thunk,
  // 传进来的参数来看返回的结果,以下是调用时的函数
  // if(enhancer){
  //   return enhancer(createStore)(reducer)
  // }
  return createStore => reducer => {
    const store = createStore(reducer)
    let dispatch = store.dispatch

    // 接下来加强dispatch
    // 1. 给中间件权限 读取和修改的权限
    let midAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)  // 作用域之和上下文有关
    }
    // 完整的中间件的库（数组）
    const middleChain = middlewares.map(middleware => middleware(midAPI)) // 这里的middleware就是thunk
     // 让这些函数按顺序执行
     dispatch = compose(...middleChain)(store.dispatch) // compose让所有的中间件按顺序去执行，用dispatch来执行（是不是看下thunk的next 类似一个形参）

    return {
      // 最终返回结果： 加强dispatch
      ...store,
      dispatch,
    }
  }
}

// 聚合函数
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
