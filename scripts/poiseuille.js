document.getElementById('poiseuilleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const deltaP = parseFloat(document.getElementById('deltaP').value);
    const radius = parseFloat(document.getElementById('radius').value);
    const viscosity = parseFloat(document.getElementById('viscosity').value);
    const length = parseFloat(document.getElementById('length').value);

    if (isNaN(deltaP) || isNaN(radius) || isNaN(viscosity) || isNaN(length)) {
        alert('Please enter valid numbers');
        return;
    }

    const pi = Math.PI;
    const flowRate = (deltaP * pi * Math.pow(radius, 4)) / (8 * viscosity * length);

    document.getElementById('result').textContent = `Flow Rate (Q): ${flowRate.toFixed(6)} m³/s`;
});
