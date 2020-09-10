const view = {}
view.setActiveScreen = (screenName, fromCreateConversation = false) => {
    switch (screenName) {
        case 'registerPage':
            document.getElementById('app').innerHTML = component.registerPage
            const registerForm = document.getElementById('register_form')
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const data = {
                    firstName: registerForm.firstName.value,
                    lastName: registerForm.lastName.value,
                    email: registerForm.email.value,
                    password: registerForm.password.value,
                    confirmPassword: registerForm.confirmPassword.value
                }
                controller.register(data)
            })
            document.getElementById('redirect_to_login').addEventListener('click', () => {
                view.setActiveScreen('loginPage')
            })
            break
        case 'loginPage':
            document.getElementById('app').innerHTML = component.loginPage
            const loginForm = document.getElementById('login_form')
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const data = {
                    email: loginForm.email.value,
                    password: loginForm.password.value
                }
                controller.login(data)
            })
            document.getElementById('redirect_to_register').addEventListener('click', () => {
                view.setActiveScreen('registerPage')
            })
            break
        case 'chatPage':
            document.getElementById('app').innerHTML = component.chatPage
            const sendMessageForm = document.getElementById('send_message_form')
            const addUserForm = document.getElementById('add_user_form')
            sendMessageForm.message.addEventListener('click',() => {
                view.hideNotification(model.currentConversation.id)
            })
            sendMessageForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const message = {
                    content: sendMessageForm.message.value,
                    createdAt: new Date().toISOString(),
                    owner: model.currentUser.email
                }
                if (sendMessageForm.message.value.trim() !== '') {
                    model.addMessage(message)
                    sendMessageForm.message.value = ''
                }
            })
            addUserForm.addEventListener('submit',(e) => {
                e.preventDefault()
                const data = addUserForm.email.value
                addUserForm.email.value = ''
                controller.addUser(data)
            })
            document.getElementById('create_conversation').addEventListener('click', () => {
                view.setActiveScreen('createConversationPage')
            })
            if (fromCreateConversation) {
                view.showCurrentConversation()
                view.showConversations()
            } else {
                model.getConversations()
                model.listenConversationChange()
            }
            break
        case 'createConversationPage':
            document.getElementById('app').innerHTML = component.createConversationPage
            document.getElementById('redirect_to_chat').addEventListener('click', () => {
                view.setActiveScreen('chatPage', true)
            })
            const createConversationForm = document.getElementById('create_conversation_form')
            createConversationForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const data = {
                    title: createConversationForm.title.value,
                    email: createConversationForm.email.value
                }
                controller.createConversation(data)
            })
            break
    }
}

view.setErrorMessage = (elementId, content) => {
    document.getElementById(elementId).innerText = content
}

view.addMessage = (message) => {
    const messageWrapper = document.createElement('div')
    messageWrapper.classList.add('message')
    if (message.owner === model.currentUser.email) {
        messageWrapper.classList.add('mine')
        messageWrapper.innerHTML = `<div class="content">${message.content}</div>`
    } else {
        messageWrapper.classList.add('their')
        messageWrapper.innerHTML = `
        <div class="owner">${message.owner}</div>
        <div class="content">${message.content}</div>
        `
    }
    document.querySelector('.list_messages').appendChild(messageWrapper)
}

view.showCurrentConversation = () => {
    document.querySelector('.conversation_title').innerText = model.currentConversation.title
    document.querySelector('.list_messages').innerHTML = ''
    document.querySelector('.list_users').innerHTML = ''
    for (let message of model.currentConversation.messages) {
        view.addMessage(message)
    }
    for (user of model.currentConversation.users){
        view.addUser(user)
    }
    view.scrollToEndElement()
}

view.scrollToEndElement = () => {
    const element = document.querySelector('.list_messages')
    element.scrollTop = element.scrollHeight
}

view.showConversations = () => {
    for (let conversation of model.conversations) {
        view.addConversation(conversation)
    }
}

view.addConversation = (conversation) => {
    const conversationWrapper = document.createElement('div')
    conversationWrapper.classList.add('conversation')
    conversationWrapper.classList.add('cursor_pointer')
    conversationWrapper.id = conversation.id
    if (conversation.id === model.currentConversation.id) {
        conversationWrapper.classList.add('current')
    }
    conversationWrapper.innerHTML = `
        <div class="left_conversation_title">${conversation.title}</div>
        <div class="num_of_user">${conversation.users.length} users</div>
        <div class="notification"></div>
    `
    conversationWrapper.addEventListener('click', () => {
        model.currentConversation = model.conversations.filter(item => item.id === conversation.id)[0]
        view.showCurrentConversation()
        document.querySelector('.conversation.current').classList.remove('current')
        conversationWrapper.classList.add('current')
        view.hideNotification(conversation.id)
    })
    document.querySelector('.list_conversations').appendChild(conversationWrapper)
}

view.addUser = (user) => {
    const addWrapper = document.createElement('div')
    addWrapper.classList.add('user_email')
    addWrapper.title = user
    addWrapper.innerHTML = user
    document.querySelector('.list_users').appendChild(addWrapper)
}

view.addUserInConversation = (numberUser) => {
    document.querySelector('.conversation.current .num_of_user').innerText = `${numberUser} users`
}

view.showNotification = (docId) => {
    const conversation = document.getElementById(docId)
    conversation.querySelector('.notification').style.display = 'block'
}

view.hideNotification = (docId) => {
    const conversation = document.getElementById(docId)
    conversation.querySelector('.notification').style.display = 'none'
}