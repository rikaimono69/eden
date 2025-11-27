document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera-stream');
    const displayImage = document.getElementById('display-image');
    const captureButton = document.getElementById('capture-button');
    const fileInput = document.getElementById('file-input');
    const photoCanvas = document.getElementById('photo-canvas');
    // Левая иконка для галереи
    const galleryButton = document.querySelector('.bottom-icon:first-child'); 

    let currentStream = null;

    // --- ФУНКЦИЯ 1: ЗАПУСК КАМЕРЫ ---
    function startCamera() {
        displayImage.style.display = 'none';
        video.style.display = 'block';

        // Показываем оверлей
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

    // --- ФУНКЦИЯ 2: СДЕЛАТЬ СНИМОК ---
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

        // Скрываем оверлей после съемки
        document.getElementById('overlay-text').style.display = 'none';

        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null; 
    });

    // --- ФУНКЦИЯ 3: ВЫБОР ИЗОБРАЖЕНИЯ ИЗ ГАЛЕРЕИ ---
    // Активация fileInput привязана к левой иконке
    galleryButton.addEventListener('click', () => {
        fileInput.click(); 
    });

    fileInput.addEventListener('change', (event) => {
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
                // Скрываем оверлей при выборе изображения из галереи
                document.getElementById('overlay-text').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    startCamera();
});
