const model = {}

model.currentUser = undefined
model.conversations = []
model.currentConversation = undefined

model.register = async (data) => {
    try {
        const response = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        firebase.auth().currentUser.updateProfile({
            displayName: `${data.firstName} ${data.lastName}`
        })
        firebase.auth().currentUser.sendEmailVerification()
    } catch (err) {
        alert(err.message)
        console.log(err)
    }
}

model.login = (data) => {
    try {
        firebase.auth().signInWithEmailAndPassword(data.email, data.password)
        // if(response && response.user.emailVerified){
        //     model.currentUser = {
        //         email: response.user.email,
        //         displayName: response.user.displayName
        //     }
        //     view.setActiveScreen('chatPage')
        // } else {
        //     alert('Please verify your email')
        // }
    } catch (err) {
        alert(err.message)
        console.log(err)
    }
}

model.getConversations = async () => {
    const response = await firebase.firestore().collection('conversations').where('users','array-contains',model.currentUser.email).get()
    model.conversations = getManyDocument(response)
    if(model.conversations.length > 0){
        model.currentConversation = model.conversations[0]
        view.showCurrentConversation()
    }
}

model.addMessage = (message) => {
    dataToUpdate = {
        messages: firebase.firestore.FieldValue.arrayUnion(message)
    }
    firebase.firestore().collection('conversations').doc(model.currentConversation.id).update(dataToUpdate)
}

model.listenConversationChange = () => {
    let isFirstRun = true
    firebase.firestore().collection('conversations').where('users','array-contains',model.currentUser.email).onSnapshot((snapshot) => {
        if(isFirstRun){
            isFirstRun = false
            return
        }
        for (oneChange of snapshot.docChanges()){
            const docData = getOneDocument(oneChange.doc)
            if(docData.id === model.currentConversation.id) {
                model.currentConversation = docData
                view.addMessage(model.currentConversation.messages[model.currentConversation.messages.length - 1])
                view.scrollToEndElement()
            }
        }
    })
}