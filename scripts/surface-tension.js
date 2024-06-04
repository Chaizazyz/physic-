document.getElementById('surfaceTensionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const force = parseFloat(document.getElementById('force').value);
    const length = parseFloat(document.getElementById('lengthST').value);

    if (isNaN(force) || isNaN(length)) {
        alert('Please enter valid numbers');
        return;
    }

    const surfaceTension = force / length;

    document.getElementById('result').textContent = `Surface Tension (γ): ${surfaceTension.toFixed(6)} N/m`;
});
