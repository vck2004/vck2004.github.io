const controller = {}
controller.register = (data) => {
    view.setErrorMessage('first_name_error', data.firstName === '' ? 'Please input first name' : '')
    view.setErrorMessage('last_name_error', data.lastName === '' ? 'Please input last name' : '')
    view.setErrorMessage('email_error', data.email === '' ? 'Please input email' : '')
    view.setErrorMessage('password_error', data.password === '' ? 'Please input password' : '')
    view.setErrorMessage('confirm_password_error', data.confirmPassword === '' ? 'Please input confirm password' : data.confirmPassword === data.password ? '' : `Password didn't match`)
    if (data.firstName !== '' && data.lastName !== '' && data.email !== '' && data.password !== '' && data.confirmPassword === data.password) {
        model.register(data)
    }
}

controller.login = (data) => {
    view.setErrorMessage('email_error', data.email === '' ? 'Please input email' : '')
    view.setErrorMessage('password_error', data.password === '' ? 'Please input password' : '')
    if (data.email !== '' && data.password !== '') {
        model.login(data)
    }
}