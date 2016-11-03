let _input = 
`
# demo
`

var demo = new Vue({
  el: '#editor',
  data: {
    input: _input,
    isfull: true
  },
  filters: {
    marked: marked
  },
  methods: {
    full: function (){
      this.isfull = true;
    },
    small: function (){
      this.isfull = false;
    }
  }
})