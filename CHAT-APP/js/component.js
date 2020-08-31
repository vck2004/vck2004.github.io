const component = {}
component.welcomePage = `
    <h1>Welcome to chat app</h1>
`

component.registerPage = `
<div class="register_container">
<form id="register_form">
    <div class="register_header">MindX chat</div>
    <div class="name_wrapper">
        <div class="input_wrapper">
            <input type="text" placeholder="First name" name="firstName">
            <div class="error" id="first_name_error"></div>
        </div>
        <div class="input_wrapper">
            <input type="text" placeholder="Last name" name="lastName">
            <div class="error" id="last_name_error"></div>
        </div>
    </div>
    <div class="input_wrapper">
        <input type="email" placeholder="Email" name="email">
        <div class="error" id="email_error"></div>
    </div>
    <div class="input_wrapper">
        <input type="password" placeholder="Password" name="password" autocomplete="off">
        <div class="error" id="password_error"></div>
    </div>
    <div class="input_wrapper">
        <input type="password" placeholder="Confirm password" name="confirmPassword" autocomplete="off">
        <div class="error" id="confirm_password_error"></div>
    </div>
    <div class="form_action">
        <div>Already have an account ? <span class="cursor_pointer" id="redirect_to_login">Login</span></div>
        <button class="btn cursor_pointer" type="submit">Register</button>
    </div>
</form>
</div>
`

component.loginPage = `
<div class="login_container">
        <form id="login_form">
            <div class="login_header">MindX chat</div>
            <div class="input_wrapper">
                <input type="email" placeholder="Email" name="email">
                <div class="error" id="email_error"></div>
            </div>
            <div class="input_wrapper">
                <input type="password" placeholder="Password" name="password" autocomplete="off">
                <div class="error" id="password_error"></div>
            </div>
            <div class="form_action">
                <div>Don't have an account ? <span class="cursor_pointer" id="redirect_to_register">Register</span></div>
                <button class="btn cursor_pointer" type="submit">Login</button>
            </div>
        </form>
    </div>
`

component.chatPage = `
<div class="chat_container">
<div class="header">MindX chat</div>
<div class="main">
    <div class="conversation_detail">
        <div class="conversation_title"></div>
        <div class="list_messages"></div>
        <form id="send_message_form">
            <div class="input_wrapper">
                <input type="text" placeholder="Type a message" name="message" autocomplete="off">
            </div>
            <button type="submit"><i class="fa fa-paper-plane cursor_pointer" aria-hidden="true"></i></button>
        </form>
    </div>
</div>
</div>
`