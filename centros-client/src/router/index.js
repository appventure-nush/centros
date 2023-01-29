import Vue from 'vue'
import VueRouter from 'vue-router'
import CalendarView from "@/views/CalendarView";
import RegisterView from "@/views/RegisterView";
import UniversityView from "@/views/UniversityView";
import FileNotFoundView from "@/views/FileNotFoundView";
import GuidesView from "@/views/GuidesView";
import FileView from "@/views/FileView";
import ProfileView from "@/views/ProfileView";
import ReviewView from "@/views/ReviewView";
import MeetingView from "@/views/MeetingView"
//import SignInView from "@/views/SignInView";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'signin',
        component: UniversityView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: CalendarView
    },
    {
        path: '/meetings',
        name: 'meetings',
        component: MeetingView
    },
    {
        path: '/guides',
        name: 'guides',
        component: GuidesView
    },
    {
        path: '/university',
        name: 'university',
        component: UniversityView
    },
    {
        path: '/files',
        name: 'files',
        component: FileView
    },
    {
        path: '/reviews',
        name: 'reviews',
        component: ReviewView
    },
    {
        path: '*',
        name: 'default',
        component: FileNotFoundView
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
