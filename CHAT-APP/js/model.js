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
    const response = await firebase.firestore().collection('conversations').where('users', 'array-contains', model.currentUser.email).get()
    model.conversations = getManyDocument(response)
    if (model.conversations.length > 0) {
        model.currentConversation = model.conversations[0]
        view.showCurrentConversation()
        view.showConversations()
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
    firebase.firestore().collection('conversations').where('users', 'array-contains', model.currentUser.email).onSnapshot((snapshot) => {
        if (isFirstRun) {
            isFirstRun = false
            return
        }
        for (oneChange of snapshot.docChanges()) {
            const docData = getOneDocument(oneChange.doc)
            if(oneChange.type === 'modified'){
                if (docData.id === model.currentConversation.id) {
                    if (model.currentConversation.users.length !== docData.users.length){
                        view.addUser(docData.users[docData.users.length - 1])
                        document.querySelector('.conversation.current .num_of_user').innerHTML = `${docData.users.length} users`
                    } else {
                        view.addMessage(docData.messages[docData.messages.length - 1])
                        view.scrollToEndElement()
                    }
                    model.currentConversation = docData
                }
                for (let i = 0; i < model.conversations.length; i++) {
                    if (model.conversations[i].id === docData.id) {
                        model.conversations[i] = docData
                    }
                }
            }
            if (oneChange.type === 'added'){
                model.conversations.push(docData)
                view.addConversation(docData)
            }
        }
    })
}

model.createConversation = ({title, email}) => {
    const dataToCreate = {
        createdAt: new Date().toISOString(),
        messages: [],
        title,
        users: [email, model.currentUser.email]
    }
    firebase.firestore().collection('conversations').add(dataToCreate)
    view.setActiveScreen('chatPage', true)
}

model.addUser = (email) => {
    dataToUpdate = {
        users: firebase.firestore.FieldValue.arrayUnion(email)
    }
    firebase.firestore().collection('conversations').doc(model.currentConversation.id).update(dataToUpdate)
}