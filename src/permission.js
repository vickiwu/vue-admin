import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth' // 获取token cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 没有重定向的白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 验证是否有token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已经登录重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取用户权限
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息 权限数组列表 ['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // 根据权限生成权限可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加路由
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true })
        } catch (error) {
          // 移除token 重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 无token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单放行
      next()
    } else {
      // 无访问权限页面 重定向登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
