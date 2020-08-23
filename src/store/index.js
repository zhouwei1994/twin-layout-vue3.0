import { createStore } from 'vuex'
const files = require.context("./modules", false, /\.js$/);
let modules = {
  state: {},
  mutations: {},
  actions: {},
};
files.keys().forEach((key) => {
  Object.assign(modules.state, files(key)["state"]);
  Object.assign(modules.mutations, files(key)["mutations"]);
  Object.assign(modules.actions, files(key)["actions"]);
});
export default createStore(modules)
