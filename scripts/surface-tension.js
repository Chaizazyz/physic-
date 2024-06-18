function calculateSurfaceTension() {
    const delta_rho = parseFloat(document.getElementById('delta_rho').value);
    const g = parseFloat(document.getElementById('g').value);
    const d_e2 = parseFloat(document.getElementById('d_e2').value);
    const d_s = parseFloat(document.getElementById('d_s').value);
    const d_e = parseFloat(document.getElementById('d_e').value);
    const alpha = 0.345;
    const beta = -2.54;

    if (isNaN(delta_rho) || isNaN(g) || isNaN(d_e2) || isNaN(d_s) || isNaN(d_e)) {
        alert("Please fill in all fields with valid numbers.");
        return;
    }

    const ratio = Math.pow(d_s / d_e, beta);
    const gamma = delta_rho * g * d_e2 * alpha * ratio;

    document.getElementById('result').textContent = `γ (Surface Tension) = ${gamma.toFixed(2)} N/m`;
}
