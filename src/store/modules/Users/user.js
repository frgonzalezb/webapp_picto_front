import axiosInstance from '@/services/axios';

export default {
  namespaced: true,
  state: {
    UserObj: {
      id: 0,
      name: "",
      email: "",
      isStaff: false,
      isAuthenticated: false
    },
  },
  mutations: {
    cleanValue(state) {
      state.UserObj.id = 0;
      state.UserObj.name = "";
      state.UserObj.email = "";
      state.UserObj.isStaff = false;
      state.UserObj.isAuthenticated = false;
      sessionStorage.removeItem('userObj');
    },
    setId(state, value) {
      state.UserObj.id = value;
    },
    setName(state, value) {
      state.UserObj.name = value;
    },
    setEmail(state, value) {
      state.UserObj.email = value;
    },
    setIsStaff(state, value) {
      state.UserObj.isStaff = value;
    },
    setIsAuthenticated(state, value) {
      state.UserObj.isAuthenticated = value;
    },
    SearchUserObj(state, obj) {
      state.UserObj.id = obj.id;
      state.UserObj.name = obj.name;
      state.UserObj.email = obj.email;
      state.UserObj.isStaff = obj.isStaff;
      state.UserObj.isAuthenticated = obj.isAuthenticated;
    },
    setUserObjFromSessionStorage(state) {
      const storedUserObj = sessionStorage.getItem('userObj');
      if (storedUserObj) {
        state.UserObj = JSON.parse(storedUserObj);
      }
    },
  },
  actions: {
    cleanValue({ commit }) {
      commit("cleanValue");
    },
    setId({ commit }, value) {
      commit("setId", value);
    },
    setName({ commit }, value) {
      commit("setName", value);
    },
    setEmail({ commit }, value) {
      commit("setEmail", value);
    },
    setIsStaff({ commit }, value) {
      commit("setIsStaff", value);
    },
    setIsAuthenticated({ commit }, value) {
      commit("setIsAuthenticated", value);
    },
    storeUserObjInSessionStorage({ commit, state }) {
      sessionStorage.setItem('userObj', JSON.stringify(state.UserObj));
    },

    // Create
    async CreateUserObj({ commit }, data) {
      try {
        const response = await axiosInstance.post(
          `${import.meta.env.VITE_APP_BACKEND_API}/api/register/`,
          data
        );
        return response;
      } catch (error) {
        return error.response
      }
    },
    // Retrieve
    async SearchUserObj({ commit }, id) {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_APP_BACKEND_API}/usuarios/${id}/`
        );
        commit("SearchUserObj", response.data);
      } catch (error) {
        return error.response
      }
    },
    // Update
    async UpdateUserObj({ commit }, data) {
      try {
        const response = await axiosInstance.put(
          `${import.meta.env.VITE_APP_BACKEND_API}/usuarios/${data.id}/`,
          data
        );
        return response;
      } catch (error) {
        return error.response
      }
    },
    // Destroy
    async DeactivateUserObj({ commit }, id) {
      try {
        const response = await axiosInstance.post(
          `${import.meta.env.VITE_APP_BACKEND_API}/api/deactivate/${id}/`
        );
        return response;
      } catch (error) {
        return error.response
      }
    },
    // Password reset request
    async ForgotPass({ commit }, email) {
      try {
        const response = await axiosInstance.post("/api/password_reset/", {
          email: email,
        });
        return response;
      } catch (error) {
        return error.response
      }
    },
    // Password reset confirm
    async PasswordReset({ commit }, data) {
      try {
        const response = await axiosInstance.post("/api/password_reset/confirm/",
          data
        );
        return response;
      } catch (error) {
        return error.response
      }
    }
  },
  getters: {},
  modules: {},
};
