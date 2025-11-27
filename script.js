document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera-stream');
    const displayImage = document.getElementById('display-image');
    const captureButton = document.getElementById('capture-button');
    const fileInput = document.getElementById('file-input');
    const photoCanvas = document.getElementById('photo-canvas');
    const galleryTrigger = document.getElementById('gallery-trigger'); 
    
    const resultPanel = document.getElementById('result-panel');
    const resultText = document.getElementById('result-text');
    const resetButton = document.getElementById('reset-button');

    let currentStream = null;

    // --- НАСТРОЙКА ЦВЕТОВ И ТЕКСТА (УПРОЩЕНО) ---
    // Убраны buttonTextColor и activeTextColor, т.к. теперь обводка/текст всегда белые.
    // Оставлен только activeTextColor для стилизации текста при нажатии.
    const ResultStates = {
        GOOD: { text: "ЯБЛОКО ХОРОШЕЕ", class: "grade-good", activeTextColor: "#5E7D27" },
        BAD: { text: "ЯБЛОКО ПЛОХОЕ", class: "grade-bad", activeTextColor: "#9F2222" },
        NEUTRAL: { text: "НЕ ЯБЛОКО", class: "grade-neutral", activeTextColor: "#EF9241" } // Цвет текста кнопки при нажатии - оранжевый
    };
    
    // --- ФУНКЦИЯ 1: ЗАПУСК КАМЕРЫ ---
    function startCamera() {
        // ... (остается без изменений)
        resultPanel.classList.remove('show');
        resultPanel.classList.add('hidden');

        displayImage.style.display = 'none';
        video.style.display = 'block';

        document.getElementById('overlay-text').style.display = 'flex'; 

        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment' 
            } 
        })
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Ошибка доступа к камере:", err);
            alert("Не удалось получить доступ к камере. Убедитесь, что вы используете HTTPS.");
        });
    }

    // --- ФУНКЦИЯ 2: ПОКАЗАТЬ РЕЗУЛЬТАТЫ И АНИМАЦИЯ (УПРОЩЕНО) ---
    function showResults(state) {
        // Устанавливаем текст и класс градиента
        resultText.textContent = state.text;
        
        // Удаляем все классы градиентов и добавляем нужный
        resultPanel.classList.remove('grade-good', 'grade-bad', 'grade-neutral');
        resultPanel.classList.add(state.class);
        
        // 🛑 Устанавливаем обводку и текст кнопки в белый (стандартное поведение)
        resetButton.style.color = 'white';
        resetButton.style.borderColor = 'white'; 

        // 🛑 Обработка цвета текста кнопки при нажатии (для всех состояний)
        resetButton.onmousedown = resetButton.ontouchstart = () => {
             // Цвет текста кнопки при нажатии берется из activeTextColor
             resetButton.style.color = state.activeTextColor;
        };
        resetButton.onmouseup = resetButton.ontouchend = () => {
             // При отпускании возвращается к белому
             resetButton.style.color = 'white';
        };
        
        // Показываем панель с анимацией
        resultPanel.classList.remove('hidden');
        setTimeout(() => {
            resultPanel.classList.add('show');
        }, 10);
    }
    
    // --- (Остальные функции 3, 4 и 5 остаются без изменений) ---
    
    // ... (Функция captureButton.addEventListener('click') )
    // ... (Функция galleryTrigger.addEventListener('click') )
    // ... (Функция resetButton.addEventListener('click') )

    captureButton.addEventListener('click', () => {
        // ... (логика захвата фото)
        
        // 🛑 ЭМУЛЯЦИЯ РЕЗУЛЬТАТА: 
        const results = [ResultStates.GOOD, ResultStates.BAD, ResultStates.NEUTRAL];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        showResults(randomResult);
    });

    fileInput.addEventListener('change', (event) => {
        // ... (логика выбора файла из галереи)
        
        // 🛑 ЭМУЛЯЦИЯ РЕЗУЛЬТАТА после выбора фото из галереи
        const results = [ResultStates.GOOD, ResultStates.BAD, ResultStates.NEUTRAL];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        showResults(randomResult);
    });

    resetButton.addEventListener('click', startCamera);

    startCamera();
});
