export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.role = payload.role;
  },
  setUserRoles(state, roles) {
    state.userRoles = roles;
  },
};