document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const video = document.getElementById('camera-stream');
    const displayImage = document.getElementById('display-image');
    const captureButton = document.getElementById('capture-button');
    const fileInput = document.getElementById('file-input');
    const photoCanvas = document.getElementById('photo-canvas');
    const galleryTrigger = document.getElementById('gallery-trigger'); // Кнопка/элемент, вызывающий клик по fileInput

    const overlayText = document.getElementById('overlay-text');
    const resultPanel = document.getElementById('result-panel');
    const resultText = document.getElementById('result-text');
    const resetButton = document.getElementById('reset-button');

    let currentStream = null;

    // --- НАСТРОЙКА ЦВЕТОВ И ТЕКСТА ---
    const ResultStates = {
        GOOD: { text: "ЯБЛОКО ХОРОШЕЕ", class: "grade-good", activeTextColor: "#5E7D27" },
        BAD: { text: "ЯБЛОКО ПЛОХОЕ", class: "grade-bad", activeTextColor: "#9F2222" },
        NEUTRAL: { text: "НЕ ЯБЛОКО", class: "grade-neutral", activeTextColor: "#EF9241" }
    };

    // --- ФУНКЦИЯ 1: ЗАПУСК КАМЕРЫ ---
    function startCamera() {
        // Скрываем панель результатов
        resultPanel.classList.remove('show');
        resultPanel.classList.add('hidden');

        // Переключаем интерфейс на камеру
        displayImage.style.display = 'none';
        video.style.display = 'block';

        // Показываем оверлей
        overlayText.style.display = 'flex';

        // Останавливаем предыдущий поток, если он был
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }

        // Запускаем новый поток камеры
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment' // Предпочтительно задняя камера
            }
        })
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Ошибка доступа к камере:", err);
            alert("Не удалось получить доступ к камере. Убедитесь, что вы используете HTTPS и разрешили доступ.");
        });
    }

    // --- ФУНКЦИЯ 2: ПОКАЗАТЬ РЕЗУЛЬТАТЫ И АНИМАЦИЯ ---
    function showResults(state) {
        // Устанавливаем текст и класс градиента
        resultText.textContent = state.text;

        // Удаляем все классы градиентов и добавляем нужный
        resultPanel.classList.remove('grade-good', 'grade-bad', 'grade-neutral');
        resultPanel.classList.add(state.class);

        // Устанавливаем обводку и текст кнопки в белый (стандартное поведение)
        resetButton.style.color = 'white';
        resetButton.style.borderColor = 'white';

        // Обработка цвета текста кнопки при нажатии
        resetButton.onmousedown = resetButton.ontouchstart = () => {
            resetButton.style.color = state.activeTextColor;
        };
        resetButton.onmouseup = resetButton.ontouchend = () => {
            resetButton.style.color = 'white';
        };

        // Показываем панель с анимацией
        resultPanel.classList.remove('hidden');
        setTimeout(() => {
            resultPanel.classList.add('show');
        }, 10);
    }

    // --- ФУНКЦИЯ 3: ЗАХВАТ ИЗОБРАЖЕНИЯ С КАМЕРЫ ---
    function capturePhoto() {
        // Установка размеров холста по размерам видеоэлемента
        photoCanvas.width = video.videoWidth;
        photoCanvas.height = video.videoHeight;
        
        // Отрисовка текущего кадра видео на холсте
        const context = photoCanvas.getContext('2d');
        context.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
        
        // Получение данных изображения
        displayImage.src = photoCanvas.toDataURL('image/jpeg');
        
        // ПЕРЕКЛЮЧЕНИЕ: Камера -> Изображение
        displayImage.style.display = 'block';
        video.style.display = 'none';
        overlayText.style.display = 'none'; // Скрываем overlay-text

        // ОСТАНОВКА ПОТОКА КАМЕРЫ
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }
    }

    // --- ФУНКЦИЯ 4: ЗАГРУЗКА ИЗОБРАЖЕНИЯ ИЗ ГАЛЕРЕИ ---
    function loadFromGallery(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            displayImage.src = e.target.result;
            
            // ПЕРЕКЛЮЧЕНИЕ: Камера -> Изображение
            displayImage.style.display = 'block';
            video.style.display = 'none';
            overlayText.style.display = 'none'; // Скрываем overlay-text

            // ОСТАНОВКА ПОТОКА КАМЕРЫ
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
                currentStream = null;
            }
            
            // 🛑 ЭМУЛЯЦИЯ РЕЗУЛЬТАТА после выбора фото из галереи
            const results = [ResultStates.GOOD, ResultStates.BAD, ResultStates.NEUTRAL];
            const randomResult = results[Math.floor(Math.random() * results.length)];
            showResults(randomResult);
        };
        reader.readAsDataURL(file);
    }

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

    // Кнопка "Снять фото"
    captureButton.addEventListener('click', () => {
        capturePhoto();
        
        // 🛑 ЭМУЛЯЦИЯ РЕЗУЛЬТАТА: 
        const results = [ResultStates.GOOD, ResultStates.BAD, ResultStates.NEUTRAL];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        showResults(randomResult);
    });

    // Выбор файла через <input type="file">
    fileInput.addEventListener('change', (event) => {
        loadFromGallery(event.target.files[0]);
    });
    
    // Кнопка-триггер для открытия галереи
    if (galleryTrigger) {
        galleryTrigger.addEventListener('click', () => {
            fileInput.click(); // Инициирует нажатие на скрытый fileInput
        });
    }

    // Кнопка "Сброс" (назад к камере)
    resetButton.addEventListener('click', startCamera);

    // --- ЗАПУСК ПРИЛОЖЕНИЯ ---
    startCamera();
});
