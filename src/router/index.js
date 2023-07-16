import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../view/Login'
import Register from '../view/Register'
import Home from '../view/Home'
import OauthLoginResult from '../view/OauthLoginResult'
// 安装路由
Vue.use(VueRouter);

let router = new VueRouter({
    mode: 'history',
    routes: [{
        path: "/",
        redirect: "/login"
    },
        {
            name: "Login",
            path: '/login',
            component: Login
        },
        {
            name: "oAuthLoginResult",
            path: '/oAuthLoginResult',
            component: OauthLoginResult
        },
        {
            name: "Register",
            path: '/register',
            component: Register
        },
        {
            name: "Home",
            path: '/home',
            component: Home,
            meta: {
                requireAuth: true
            },
            children: [
                {
                    name: "Chat",
                    path: "/home/chat",
                    component: () => import("../view/Chat"),
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    name: "Friends",
                    path: "/home/friend",
                    component: () => import("../view/Friend"),
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    name: "Friends",
                    path: "/home/group",
                    component: () => import("../view/Group"),
                    meta: {
                        requireAuth: true
                    },
                }
            ]
        }
    ]

});

router.beforeEach((to, from, next) => {
    if (to.matched.length ===0) {
        next({
            path: '/home'
        });
    }
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        let accessToken=sessionStorage.getItem("accessToken");
        if (accessToken!=null && accessToken!=undefined && accessToken.trim()!='') {
            //如果登录了，就跳转到'/index'路径
            next();
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        //如果不需要登录权限就直接跳转到该路由
        next();
    }
})

export default router;