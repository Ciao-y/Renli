//! 负责管理所有自定义指令

export const imagerroe = {
  // 指令对象 会在当前的dom元素插入节点之后执行
  inserted(dom, options) {
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}
