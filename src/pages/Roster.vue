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
        <transition-group name="memberList" tag="tbody" class="uk-width-1-1" enter-active-class="uk-animation-fade" leave-active-class="uk-animation-fade uk-animation-reverse">
          <tr v-for="{ id, familyName, secondName, age } in memberList" :key="id">
            <td>{{ familyName + ' ' + secondName }}</td>
            <td>{{ age }}</td>
            <td>
              <a href="#" uk-tooltip="title: 編集" @click="openEditMemberModal(id)" class="uk-icon-link uk-margin-small-right" uk-icon="file-edit"></a>
              <a href="#" uk-tooltip="title: 削除" @click="deleteItem(id)" class="uk-icon-link" uk-icon="trash"></a>
            </td>         
          </tr>
        </transition-group>
    </table>
    <a @click="openAddMemberModal()" class="uk-button uk-button-default uk-width-1-1">メンバー追加</a>
    <div id="js-modal-sections" uk-modal>
        <div class="uk-modal-dialog">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div class="uk-modal-header">
              <h2 v-if="id" class="uk-modal-title">メンバー編集</h2>
              <h2 v-else class="uk-modal-title">メンバー追加</h2>
          </div>
          <div class="uk-modal-body">
            <form class="uk-form uk-grid-small" @submit.prevent="saveMemberData" uk-grid>
              <div class="uk-width-1-2@s">
                <label class="uk-form-label">苗字</label>
                <input class="uk-input uk-margin-bottom" type="text" placeholder="苗字" v-model="familyName">
              </div>
              <div class="uk-width-1-2@s">
                <label class="uk-form-label">名前</label>
                <input class="uk-input uk-margin-bottom" type="text" placeholder="名前" v-model="secondName">
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
      memberList: [],
      familyName: '',
      secondName: '',
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
    fullName : function () {
      return this.familyName + ' ' + this.secondName
    },
    notAllowed : function () {
      return this.fullName.length === 0 || this.age.length === 0 
    }
  },
  methods: {
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    showNotification(message, status) {
      UIkit.notification({message: message, status: status});
      UIkit.modal(document.getElementById('js-modal-sections')).hide();
    },
    resetModalData() {
      this.familyName = '';
      this.secondName = '';
      this.age = '';
      this.id = null;
    },
    onEDitMember() {
      const message = `${this.fullName}を追加しました`;
      const status = 'success';
      this.showNotification(message, status);
      this.familyName = '';
      this.secondName = '';
      this.age = '';
    },
    onErrorEdit() {
      const message = 'ユーザの追加に失敗しました。';
      const status = 'danger';
      this.showNotification(message, status);
    },
    pushNewMember() {
      firebase.database().ref('list').push({
        familyName: this.familyName,
        secondName: this.secondName,
        age: this.age
      }).then(() => {
        this.onEDitMember();
      }).catch(() => {
        this.onErrorEdit()
      })
    },
    onCreateMember() {
      const message = `${this.fullName}を編集しました`;
      const status = 'success';
      this.showNotification(message, status);
      this.resetModalData();
    },
    onErrorCreate() {
      const message = 'ユーザの編集に失敗しました。';
      const status = 'danger';
      this.showNotification(message, status);
    },
    updateMemberData() {
      firebase.database().ref('list/' + this.id).set({
        familyName: this.familyName,
        secondName: this.secondName,
        age: this.age          
      }).then(() => {
        this.onCreateMember();
      }).catch(() => {
        this.onErrorCreate();
      })
    },
    childAdded(snap) {
      const profile = snap.val()
      this.memberList.push({
        id: snap.key,
        familyName: profile.familyName,
        secondName: profile.secondName,
        age: profile.age
      })
      this.scrollBottom()
    },
    childRemoved(snap) {
      const targetIndex = this.list.findIndex((item) => {
        return item.id === snap.key
      });
      this.memberList.splice(targetIndex, 1);
    },
    childChanged(snap) {
      const profile = snap.val();
      const targetIndex = this.list.findIndex((item) => {
        return item.id === snap.key
      });
      this.memberList[targetIndex] = {
        id: snap.key,
        familyName: profile.familyName,
        secondName: profile.secondName,
        age: profile.age
      };
    },
    saveMemberData() {
      if (this.id) {
        this.updateMemberData();
      } else {
        this.pushNewMember();
      }
    },
    openAddMemberModal() {
      this.resetModalData();
      UIkit.modal(document.getElementById('js-modal-sections')).show();
    },
    openEditMemberModal(id) {
      firebase.database().ref('list/' + id).once('value').then(
        (snap) => {
          const profile = snap.val();
          this.id = snap.key;
          this.familyName = profile.familyName;
          this.secondName = profile.secondName;
          this.age = profile.age;
          UIkit.modal(document.getElementById('js-modal-sections')).show();
        }
      ).catch(() => {
        const message = 'ユーザデータの取得に失敗しました。';
        const status = 'danger';
        this.showNotification(message, status);
      })
    },
    deleteItem(id) {
      if (confirm('このメンバーを削除しますか')) {
        firebase.database().ref('list/' + id).remove();
      }
    },
  }
}
</script>