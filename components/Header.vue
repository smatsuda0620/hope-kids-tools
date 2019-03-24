<<template>
  <div>
    <header class="header">
      <h1 class="uk-heading-primary header-title">For Kids</h1>
      <div class="uk-position-top-right">
        <!-- ログイン時にはフォームとログアウトボタンを表示 -->
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
                  <a href="" uk-icon="sign-out">サインアウト </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 未ログイン時にはログインボタンを表示 -->
        <div v-else key="logout" class="uk-padding-small">
          <button type="button" @click="$emit(doLogin)" class="uk-button uk-button-secondary">ログイン</button>
        </div>
      </div>
    </header>
  </div>
</template>
<<script>
export default {
  name: 'Header',
  props: {
    user: Object
  }
}
</script>>