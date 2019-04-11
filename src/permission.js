import router from './router'
import { getCookie } from '@/utils/cookie'
import { Message } from 'element-ui'

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const hasUserInfo = getCookie('user_info') ? JSON.parse(getCookie('user_info')) : false
    if (hasUserInfo) {
      next()
    } else {
      Message({
        message: '请登录',
        type: 'error',
        duration: 5 * 1000
      })
      router.push('/login')
    }
  }
})
