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
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Load the image into OpenCV
            let src = cv.imread(canvas);
            let gray = new cv.Mat();
            let circles = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
            cv.GaussianBlur(gray, gray, new cv.Size(9, 9), 2, 2);
            cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT, 1, gray.rows / 8, 100, 30, 1, 30);

            // Assuming the first detected circle is the water drop
            if (circles.rows > 0) {
                let x = circles.data32F[0];
                let y = circles.data32F[1];
                let radiusInPixels = circles.data32F[2];

                // Convert radius from pixels to meters
                const pixelToMeter = (tubeDiameter / 1000) / radiusInPixels;
                const radiusInMeters = radiusInPixels * pixelToMeter;

                // Calculate the surface tension (γ)
                const surfaceTension = (waterDensity * gravity * radiusInMeters) / 2;

                document.getElementById('result').textContent = `Surface Tension (γ): ${surfaceTension.toFixed(6)} N/m`;
            } else {
                alert('Unable to detect water drop in the image');
            }

            // Clean up
            src.delete();
            gray.delete();
            circles.delete();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(waterDropImage);
});
