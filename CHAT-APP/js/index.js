window.onload = () => {
  var firebaseConfig = {
    apiKey: "AIzaSyBAtPEiMM-U9m3D15mF9RAjUCwhi0uX1Nw",
    authDomain: "chat-app-792ec.firebaseapp.com",
    databaseURL: "https://chat-app-792ec.firebaseio.com",
    projectId: "chat-app-792ec",
    storageBucket: "chat-app-792ec.appspot.com",
    messagingSenderId: "765171004040",
    appId: "1:765171004040:web:73aca1871f369a3a5da53d",
    measurementId: "G-36E54Y71Y1"
  };
  firebase.initializeApp(firebaseConfig);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      model.currentUser = {
        email: user.email,
        displayName: user.displayName
      }
      if (user.emailVerified) {
        view.setActiveScreen('chatPage')
      } else {
        firebase.auth().signOut()
        alert('Please verified your email')
      }
    } else {
      view.setActiveScreen('loginPage')
    }
  })
  // templateFirestore()
}







const templateFirestore = async () => {
  // get one
  const docId = 'Nfj14WQ2UYU0OmqdtfTz'
  const response = await firebase.firestore().collection('users').doc(docId).get()
  const user = getOneDocument(response)
  // get many
  const responseMany = await firebase.firestore().collection('users').where('address','==','VN').get()
  const users = getManyDocument(responseMany)
  // create
  const dataToCreate = {
    age: 100,
    name: 'ABC'
  }
  // firebase.firestore().collection('users').add(dataToCreate)
  // update
  const idToUpdate = 'RqSamIuDlSZjAU2jpfgC'
  const dataToUpdate = {
    name: 'Updated',
    address: firebase.firestore.FieldValue.arrayUnion('old')
  }
  firebase.firestore().collection('users').doc(idToUpdate).update(dataToUpdate)
  // delete
  const idToDelete = 'gmStE5sDYtwbw1MhPGsn'
  firebase.firestore().collection('users').doc(idToDelete).delete()
}

const getManyDocument = (response) => {
  const listData = []
  for(let doc of response.docs){
    listData.push(getOneDocument(doc))
  }
  return listData
}

const getOneDocument = (response) => {
  const data = response.data()
  data.id = response.id
  return data
}