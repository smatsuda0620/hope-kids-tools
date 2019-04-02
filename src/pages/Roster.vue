<template>
  <div>
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
                  <option v-for="item in childPattern" :key = "item.id">
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
import firebase from 'firebase';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

UIkit.use(Icons);

const youngestAge = 6;
const oldestAge = 12;

export default {
  name: 'Roster',
  props: {
    user: Object
  },
  data() {
    return {
      list: [],
      familyname: '',
      secondname: '',
      age: '',
      id : null,
      childPattern:
        new Array(oldestAge - youngestAge + 1).fill({}).map((value, index) => {
          return {
            id: index,
            age: index + youngestAge
          }
        }
      )
    }
  },
  created() {
    const ref_list = firebase.database().ref('list');
    ref_list.on('child_added', this.childAdded)
    ref_list.on('child_removed', this.childRemoved)
    ref_list.on('child_changed', this.childChanged)
  },
  computed: {
    fullname : function () {
      return this.familyname + ' ' + this.secondname
    },
    notAllowed : function () {
      return this.fullname.length === 0 || this.age.length === 0 
    }
  },
  methods: {
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
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
      if (this.id) {
        firebase.database().ref('list/' + this.id).set({
          familyname: this.familyname,
          secondname: this.secondname,
          age: this.age          
        }, (error) => {
          if (error) {
            UIkit.notification({message: 'ユーザの追加に失敗しました。', status:'danger'})
          } else {
            UIkit.notification({message: this.fullname + 'を編集しました', status:'success'})
            this.familyname = '';
            this.secondname = '';
            this.age = '';
            UIkit.modal(document.getElementById('modal-sections')).hide();
          }
        })
      } else {
        firebase.database().ref('list').push({
          familyname: this.familyname,
          secondname: this.secondname,
          age: this.age
        }, (error) => {
          if (error) {
            UIkit.notification({message: 'ユーザの追加に失敗しました。', status:'danger'})
          } else {
            UIkit.notification({message: this.fullname + 'を追加しました', status:'success'})
            this.familyname = '';
            this.secondname = '';
            this.age = '';
            UIkit.modal(document.getElementById('modal-sections')).hide();
          }
        })
      }
    },
    createItem() {
      this.familyname = '';
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