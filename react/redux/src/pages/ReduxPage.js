import React, {Component} from "react";
import store from "../store/";

export default class ReduxPage extends Component {
  componentDidMount() {
    // store发生变化之后，执行subscribe的监听函数
    this.unsubscribe = store.subscribe(() => {
      // 执行更新视图
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    // 组件卸载之前，取消订阅
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  add = () => {
    // 修改状态
    store.dispatch({type: "ADD"});
  };

  asyAdd = () => {
    // setTimeout(() => {
    //   // 修改状态
    //   store.dispatch({type: "ADD"});
    // }, 1000);

    store.dispatch((dispatch, getState) => {
      setTimeout(() => {
        // 修改状态
        dispatch({type: "ADD"});
      }, 1000);
    });
  };

  promiseMinus = () => {
    store.dispatch(
      Promise.resolve({
        type: "MINUS",
        payload: 100,
      })
    );
  };

  render() {
    return (
      <div>
        <h3>ReduxPage</h3>
    
        <p>{store.getState()}</p>
        <button onClick={this.add}>add</button>
        <button onClick={this.asyAdd}>asyAdd</button>
        <button onClick={this.promiseMinus}>promiseMinus</button>
      </div>
    );
  }
}
