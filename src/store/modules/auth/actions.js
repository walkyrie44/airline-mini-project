let timer;
import { getFirestore, collection, getDocs, addDoc } from '@firebase/firestore';
import db from '../../../firebase';

export default {
  async login(context, payload) {
    console.log(payload, context)
    return context.dispatch('auth', {
      ...payload,
      mode: 'login'
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
        role: 2,
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
          role: 2,
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
      token: responseData.idToken,
      userId: responseData.localId
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      context.commit('setUser', {
        token: token,
        userId: userId
      });
    }
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null
    });
  },
};