import drag from './dialogDrag'
const list = [drag]
export default function(Vue) {
  list.forEach(item => {
    Vue.directive(item.name, item)
  })
}