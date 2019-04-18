import firebase from '../firebaseConfig';
let firebaseRef = firebase.firebase;
let db = firebase.db;

const state = {
	userAuth: firebaseRef.auth().currentUser,
	userData: {},
	hiddenRooms: ['HYDpgApDJv0RmjWiiw3q', 'r6zRJzXqfHLuslFsEF1n'],
	defaultUserImage:
		'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Flh3.googleusercontent.com%2F-Zs7cWeyXzTI%2FAAAAAAAAAAI%2FAAAAAAAAAB4%2F5PA9c08gzhQ%2Fphoto.jpg&f=1'
};

const getters = {
	getUserData: (state) => {
		if (Object.keys(state.userData).length == 0) {
			console.log('NO User data to be found');
			return null;
		}
		return state.userData;
	},
	getUserAuth: (state) => {
		return state.userAuth;
	},
	getProfileImageLink: (state) => {
		if (Object.keys(state.userData).length == 0 || state.userData.profileImageLink == undefined) {
			return state.defaultUserImage;
		}
		else {
			return state.userData.profileImageLink;
		}
	},
	getHiddenRoomsIDs: (state) => {
		if (state.hiddenRooms != null || state.hiddenRooms != undefined) {
			return state.hiddenRooms;
		}
		return [];
	},
	isUserSignedIn: (state) => {
		if (Object.keys(state.userData).length == 0 || state.userAuth == null) {
			return false;
		}
		else {
			return true;
		}
	},
	isUserVerified: (state) => {
		if (state.userAuth == null) {
			return false;
		}
		else {
			// ? emailVerified
			return state.userAuth.emailVerified;
		}
	}
};

const mutations = {
	setUserAuth(state) {
		state.userAuth = firebaseRef.auth().currentUser;
	},
	setUserData(state, newData) {
		state.userData = newData;
	},
	updateUserPictureURL(state, newData) {
		state.userData.profileImageLink = newData;
	},
	clearUser(state) {
		state.userAuth = null;
		state.userData = {};
	},
	setHiddenRooms(state, payload) {
		state.hiddenRooms = payload;
	},
	updateUserHiddenrooms(state, payload) {
		if (payload.addId) {
			state.hiddenRooms.push(payload.newId);
		}
		else {
			state.hiddenRooms = state.hiddenRooms.filter(function(item) {
				return item != payload.newId;
			});
		}
	}
};

// Do not check for valid data because that should be handled with vue-validate and generally in the clients
const actions = {
	// TODO BIG TODO Change most of these to async and await instead of promise for readibility
	// Making the user
	async createUserWithEmail({}, payload) {
		console.log('createUserWithEmail', payload);
		console.log('Creating User With email module...');
		return firebaseRef.auth().createUserWithEmailAndPassword(payload.email, payload.password);
	},
	async lookForuserName({}, userName) {
		return db.collection('Users').where('userName', '==', userName).get();
	},
	async sendEmailVerification({}) {
		return firebaseRef.auth().currentUser.sendEmailVerification();
	},
	async createUserInDB({commit}, payload) {
		console.log('Creating User in DB...');
		commit('setUserData', payload);
		let userUID = firebaseRef.auth().currentUser.uid;
		return await db.collection('Users').doc(userUID).set(payload);
		// Todo: configure rules in firebase so only the user with his UID can change his data
	},
	async makeNewUser({dispatch, commit}, payload) {
		console.log('Making User. Module...');
		let madeUser = await dispatch('createUserWithEmail', payload.signUp);
		commit('setUserAuth');
		dispatch('sendEmailVerification');
		await dispatch('createUserInDB', payload.newUserData);
		return madeUser;
	},
	// Todo: figure out how to test better so you dont have to make a new user every time
	// Updating users data
	async updateProfileImgLink({commit, dispatch}, filePath) {
		console.log('Updating Profile Image link...');
		let imageLink = await dispatch('getPicture', filePath);
		// imgLink.catch return will not work
		console.log('TCL: imageLink', imageLink);
		commit('updateUserPictureURL', imageLink);
		let userUID = firebaseRef.auth().currentUser.uid;
		let userDoc = db.collection('Users').doc(userUID);
		return await userDoc.update({
			profileImageLink: imageLink
		});
	},
	// Todo: when done. Have it so rooms render correctly according to the data from the server
	async updateUsersHiddenRooms({}, payload) {
		// ? Could copy this implementation for updating the users favorite rooms
		console.log('Updating users Rooms...');
		let userUID = firebaseRef.auth().currentUser.uid;
		let userReference = db.collection('Users').doc(userUID);
		await userReference.update({
			hiddenRooms: payload
		});
	},
	// Getting user data
	async getUserData({commit}) {
		let userUID = firebaseRef.auth().currentUser.uid;
		let userData = await db.collection('Users').doc(userUID).get();
		commit('setUserData', userData.data());
		commit('setHiddenRooms', userData.data().hiddenRooms);
		return userData.data();
	},
	async logInUserAuth({commit, dispatch}, payload) {
		console.log('Logging in User from userModule...');
		let signedIn = await firebaseRef.auth().signInWithEmailAndPassword(payload.email, payload.password);
		if (signedIn.user) {
			commit('setUserAuth');
		}
		return await dispatch('getUserData');
	},
	// Sign Out User and deleting user
	async signOutUserAuth({}) {
		console.log('Sign Out User From userModule..');
		return await firebaseRef.auth().signOut();
	},
	// This method is here for additional things that needs to be updated in the database
	async signOutUserTotal({dispatch, getters}) {
		// Todo: compare if anything changed so there is not an extra request
		await dispatch('updateUsersHiddenRooms', getters.getHiddenRoomsIDs);
		return await dispatch('signOutUserAuth');
	},
	async deleteUser({}) {
		console.log('Deleting User From Module...');
		var user = firebaseRef.auth().currentUser;
		return user.delete();
	}
};

export default {
	actions,
	mutations,
	getters,
	state
};
