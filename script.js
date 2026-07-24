document.addEventListener('DOMContentLoaded', function() {
    // === ОТКРЫТИЕ КОНВЕРТА ===
    const envelope = document.querySelector('.envelope');
    const seal = document.querySelector('.seal');
    const openBtn = document.getElementById('open-invite');
    const music = document.getElementById('wedding-music');
    const wrapper = document.getElementById('content-wrapper');
    const mainScreen = document.getElementById('main-screen');

    function openEnvelope() {
        gsap.to(seal, {scale: 0.1, y: -100, opacity: 0, duration: 1});
        gsap.to(envelope, {y: '-120%', rotation: -10, duration: 1.5, ease: "power2.inOut", onComplete: () => {
            mainScreen.classList.add('hidden');
            wrapper.classList.remove('hidden');
            music.play();
            animateOnScroll(); 
        }});
    }

    [envelope, openBtn].forEach(el => el.addEventListener('click', openEnvelope));

    // === ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ===
    const countDownDate = new Date("September 19, 2026 17:00:00").getTime();
    
    setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }, 1000);

    // === КАЛЕНДАРЬ (упрощенный вариант без внешних либ) ===
    document.querySelector('.btn-add-calendar').addEventListener('click', function(e){
        e.preventDefault();
        alert('Чтобы добавить событие:\n1. Откройте Google Календарь\n2. Нажмите "Создать"\n3. Введите: Свадьба Кирилла и Александры, 19.09.2026');
    });

    // === ПРОГРАММА (АНИМАЦИЯ ПОЯВЛЕНИЯ) ===
    function animateOnScroll() {
        const items = document.querySelectorAll('.event-item');
        items.forEach(item => {
            if (item.offsetTop < window.scrollY + window.innerHeight - 50) {
                item.classList.add('show');
            }
        });
    }
    window.addEventListener('scroll', animateOnScroll);

    // === ЯНДЕКС КАРТЫ ===
    let map;
    ymaps.ready(init);
    function init(){
        map = new ymaps.Map("map", {
            center: [56.1365, 47.2395], // Пример координат центра Чебоксар
            zoom: 13
        });
        
        // Метка ЗАГСа
        const placemarkZAGS = new ymaps.Placemark([56.146289, 47.216639], {
            balloonContentHeader: 'ЗАГС',
            balloonContentBody: 'пр-кт. Московский д.38/5'
        });

        // Метка Банкета
        const placemarkBanquet = new ymaps.Placemark([56.141893, 47.253355], {
            balloonContentHeader: 'Банкетный зал "Мелодия"',
            balloonContentBody: 'Ярославская ул., 29'
        });

        map.geoObjects.add(placemarkZAGS);
        map.geoObjects.add(placemarkBanquet);
    }

    function calcRoute(type) {
        let lat, lon;
        
        if (type === 'ЗАГС') {
            [lat, lon] = [56.146289, 47.216639];
        } else if (type === 'Банкет') {
            [lat, lon] = [56.141893, 47.253355];
        }

        const url = `https://maps.yandex.ru/?ll=${lon},${lat}&z=16&pt=${lon},${lat}`;
        window.location.href = url;
    }

    // === RSVP ФОРМА ===
    // Объявляем форму здесь!
    const rsvpForm = document.getElementById('rsvp-form'); // <-- Добавил эту строку

    rsvpForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Отменяем стандартную отправку формы

        const formData = new FormData(rsvpForm); // Собираем все поля формы
        
        // Формируем объект данных для передачи
        const dataToSend = {
            name: formData.get('name'),          // Имя гостя
            attendance: formData.get('attendance'),// Будет присутствовать?
            transfer: formData.get('transfer'),   // Нужен ли трансфер?
            children: formData.get('children'),    // Будет ли ребенок?
            allergy: formData.get('allergy'),     // Аллергии / предпочтения в еде
            alcohol: formData.get('alcohol'),     // Какой алкоголь предпочитаете?
            comment: formData.get('comment')      // Комментарий
        };

        try {
            // Отправляем данные по адресу веб-приложения Apps Script
            const response = await fetch(
                'ВАШ_АДРЕС_EXEC', // Не забудь вставить свой URL из развёртывания Apps Script
                { method: 'POST', body: JSON.stringify(dataToSend), headers: {'Content-Type': 'application/json'} }
            );
            
            if (!response.ok) throw new Error(`Ошибка при отправке данных: ${await response.text()}`);

            showThankYou(); // Показываем спасибо-экран после успешной отправки
        } catch (error) {
            alert('Произошла ошибка при отправке данных.');
            console.error(error.message);
        }
    });

    // Функция благодарности тоже должна быть здесь
    function showThankYou() {
        const modal = document.createElement('div');
        modal.className = 'thank-you-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <i class="fa-solid fa-heart"></i>
                <h2>Спасибо!</h2>
                <p>До встречи<br>19 сентября 2026 ❤️</p>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 100); // Плавное появление
        setTimeout(() => { // Через 3 секунды плавно скрываем окно
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 400); // И удаляем его через полсекунды после исчезновения
        }, 3000);
    }

    // GSAP нужен для красивой анимации конверта. Подключите его в head:
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
});

