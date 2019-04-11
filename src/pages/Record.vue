<template>
  <div>
    <select class="uk-select" v-model="selectedDate" @change="optionChange()">
      <option v-for="option in dateOptions" v-bind:value="option.value" :key="option.value">
        {{ option.value }}
      </option>
    </select>
    <h1> {{ $route.params.date }} </h1>
    <div class="uk-flex uk-flex-wrap uk-flex-wrap-around uk-background-muted uk-padding-small">
      <div class="uk-width-2-3">Item 1</div>
      <div class="uk-width-1-3">
        <div v-for="option in kidsList" :key="option.id">
          <label>
            <input class="uk-checkbox" type="checkbox">
              {{ option.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase';

const dt = new Date();

export default {
  name: 'Record',
  data() {
    return {
      selectedDate: dt.getDate() + '-' + dt.getDate(),
      dateOptions: [
        { value: '4-5' },
        { value: '4-6' }
      ],
      kidsList: []
    }
  },
  created() {
    firebase.database().ref('list').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        this.kidsList.push({
          id: childSnapshot.key,
          name: childSnapshot.val().familyname + ' ' + childSnapshot.val().secondname
        })
      })
    })
  },
  methods: {
    optionChange: function() {
      this.$router.push({
        path: '/record/' + this.selectedDate
      })
    }
  }
}
</script>
