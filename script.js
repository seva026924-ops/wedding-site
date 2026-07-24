document.addEventListener('DOMContentLoaded', function() {
    
    const rsvpForm = document.getElementById('rsvp-form'); 

    
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

    
    document.querySelector('.btn-add-calendar').addEventListener('click', function(e){
        e.preventDefault();
        alert('Чтобы добавить событие:\n1. Откройте Google Календарь\n2. Нажмите "Создать"\n3. Введите: Свадьба Кирилла и Александры, 19.09.2026');
    });

    
    function animateOnScroll() {
        const items = document.querySelectorAll('.event-item');
        items.forEach(item => {
            if (item.offsetTop < window.scrollY + window.innerHeight - 50) {
                item.classList.add('show');
            }
        });
    }
    window.addEventListener('scroll', animateOnScroll);

    
    let map;
    ymaps.ready(init);
    function init(){
        map = new ymaps.Map("map", {
            center: [56.1365, 47.2395], 
            zoom: 13
        });
        
        
        const placemarkZAGS = new ymaps.Placemark([56.146289, 47.216639], {
            balloonContentHeader: 'ЗАГС',
            balloonContentBody: 'пр-кт. Московский д.38/5'
        });

        
        const placemarkBanquet = new ymaps.Placemark([56.141893, 47.253355], {
            balloonContentHeader: 'Банкетный зал "Мелодия"',
            balloonContentBody: 'Ярославская ул., 29'
        });

        map.geoObjects.add(placemarkZAGS);
        map.geoObjects.add(placemarkBanquet);
    }

    function calcRoute(type) {
        let destination;
        if (type === 'ЗАГС') {
            destination = 'Московский проспект, 38/5';
        } else {
            destination = 'Ярославская улица, 29';
        }
        window.location.href = `yandexnavi://build_route_on_map?lat_to=56.1365&lon_to=47.2395&name_to=${destination}`;
    }

    
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
        setTimeout(() => modal.classList.add('active'), 100);
        setTimeout(() => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 400);
        }, 3000);
    }

    
    rsvpForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const formData = new FormData(rsvpForm); 
      
      const dataToSend = {
          name: formData.get('name'),
          attendance: formData.get('attendance'),
          transfer: formData.get('transfer'),
          children: formData.get('children'),
          allergy: formData.get('allergy'),
          alcohol: formData.get('alcohol'),
          comment: formData.get('comment')
      };

      try {
        
        const proxyUrl = "https://api.allorigins.win/get?url="; 
        
        const encodedUrl = encodeURIComponent(
          
          'https://script.google.com/macros/s/AKfycbzmFp7MQ8hVn0h-o4l8XUtfOHFGKM0dC83brpmW3tP6qklqH9sjleCaLEclHkEbNT7X/exec'
        );

        const response = await fetch(proxyUrl + encodedUrl, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) throw new Error(`Ошибка при отправке данных: ${await response.text()}`);

        showThankYou(); 
      } catch (error) {
        alert('Произошла ошибка при отправке данных.');
        console.error(error.message);
      }
    });

});
