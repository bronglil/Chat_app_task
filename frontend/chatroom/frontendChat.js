document.addEventListener('DOMContentLoaded', () => {
    const base_url = `http://localhost:3014`;

    const display_error_popup = () => {
        document.querySelector('.error-message-popup').classList.add('active');
    };

    const hide_error_popup = () => {
        document.querySelector('.error-message-popup').classList.remove('active');
    };

    hide_error_popup();
    document.querySelector('.close-btn').addEventListener('click', hide_error_popup);

    const update_chat_window = (chat_data) => {
        const chat_window = document.querySelector('.chat-window');
        chat_window.innerHTML = chat_data.map(
            entry => `<div class="chat-entry">
                        <span class="author">${entry.author}</span>
                        <span class="delimiter">:&nbsp;</span>
                        <span class="message">${entry.message}</span>
                      </div>`
        ).join('');
    };

    const fetch_chat_messages = async () => {
        try {
            const response = await fetch(`${base_url}/chat`);
            if (response.status !== 200) throw new Error();
            const chat_data = await response.json();
            update_chat_window(chat_data);
        } catch {
            display_error_popup();
        }
    };

    setInterval(fetch_chat_messages, 500);

    const censor_message_content = async (message) => {
        try {
            const response = await fetch(`${base_url}/censorMessage?message=${encodeURIComponent(message)}`);
            if (response.status !== 200) throw new Error();
            const { censoredMessage } = await response.json();
            return censoredMessage;
        } catch {
            display_error_popup();
            return null;
        }
    };

    const send_message = async () => {
        const author = document.querySelector('.username-input').value.trim();
        const message = document.querySelector('.new-message-input').value.trim();
        if (!author || !message) return;

        const censored_message = await censor_message_content(message);
        if (!censored_message) return;

        try {
            const response = await fetch(`${base_url}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author, message: censored_message })
            });
            if (response.status !== 200) throw new Error();
            const chat_data = await response.json();
            update_chat_window(chat_data);
            document.querySelector('.new-message-input').value = '';
            toggle_send_button();
        } catch {
            display_error_popup();
        }
    };

    const toggle_send_button = () => {
        const send_button = document.querySelector('.send-message-btn');
        const author = document.querySelector('.username-input').value.trim();
        const message = document.querySelector('.new-message-input').value.trim();
        send_button.disabled = !author || !message;
        send_button.style.cursor = send_button.disabled ? 'default' : 'pointer';
        send_button.style.backgroundColor = send_button.disabled ? '#cccccc' : '';
    };

    document.querySelector('.send-message-btn').addEventListener('click', send_message);

    document.querySelector('.new-message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !document.querySelector('.send-message-btn').disabled) {
            e.preventDefault();
            send_message();
        }
    });

    const clear_chat_messages = async () => {
        try {
            const response = await fetch(`${base_url}/chat`, { method: 'DELETE' });
            if (response.status !== 200) throw new Error();
            const chat_data = await response.json();
            update_chat_window(chat_data);
        } catch {
            display_error_popup();
        }
    };

    document.querySelector('.clear-chat-btn').addEventListener('click', clear_chat_messages);

    document.querySelectorAll('.username-input, .new-message-input').forEach(input => {
        input.addEventListener('input', toggle_send_button);
    });
    console.log('Script loaded');
    toggle_send_button();
});
