document.getElementById('surfaceTensionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const tubeDiameter = parseFloat(document.getElementById('tubeDiameter').value);
    const waterDensity = parseFloat(document.getElementById('waterDensity').value);
    const gravity = parseFloat(document.getElementById('gravity').value);
    const waterDropImage = document.getElementById('waterDropImage').files[0];

    if (isNaN(tubeDiameter) || isNaN(waterDensity) || isNaN(gravity) || !waterDropImage) {
        alert('Please enter valid numbers and upload an image');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            let isDrawing = false;
            let startX, startY, radius;

            canvas.addEventListener('mousedown', function(e) {
                const rect = canvas.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
                isDrawing = true;
            });

            canvas.addEventListener('mousemove', function(e) {
                if (isDrawing) {
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    radius = Math.sqrt(Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2));
                    
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    ctx.beginPath();
                    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });

            canvas.addEventListener('mouseup', function() {
                if (isDrawing) {
                    isDrawing = false;

                    // Convert radius from pixels to meters
                    const pixelToMeter = (tubeDiameter / 1000) / radius;
                    const radiusInMeters = radius * pixelToMeter;

                    // Calculate the surface tension (γ)
                    const surfaceTension = (waterDensity * gravity * radiusInMeters) / 2;

                    document.getElementById('result').textContent = `Surface Tension (γ): ${surfaceTension.toFixed(6)} N/m`;
                }
            });
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(waterDropImage);
});
