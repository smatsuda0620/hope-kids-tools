import Vue from 'vue';
import Router from 'vue-router';
import Roster from 'pages/Roster';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Roster
    }
  ]
});