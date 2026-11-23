document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#order-form');
    if (!form) return;

    const fields = {
        name: form.querySelector('#order-name'),
        email: form.querySelector('#order-email'),
        phone: form.querySelector('#order-phone'),
        topic: form.querySelector('#order-topic'),
        agreement: form.querySelector('#order-agreement')
    };

    const errors = {
        name: document.querySelector('#name-error'),
        email: document.querySelector('#email-error'),
        phone: document.querySelector('#phone-error'),
        topic: document.querySelector('#topic-error'),
        agreement: document.querySelector('#agreement-error')
    };

    const success = document.querySelector('#order-success');

    function setError(name, message) {
        const field = fields[name];
        const error = errors[name];
        if (!field || !error) return;

        if (message) {
            field.setAttribute('aria-invalid', 'true');
            error.textContent = message;
        } else {
            field.removeAttribute('aria-invalid');
            error.textContent = '';
        }
    }

    function validate() {
        let isValid = true;

        if (!fields.name.value.trim() || fields.name.value.trim().length < 2) {
            setError('name', 'Введите имя (минимум 2 символа).');
            isValid = false;
        } else {
            setError('name', '');
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(fields.email.value.trim())) {
            setError('email', 'Введите корректный e-mail.');
            isValid = false;
        } else {
            setError('email', '');
        }

        const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phonePattern.test(fields.phone.value.trim())) {
            setError('phone', 'Телефон в формате: +7 (900) 000-00-00');
            isValid = false;
        } else {
            setError('phone', '');
        }

        if (!fields.topic.value) {
            setError('topic', 'Выберите тему заявки.');
            isValid = false;
        } else {
            setError('topic', '');
        }

        if (!fields.agreement.checked) {
            setError('agreement', 'Подтвердите согласие на обработку данных.');
            isValid = false;
        } else {
            setError('agreement', '');
        }

        return isValid;
    }

    Object.entries(fields).forEach(([name, field]) => {
        if (!field) return;

        const handler = () => {
            if (field.getAttribute('aria-invalid') === 'true') {
                setError(name, '');
            }
        };

        field.addEventListener('input', handler);
        field.addEventListener('change', handler);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (success) success.hidden = true;

        if (!validate()) return;

        if (success) {
            success.textContent = 'Заявка подготовлена. Мы свяжемся с вами.';
            success.hidden = false;
        }

        form.reset();
        Object.keys(fields).forEach((name) => setError(name, ''));
    });
});