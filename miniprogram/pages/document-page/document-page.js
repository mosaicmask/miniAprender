const app = getApp()

let VueExampleCode = [
  `var vm = new Vue({
    // 选项
  })`,
  `根实例
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics`,
  `// 我们的数据对象
var data = { a: 1 }

// 该对象被加入到一个 Vue 实例中
var vm = new Vue({
  data: data
})

// 获得这个实例上的 property
// 返回源数据中对应的字段
vm.a == data.a // => true

// 设置 property 也会影响到原始数据
vm.a = 2
data.a // => 2

// ……反之亦然
data.a = 3
vm.a // => 3`,
  `vm.b = 'hi'`,
  `data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}`,
  `var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data: obj
})`,
  `<div id="app">
  <p>{{ foo }}</p>
  <!-- 这里的 foo 不会更新！ -->
  <button v-on:click="foo = 'baz'">Change it</button>
</div>`,
  `var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
  // 这个回调将在 vm.a 改变后调用
})`,
`new Vue({
  data: {
    a: 1
  },
  created: function () {
    // this 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"`
]

Page({
  data: {
    VueExampleCode
  }
})