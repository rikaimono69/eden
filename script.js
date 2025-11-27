document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera-stream');
    const displayImage = document.getElementById('display-image');
    const captureButton = document.getElementById('capture-button');
    const fileInput = document.getElementById('file-input');
    const photoCanvas = document.getElementById('photo-canvas');
    const galleryTrigger = document.getElementById('gallery-trigger'); 
    
    // Новые элементы
    const resultPanel = document.getElementById('result-panel');
    const resultText = document.getElementById('result-text');
    const resetButton = document.getElementById('reset-button');

    let currentStream = null;

    // --- НАСТРОЙКА ЦВЕТОВ И ТЕКСТА ---
    const ResultStates = {
        GOOD: { text: "ЯБЛОКО ХОРОШЕЕ", class: "grade-good", buttonTextColor: "white", activeTextColor: "#5E7D27" },
        BAD: { text: "ЯБЛОКО ПЛОХОЕ", class: "grade-bad", buttonTextColor: "white", activeTextColor: "#9F2222" },
        NEUTRAL: { text: "НЕ ЯБЛОКО", class: "grade-neutral", buttonTextColor: "#333", activeTextColor: "#EF9241" }
    };
    
    // --- ФУНКЦИЯ 1: ЗАПУСК КАМЕРЫ ---
    function startCamera() {
        // Скрываем результат и фото
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

    // --- ФУНКЦИЯ 2: ПОКАЗАТЬ РЕЗУЛЬТАТЫ И АНИМАЦИЯ ---
    function showResults(state) {
        // Устанавливаем текст и класс градиента
        resultText.textContent = state.text;
        
        // Удаляем все классы градиентов и добавляем нужный
        resultPanel.classList.remove('grade-good', 'grade-bad', 'grade-neutral');
        resultPanel.classList.add(state.class);
        
        // Устанавливаем цвет текста кнопки и обводки
        resetButton.style.color = state.buttonTextColor;
        resetButton.style.borderColor = state.buttonTextColor;

        // Обработка цвета текста кнопки при нажатии (для оранжевого фона)
        resetButton.onmousedown = resetButton.ontouchstart = () => {
             resetButton.style.color = state.activeTextColor;
        };
        resetButton.onmouseup = resetButton.ontouchend = () => {
             resetButton.style.color = state.buttonTextColor;
        };
        
        // Показываем панель с анимацией
        resultPanel.classList.remove('hidden');
        // Небольшая задержка, чтобы браузер успел применить display: flex перед transform
        setTimeout(() => {
            resultPanel.classList.add('show');
        }, 10);
    }
    
    // --- ФУНКЦИЯ 3: СДЕЛАТЬ СНИМОК ---
    captureButton.addEventListener('click', () => {
        if (!currentStream) {
            alert("Камера не активна.");
            return;
        }

        photoCanvas.width = video.videoWidth;
        photoCanvas.height = video.videoHeight;
        
        const context = photoCanvas.getContext('2d');
        context.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
        
        const photoDataUrl = photoCanvas.toDataURL('image/jpeg', 0.9);
        
        displayImage.src = photoDataUrl;
        displayImage.style.display = 'block';
        video.style.display = 'none';

        document.getElementById('overlay-text').style.display = 'none';

        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null; 
        
        // 🛑 ЭМУЛЯЦИЯ РЕЗУЛЬТАТА: В будущем здесь будет логика обработки изображения
        // Для демонстрации, выбираем случайный результат:
        const results = [ResultStates.GOOD, ResultStates.BAD, ResultStates.NEUTRAL];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        showResults(randomResult);
    });

    // --- ФУНКЦИЯ 4: ВЫБОР ИЗОБРАЖЕНИЯ ИЗ ГАЛЕРЕИ ---
    galleryTrigger.addEventListener('click', () => {
        fileInput.click(); 
    });

    fileInput.addEventListener('change', (event) => {
        // ... (логика выбора файла из галереи остается прежней)
        const file = event.target.files[0];
        if (file) {
            if (currentStream) {
                 currentStream.getTracks().forEach(track => track.stop());
                 currentStream = null; 
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                displayImage.src = e.target.result;
                displayImage.style.display = 'block';
                video.style.display = 'none';
                document.getElementById('overlay-text').style.display = 'none';
                
                // 🛑 ЭМУЛЯЦИЯ РЕЗУЛЬТАТА после выбора фото из галереи
                const results = [ResultStates.GOOD, ResultStates.BAD, ResultStates.NEUTRAL];
                const randomResult = results[Math.floor(Math.random() * results.length)];
                showResults(randomResult);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // --- ФУНКЦИЯ 5: СБРОС К КАМЕРЕ ---
    resetButton.addEventListener('click', startCamera);

    startCamera();
});
