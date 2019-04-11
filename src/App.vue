<template>
  <div>
    <Header :user='user' v-on:login="doLogin()" v-on:logout="doLogout()"></Header>
    <div v-if="loading" class="uk-position-center" uk-spinner="ratio: 3"></div>
    <div v-else>
      <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
              <li class="uk-active">
                <router-link to="/roster">名簿</router-link>
              </li>
              <li>
                <router-link to="/record">出席簿</router-link>
              </li>
            </ul>
        </div>
      </nav>
      <router-view :user='user'></router-view>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import Header from 'components/Header';
import router from './router'

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
});

const youngestAge = 6;
const oldestAge = 12;

export default {
  components: {
    Header
  },
  router,
  data() {
    return {
      user: {},
      loading: true
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {};
      this.loading = false
    })
  },
  methods: {
    doLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
    },
    doLogout() {
      firebase.auth().signOut()
    }
  }
}
</script>

<style lang="scss">
@import "uikit/src/scss/variables-theme.scss";
@import "uikit/src/scss/mixins-theme.scss";
@import "uikit/src/scss/uikit.scss";
</style>