import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import firebase from 'firebase';
import Vue from 'vue';
import App from './App.vue';

UIkit.use(Icons);

const config = {
  apiKey: 'AIzaSyCkXFCYxN_FjReq_x6RV5a4zob0TcD8wag',
  authDomain: 'shuji-tutorial.firebaseapp.com',
  databaseURL: 'https://shuji-tutorial.firebaseio.com',
  projectId: 'shuji-tutorial',
  storageBucket: 'shuji-tutorial.appspot.com',
  messagingSenderId: '111581454507',
};

Vue.config.productionTip = false;

// Initialize Firebase
firebase.initializeApp(config);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
