/* eslint-disable */
import moment from 'moment';
import firebase from '../../firebaseConfig';
let db = firebase.db;
let firebaseRef = firebase.firebase;
export default {
	name: 'browse',
	data() {
		return {
			allRooms: [],
			newRoomName: null,
			newRoomDesc: null,
			roomPicture: null,
			roomPictureUpload: null,
			dialog: false
		};
	},
	created() {},
	methods: {
		getRealTimeChatRooms() {
			db.collection('chatRooms').orderBy('dateCreated').onSnapshot((doc) => {
				console.log('TCL: getRealTimeChatRooms -> firstRoomData', doc.docs[0].data())
				this.allRooms = [];
				// Todo: write a better name instead of kek. kek = room 
				// Todo: Filter out rooms that are hidden  
				console.log('amount of rooms ' + doc.docs.length)
				doc.docs.forEach((kek) => {
					// This is nasty PLEASE change it 
					if (kek.exists && !this.$store.getters.getHiddenRoomsIDs.includes(kek.id)) {
						let room = {
							roomId: kek.id,
							roomData: kek.data()
						};
						let fullPath = `chatRooms/${room.roomId}/${room.roomData.roomPicture}`;
						this.getPicture(fullPath)
							.then((res) => {
								room['urlPicture'] = res;
								this.allRooms.push(room);
							})
							.catch((err) => {
								console.log('TCL: getRealTimeChatRooms -> err', err);
								room['urlPicture'] = null;
								this.allRooms.push(room);
							});
					}
				});
				this.filterOutCards();
			});
		},
		makeNewRoom() {
			// ! Room Picture gave an undefined
			let roomData = this.setNewRoomData();
			this.$store.dispatch('makeNewRoom', roomData)
				.then((res) => {
					this.dialog = false;
					console.log("New Room Id is =>" + res.id);
					if (this.roomPicture == null || res.id == null) {
						console.log('did not try to upload picture');
					} else {
						let fullPath = `chatRooms/${res.id}/${this.roomPictureUpload.name}`;
						this.uploadRoomPicture(fullPath)
							.then((res) => {
								console.log(res);
							})
							.catch((err) => {
								console.log(err);
							});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		setNewRoomData() {
			let roomData = {
				roomName: this.newRoomName,
				msgLength: 0,
				dateCreated: new Date(),
				roomDescription: this.newRoomDesc,
				roomPicture: this.roomPictureUpload.name,
				users: [{
					userName: this.$store.getters.getUserData.userName,
					userUID: firebaseRef.auth().currentUser.uid,
					dateJoined: new Date(),
					userProfileImage: this.$store.getters.getProfileImageLink
				}]
			};
			console.log(`New Room data will be =>` + roomData);
			return roomData;
		},
		// Module GET And POST
		getPicture(filePath) {
			return this.$store.dispatch('getPicture', filePath);
		},
		uploadRoomPicture(path) {
			// Todo: verify that roomPicture is a actual file\
			// Todo: add metadata
			let fileData = {
				file: this.roomPictureUpload,
				fileMeta: {},
				path: path
			};
			console.log(path);
			return this.$store.dispatch('uploadPicture', fileData);
		},
		// computed With parameters
		showAmountOfUsers(usersAmount) {
			if (usersAmount == 1) {
				return `${usersAmount} user`
			}
			return `${usersAmount} users`
		},
		convertTime(time) {
			return moment.unix(time).format('MMMM Do');
		},
		hideCard(roomId) {
			let payload = {
				newId: roomId,
				addId: true
			}
			this.$store.commit('updateUserHiddenrooms', payload);
			this.filterOutCards();
		},
		filterOutCards() {
			var index;
			this.allRooms.forEach((room) => {
				if (this.$store.getters.getHiddenRoomsIDs.includes(room.roomId)) {
					index = this.allRooms.indexOf(room);
					this.allRooms.splice(index, 1);
				}
			});
		},
		// File changes
		onFileChange(e) {
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length) return;
			this.roomPictureUpload = files[0];
			this.createImage(files[0]);
		},
		createImage(file) {
			var reader = new FileReader();

			reader.onload = (e) => {
				this.roomPicture = e.target.result;
			};
			reader.readAsDataURL(file);
		},
		removeImage() {
			this.roomPicture = null;
			this.roomPictureUpload = null;
		}
	},
	mounted() {
		this.getRealTimeChatRooms();
	}
};