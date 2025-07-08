
import Vue from 'vue'

// 在vue上挂载一个指量 preventReClick

// vue防止按钮重复点击

const preventReClick = Vue.directive('preventReClick', {
    inserted: function (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                console.log("防点击频繁")
                setTimeout(() => {
                    el.disabled = false
                    //设置时间
                }, binding.value || 3000)
            }
        })
    }
})

export { preventReClick }
