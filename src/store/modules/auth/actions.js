let timer;
import { getFirestore, collection, getDocs, addDoc } from '@firebase/firestore';
import db from '../../../firebase';

export default {
  async login(context, payload) {
    console.log(payload, context)
    return context.dispatch('auth', {
      ...payload,
      mode: 'login',
    });
  },
  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup'
    });
  },

  async auth(context, payload) {
    const mode = payload.mode;
    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBSXXrHVv5-IFkmwKTxsEpov9_S32wOeB4';

    if (mode === 'signup') {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBSXXrHVv5-IFkmwKTxsEpov9_S32wOeB4';
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );
      throw error;
    }

    if (response.ok && mode === 'signup') {
      const colRef = collection(db, 'users')
      const dataObj = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role,
        userId: responseData.localId,
        position: "pilot",
        phoneNumber: 3212413,
        workerId: 3232,
      }
      const docRef = await addDoc(colRef, dataObj)
    }

    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);

    context.commit('setUser', {
      role: payload.role,
      token: responseData.idToken,
      userId: responseData.localId,
    });
  },

  async roleID({ commit }, userId) {
    try {
      const documents = [];
      const querySnapshot = await getDocs(collection(db, 'users'));

      querySnapshot.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id });
      });

      const userRoles = documents
        .filter((el) => el.userId === userId)
        .map((user) => user.role);

      commit('setUserRoles', userRoles[0]);
      if (userRoles[0] != undefined) {
        localStorage.setItem('roleId', userRoles[0]);
      }
      return userRoles[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      context.commit('setUser', {
        // role: 22,
        token: token,
        userId: userId
      });
    }
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');

    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null,
      roleId: null,
    });
  },
};