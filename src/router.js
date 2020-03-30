import Vue from "vue"
import VueRouter from "vue-router"
import JoinPage from "@/pages/JoinPage.vue"
import RoomPage from "@/pages/RoomPage.vue"
import DebugPage from "@/pages/DebugPage.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Join",
    component: JoinPage
  },
  {
    path: "/join",
    component: JoinPage,
  },
  {
    path: "/room/:roomName",
    component: RoomPage,
    props: true
  },
  {
    path: "/debug",
    component: DebugPage,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "debug" */ "../pages/DebugPage.vue")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
