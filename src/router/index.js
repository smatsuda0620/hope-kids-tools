import Vue from 'vue';
import Router from 'vue-router';
import Roster from 'pages/Roster';
import Record from 'pages/Record';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Roster
    }, {
      path: '/roster',
      name: 'roster',
      component: Roster
    }, {
      path: '/record',
      name: 'default-record',
      component: Record
    }, {
      path: '/record/:date',
      name: 'record',
      component: Record
    }
  ]
});
