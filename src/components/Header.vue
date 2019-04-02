<<template>
  <div>
    <header class="header">
      <h1 class="uk-heading-primary header-title">Hope Kids</h1>
      <div class="uk-position-top-right">
        <div v-if="user.uid" key="login" class="uk-padding-small">
          <div class="uk-inline">
            <img class="uk-border-circle" :src="user.photoURL" width="40" height="40">
            <div uk-drop="{pos: bottom-left, mode: click}">
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
                  <button @click="$emit('logout')" uk-icon="sign-out">サインアウト </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 未ログイン時にはログインボタンを表示 -->
        <div v-else key="login" class="uk-padding-small">
          <button type="button" @click="$emit('login')" class="uk-button uk-button-secondary">ログイン</button>
        </div>
      </div>
    </header>
  </div>
</template>
<script>
export default {
  name: 'Header',
  props: {
    user: Object
  }
}
</script>
<style scoped>
.header {
  background: #f5f5dc;
  color: #fff;
  height: 70px;
  font-family: fantasy;
}

.header-title {
  font-family: monospace;
}
</style>
