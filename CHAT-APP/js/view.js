const view = {}
view.setActiveScreen = (screenName) => {
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
            document.getElementById('create_conversation').addEventListener('click',()=>{
                view.setActiveScreen('createConversationPage')
            })
            const sendMessageForm = document.getElementById('send_message_form')
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
            model.getConversations()
            model.listenConversationChange()
            break
        case 'createConversationPage':
            document.getElementById('app').innerHTML = component.createConversationPage
            document.getElementById('redirect_to_chat').addEventListener('click',()=>{
                view.setActiveScreen('chatPage')
            })
            const createConversationForm = document.getElementById('create_conversation_form')
            createConversationForm.addEventListener('submit',(e)=>{
                e.preventDefault()
                const newConversation = {
                    createdAt: new Date().toISOString(),
                    messages: [],
                    title: createConversationForm.title.value,
                    users: createConversationForm.email.value.split(' ')
                }
                newConversation.users.push(model.currentUser.email)
                if (createConversationForm.title.value.trim() !== '' && createConversationForm.email.value.trim() !== '') {
                    model.addConversation(newConversation)
                    view.setActiveScreen('chatPage')
                }
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
    for (let message of model.currentConversation.messages) {
        view.addMessage(message)
    }
    view.scrollToEndElement()
}

view.scrollToEndElement = () => {
    const element = document.querySelector('.list_messages')
    element.scrollTop = element.scrollHeight
}

view.showConversations = () => {
    for(let conversation of model.conversations){
        view.addConversation(conversation)
    }
}

view.addConversation = (conversation) => {
    const conversationWrapper = document.createElement('div')
    conversationWrapper.classList.add('conversation')
    conversationWrapper.classList.add('cursor_pointer')
    if(conversation.id === model.currentConversation.id){
        conversationWrapper.classList.add('current')
    }
    conversationWrapper.innerHTML = `
        <div class="left_conversation_title">${conversation.title}</div>
        <div class="num_of_user">${conversation.users.length} users</div>
    `
    conversationWrapper.addEventListener('click',()=>{
        model.currentConversation = model.conversations.filter(item => item.id === conversation.id)[0]
        view.showCurrentConversation()
        document.querySelector('.conversation.current').classList.remove('current')
        conversationWrapper.classList.add('current')
    })
    document.querySelector('.list_conversations').appendChild(conversationWrapper)
}