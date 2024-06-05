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
            // Calculate the radius of the water drop
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Perform image processing to find the water drop radius
            // This is a placeholder implementation and needs actual image processing
            const radiusInPixels = findWaterDropRadius(ctx, canvas.width, canvas.height);
            
            if (radiusInPixels === null) {
                alert('Unable to detect water drop in the image');
                return;
            }

            // Convert radius from pixels to meters
            const pixelToMeter = (tubeDiameter / 1000) / radiusInPixels;
            const radiusInMeters = radiusInPixels * pixelToMeter;

            // Calculate the surface tension (γ)
            // γ = (ρ * g * r^2) / (2 * h)
            // where r is the radius of the drop and h is the height of the drop
            // Assuming h = r for simplicity
            const surfaceTension = (waterDensity * gravity * Math.pow(radiusInMeters, 2)) / (2 * radiusInMeters);

            document.getElementById('result').textContent = `Surface Tension (γ): ${surfaceTension.toFixed(6)} N/m`;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(waterDropImage);
});

function findWaterDropRadius(ctx, width, height) {
    // Placeholder function to detect the radius of the water drop in the image
    // Needs actual implementation using image processing techniques
    // Returning a fixed value for now
    return 50; // Example radius in pixels
}
