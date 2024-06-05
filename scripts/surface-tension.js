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

            // Load the image into OpenCV
            let src = cv.imread(canvas);
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
            cv.GaussianBlur(gray, gray, new cv.Size(9, 9), 2, 2);
            let circles = new cv.Mat();
            cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT, 1, gray.rows / 8, 100, 30, 1, 30);

            // Draw detected circles
            for (let i = 0; i < circles.cols; ++i) {
                let x = circles.data32F[i * 3];
                let y = circles.data32F[i * 3 + 1];
                let radius = circles.data32F[i * 3 + 2];
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Allow user to click to select the circle
            canvas.style.display = 'block';
            canvas.addEventListener('click', function(e) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                for (let i = 0; i < circles.cols; ++i) {
                    let x = circles.data32F[i * 3];
                    let y = circles.data32F[i * 3 + 1];
                    let radius = circles.data32F[i * 3 + 2];

                    // Check if click is inside the circle
                    if (Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) <= Math.pow(radius, 2)) {
                        // Convert radius from pixels to meters
                        const pixelToMeter = (tubeDiameter / 1000) / radius;
                        const radiusInMeters = radius * pixelToMeter;

                        // Calculate the surface tension (γ)
                        const surfaceTension = (waterDensity * gravity * radiusInMeters) / 2;

                        document.getElementById('result').textContent = `Surface Tension (γ): ${surfaceTension.toFixed(6)} N/m`;
                        break;
                    }
                }

                // Clean up
                src.delete();
                gray.delete();
                circles.delete();
            }, { once: true });
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(waterDropImage);
});
