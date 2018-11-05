const chat = document.querySelector('.js-chat')
const messageContainer = document.querySelector('.js-messageContainer')
const options = document.querySelector('.js-options')
const optionsBtn = document.querySelector('.js-optionsBtn')
const dots = document.querySelector('.js-dots')
const beemo = document.querySelector('.js-beemo')

const inputForm = document.querySelector('.js-inputForm')
const inputField = document.querySelector('.js-inputField')
const speakBtn = document.querySelector('.js-speakBtn')

const minus = document.querySelector('.js-minus')
const plus = document.querySelector('.js-plus')

const colorLight = document.querySelector('.js-light')
const colorDark = document.querySelector('.js-dark')
const colorGreen = document.querySelector('.js-green')

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

let zoom = 100

minus.addEventListener('click', () => zoomUI('out'))
plus.addEventListener('click', () => zoomUI())

colorLight.addEventListener('click', () => {
    chat.classList.add('light')
    chat.classList.remove('dark')
    chat.classList.remove('green')
})

colorDark.addEventListener('click', () => {
    chat.classList.remove('light')
    chat.classList.add('dark')
    chat.classList.remove('green')
})

colorGreen.addEventListener('click', () => {
    chat.classList.remove('light')
    chat.classList.remove('dark')
    chat.classList.add('green')
})

optionsBtn.addEventListener('click', () => {
    options.classList.toggle('options')
    console.log('yolo')
})

speakBtn.addEventListener('click', () => {
    beemo.classList.toggle('Chat-beemo--listening')
    chat.classList.toggle('recording')
    console.log('start recording')
    recognition.start()
})

inputForm.addEventListener('submit', (e) => {
    const userMessage = inputField.value

    e.preventDefault()

    if (userMessage === 'clear') {
        clear()
    } else if (!userMessage) {
        return
    } else {
        addMessage(userMessage)
    }

    inputForm.reset()
    inputField.focus()
})

recognition.onresult = function (event) {
    let current = event.resultIndex
    let transcript = event.results[current][0].transcript

    console.log('results are in: ' + transcript)

    addMessage(transcript)

    beemo.classList.remove('Chat-beemo--listening')
    chat.classList.remove('recording')
}

function zoomUI(zoomDirection) {
    document.body.style.zoom = zoomDirection === 'out'
        ? `${zoom -= 10}%`
        : `${zoom += 10}%`
}

function addMessage(message) {
    const messageDiv = document.createElement('div')
    const messageBubble = `<span class="Chat-bubble">${message}</span>`

    messageDiv.classList.add('Chat-message', 'Chat-message--user')
    messageDiv.innerHTML += messageBubble

    messageContainer.insertBefore(messageDiv, dots)
    messageContainer.classList.add('Chat-messages--typing')

    if (messageContainer.scrollHeight > messageContainer.clientHeight) {
        chat.classList.add('Chat--overflown')
    }

    getReply(message)
}

function getReply(message) {
    let url = 'https://chatbotgroup1qna.azurewebsites.net/qnamaker/knowledgebases/5b0943a9-3c83-4c7b-8826-408bf91b6c26/generateAnswer'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'EndpointKey d994b54e-cd11-4472-884b-088f34e59d4e'
        },
        body: JSON.stringify({ 'question': message })
    })
        .then(response => response.json())
        .then(reply => addReply(reply.answers[0].answer))
        .catch(error => console.log('problemz: ', error.message))
}

function addReply(reply) {
    let messageDiv = document.createElement('div')
    let messageBubble = `<span class="Chat-bubble">${reply}</span>`

    messageDiv.classList.add('Chat-message', 'Chat-message--bot')
    messageDiv.innerHTML += messageBubble;

    setTimeout(() => {
        messageContainer.classList.remove('Chat-messages--typing')
        messageContainer.insertBefore(messageDiv, dots)

        if (messageContainer.scrollHeight > messageContainer.clientHeight) {
            chat.classList.add('Chat--overflown')
        }
    }, 5000)
}

function clear() {
    const messages = document.querySelectorAll('.Chat-message')

    messages.forEach(message => {
        if (message.classList.contains('js-dots')) {
            return
        } else {
            message.remove()
        }
    })

    chat.classList.remove('Chat--overflown')
    messageContainer.classList.remove('Chat-messages--typing')
}