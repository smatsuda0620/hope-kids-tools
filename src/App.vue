<template>
  <div id="app">
    <header class="header">
      <h1 class="uk-heading-primary header-title">For Kids</h1>
        <div class="uk-position-top-right">
          <!-- ログイン時にはフォームとログアウトボタンを表示 -->
          <div v-if="user.uid" key="login" class="uk-padding-small">
            <div class="uk-inline">
              <img class="uk-border-circle" :src="user.photoURL" width="40" height="40">
              <div uk-drop="{pos: bottom-left, mode: click}" class="">
                <div class="uk-card uk-card-body uk-card-small uk-card-default">
                  <div class="uk-card-header">
                    <div class="uk-grid-small uk-flex-middle" uk-grid>
                      <div class="uk-width-auto">
                        <img class="uk-border-circle uk-comment-avatar" :src="user.photoURL" width="60" height="60">
                      </div>
                      <div class="uk-width-expand">
                        <h3 class="uk-card-title uk-margin-remove-bottom">{{user.displayName}}</h3>
                      </div>
                    </div>
                  </div>
                  <div class="uk-card-footer">
                    <a href="" uk-icon="sign-out">サインアウト </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 未ログイン時にはログインボタンを表示 -->
          <div v-else key="logout" class="uk-padding-small" @click="doLogin">
            <button type="button" @click="doLogin" class="uk-button uk-button-secondary">ログイン</button>
          </div>
        </div>
    </header>

    <!--　Firebase から取得したリストを描画（トランジション付き）　-->
    <div v-if="loading" class="uk-position-center" uk-spinner="ratio: 3"></div>
    <div v-else>
        <table class="uk-table uk-table-striped">
          <thead>
              <tr>
                <th class="uk-width-1-2">名前</th>
                <th class="uk-width-1-4">年齢</th>
                <th class="uk-width-1-4">編集</th>
              </tr>
          </thead>
            <transition-group name="list" tag="tbody" class="uk-width-1-1" enter-active-class="uk-animation-fade" leave-active-class="uk-animation-fade uk-animation-reverse">
              <tr v-for="{ id, familyname, secondname, age } in list" :key="id">
                <td>{{ familyname + ' ' + secondname }}</td>
                <td>{{ age }}</td>
                <td>
                  <a href="#" uk-tooltip="title: 編集" @click="editItem(id)" class="uk-icon-link uk-margin-small-right" uk-icon="file-edit"></a>
                  <a href="#" uk-tooltip="title: 削除" @click="deleteItem(id)" class="uk-icon-link" uk-icon="trash"></a>
                </td>         
              </tr>
            </transition-group>
        </table>
      <a @click="createItem()" class="uk-button uk-button-default uk-width-1-1" href="#modal-sections" uk-toggle>メンバー追加</a>
    </div>
    <div id="modal-sections" uk-modal>
        <div class="uk-modal-dialog">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div class="uk-modal-header">
              <h2 v-if="id" class="uk-modal-title">メンバー編集</h2>
              <h2 v-else class="uk-modal-title">メンバー追加</h2>
          </div>
          <div class="uk-modal-body">

          <form class="uk-form uk-grid-small" @submit.prevent="doSend" uk-grid>
            <div class="uk-width-1-2@s">
              <label class="uk-form-label">苗字</label>
              <input class="uk-input uk-margin-bottom" type="text" placeholder="苗字" v-model="familyname">
            </div>
            <div class="uk-width-1-2@s">
              <label class="uk-form-label">名前</label>
              <input class="uk-input uk-margin-bottom" type="text" placeholder="名前" v-model="secondname">
            </div>
            <div class="uk-width-1-1">
              <label class="uk-form-label">年齢</label>
              <select class="uk-select uk-margin-bottom" placeholder="年齢" v-model="age">
                <option v-for="item in items" :key = "item.id">
                  {{item.age}}
                </option>
              </select>
            </div>
            <div class="uk-width-1-1 uk-modal-footer uk-text-right">
              <button class="uk-button uk-button-default uk-modal-close" type="button">キャンセル</button>
              <button class="uk-button uk-button-default uk-button-primary" type="submit" v-bind:disabled="notAllowed">保存</button>
            </div>
          </form>
        </div>
    </div>
  </div>
</div>
</template>

<script>
// firebase モジュール
import firebase,{ functions } from 'firebase'

import UIkit from 'uikit';
// 改行を <br> タグに変換するモジュール
import Nl2br from 'vue-nl2br'
export default {
  components: { Nl2br },
  data() {
    return {
      loading: true,
      user: {},  // ログインユーザー情報
      list: [],  // 取得した名簿を入れる配列
      familyname: '',  // 入力中苗字
      secondname: '',  // 入力中名前
      age: '', // 入力中年齢
      id : null,
      items: [{
        id: 1,
        age: 6
      },{
        id: 2,
        age: 7
      },{
        id: 3,
        age: 8
      }]
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      const ref_list = firebase.database().ref('list')
      if (user) {
        this.list = []
        // message に変更があったときのハンドラを登録
        ref_list.on('child_added', this.childAdded)
        ref_list.on('child_removed', this.childRemoved)
        ref_list.on('child_changed', this.childChanged)
        this.loading = false;
      } else {
        // message に変更があったときのハンドラを解除
        ref_list.off('child_added', this.childAdded)
      }
    })
  },
  computed: {
    fullname : function () {
      return this.familiyname + '' + this.secondname
    },
    notAllowed : function () {
      return this.fullname.length === 0 || this.age.length === 0 
    }
  },
  methods: {
    // ログイン処理
    doLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
    },
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut()
    },
    // スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(snap) {
      const profile = snap.val()
      this.list.push({
        id: snap.key,
        familyname: profile.familyname,
        secondname: profile.secondname,
        age: profile.age
      })
      this.scrollBottom()
    },
    childRemoved(snap) {
      this.list.forEach((item, index) => {
        if (item.id === snap.key) {
          this.list.splice(index, 1);
        }
      })
    },
    childChanged(snap) {
      const profile = snap.val();
      this.list.forEach((item, index) => {
        if (item.id === snap.key) {
          this.list[index] = {
            id: snap.key,
            familyname: profile.familyname,
            secondname: profile.secondname,
            age: profile.age
          };
        }
      })
    },
    doSend() {
      if (this.user.uid && !this.notAllowed > 0) {
        if (this.id) {
          firebase.database().ref('list/' + this.id).set({
            familyname: this.familyname,
            secondname: this.secondname,
            age: this.age          
          }, (error) => {
            if (error) {
              UIkit.notification({message: 'ユーザの追加に失敗しました。', status:'danger'})
            } else {
              UIkit.notification({message: this.name + 'を追加しました', status:'success'})
              this.familyname = ''; // フォームを空にする
              this.secondname = ''; // フォームを空にする
              this.age = '';
              UIkit.modal(document.getElementById('modal-sections')).hide();
            }
          })
        } else {
          // firebase にメンバーを追加
          firebase.database().ref('list').push({
            familyname: this.familyname,
            secondname: this.secondname,
            age: this.age
          }, (error) => {
            if (error) {
              UIkit.notification({message: 'ユーザの追加に失敗しました。', status:'danger'})
            } else {
              UIkit.notification({message: this.fullname + 'を追加しました', status:'success'})
              this.familyname = ''; // フォームを空にする
              this.secondname = ''; // フォームを空にする
              this.age = '';
              UIkit.modal(document.getElementById('modal-sections')).hide();
            }
          })
        }
      }
    },
    createItem() {
      this.familyname = ''; // フォームを空にする
      this.secondname = '';
      this.age = '',
      this.id = null
    },
    deleteItem(id) {
      if (confirm('このメンバーを削除しますか')) {
        firebase.database().ref('list/' + id).remove();
      }
    },
    editItem(id) {
      UIkit.modal(document.getElementById('modal-sections')).show();
      firebase.database().ref('list/' + id).once('value').then(
        (snap) => {
          const profile = snap.val();
          this.id = snap.key;
          this.familyname = profile.familyname;
          this.secondname = profile.secondname
          this.age = profile.age;
        }
      )
    }
  }
}
</script>

<style lang="scss">
@import "uikit/src/scss/variables-theme.scss";
@import "uikit/src/scss/mixins-theme.scss";
@import "uikit/src/scss/uikit.scss";

.header {
  background: #3ab383;
  color: #fff;
  height: 70px;
  font-family: fantasy;
}

.header-title {
  font-family: monospace;
}
</style>