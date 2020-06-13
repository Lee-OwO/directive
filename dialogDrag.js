import store from '../store'

function addStyle(dom, styleObj = {}) {
  for (const key in styleObj) {
    dom.style[key] = styleObj[key]
  }
}

function addEvent(el, dragList, dragable = true) {
  dragList.forEach(item => {
    if (dragable) {
      item.onmousedown = e => {
        const zIndex = store.state.zIndex
        const nowZIndex = +el.style.zIndex
        if (zIndex !== nowZIndex) {
          const newZIndex = zIndex + 1
          el.style.zIndex = newZIndex
          store.commit('setZIndex', newZIndex)
        }
        const x = e.pageX - el.offsetLeft
        const y = e.pageY - el.offsetTop
        document.onmousemove = e => {
          const newX = e.pageX - x
          const newY = e.pageY - y > 0 ? e.pageY - y : 0
          el.style.left = newX + 'px'
          el.style.top = newY + 'px'
        }
        document.onmouseup = e => {
          document.onmouseup = document.onmousemove = null
        }
        e.preventDefault()
      }
      item.style.cursor = 'move'
    } else {
      item.onmousedown = null
      item.style.cursor = 'auto'
    }
  })
}
export default {
  name: 'drag',
  bind(el, { value }) {
    const addBar = value.addBar === undefined ? true : value.addBar
    const length = value.length || 30
    const dragable = value.dragable === undefined ? true : value.dragable
    let dragDomList = el.querySelectorAll('.dragable')
    el.style.position = 'fixed'
    el.style['box-shadow'] = '0px 3px 24px 0px rgba(0, 0, 0, 0.11)'
    const zIndex = store.state.zIndex
    const newZIndex = zIndex + 1
    el.style.zIndex = newZIndex
    store.commit('setZIndex', newZIndex)
    if (dragDomList.length === 0) {
      if (addBar) {
        const bar = document.createElement('DIV')
        bar.className = 'dragable'
        addStyle(bar, {
          width: '100%',
          height: length + 'px',
          position: 'absolute',
          cursor: 'move',
          top: 0,
          left: 0
        })
        el.appendChild(bar)
        dragDomList = [bar]
      } else {
        dragDomList = [el]
      }
    } else {
      dragDomList.forEach(item => {
        item.style.cursor = 'move'
      })
    }
    addEvent(el, dragDomList, dragable)
  },
  update(el, { value, oldValue }) {
    if (value.show !== oldValue.show && value.show) {
      const zIndex = store.state.zIndex
      const newZIndex = zIndex + 1
      el.style.zIndex = newZIndex
      store.commit('setZIndex', newZIndex)
    }
    if (value.dragable !== oldValue.dragable) {
      const dragDomList = el.querySelectorAll('.dragable')
      addEvent(el, dragDomList, value.dragable)
    }
  }
}