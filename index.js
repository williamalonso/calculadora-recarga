// --- Constantes ---
const TOTAL_BATTERY_KWH = 44.9;

// --- Seletores do DOM ---
const priceInput = document.getElementById('price');
const activationFeeInput = document.getElementById('activationFee');

// Bateria
const percentageSlider = document.getElementById('percentageSlider');
const percentageInput = document.getElementById('percentageInput');

// Desconto (Novos seletores)
const discountSlider = document.getElementById('discountSlider');
const discountInput = document.getElementById('discountInput');

// Resultados
const totalCostFullEl = document.getElementById('totalCostFull');
const totalCostPartialEl = document.getElementById('totalCostPartial');
const partialChargeLabelEl = document.getElementById('partialChargeLabel');

/**
 * Formata um número como moeda BRL
 */
function formatCurrency(value) {
    const fixedValue = Number(value).toFixed(2);
    return `R$ ${fixedValue.replace('.', ',')}`;
}

/**
 * Função principal que calcula e exibe os custos
 */
function calculateCost() {
    // --- 1. Obter Valores ---
    let pricePerKwh = parseFloat(priceInput.value) || 0;
    let activationFee = parseFloat(activationFeeInput.value) || 0;
    
    let currentPercentage = parseInt(percentageInput.value, 10) || 0;
    let discountPercent = (parseInt(discountInput.value, 10) || 0) / 100;

    // --- 2. Cálculos ---
    
    // Carga completa (0 a 100%)
    const rawCostFull = (pricePerKwh * TOTAL_BATTERY_KWH) + activationFee;
    const finalCostFull = rawCostFull * (1 - discountPercent);
    
    // Carga parcial (Atual a 100%)
    const percentageToCharge = 100 - currentPercentage;
    const kwhNeeded = (percentageToCharge / 100) * TOTAL_BATTERY_KWH;
    const rawCostPartial = (pricePerKwh * kwhNeeded) + activationFee;
    const finalCostPartial = rawCostPartial * (1 - discountPercent);

    // --- 3. Exibir Resultados ---
    totalCostFullEl.textContent = formatCurrency(finalCostFull);
    totalCostPartialEl.textContent = formatCurrency(finalCostPartial);
    partialChargeLabelEl.textContent = `De ${currentPercentage}% até 100%`;
}

// --- 4. Event Listeners (Sincronização) ---

// Sincronizar Bateria
percentageSlider.addEventListener('input', () => {
    percentageInput.value = percentageSlider.value;
    calculateCost();
});
percentageInput.addEventListener('input', (e) => {
    let val = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100);
    percentageSlider.value = val;
    calculateCost();
});

// Sincronizar Desconto (Novo!)
discountSlider.addEventListener('input', () => {
    discountInput.value = discountSlider.value;
    calculateCost();
});
discountInput.addEventListener('input', (e) => {
    let val = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100);
    discountSlider.value = val;
    calculateCost();
});

// Outros inputs
priceInput.addEventListener('input', calculateCost);
activationFeeInput.addEventListener('input', calculateCost);

// Cálculo Inicial
window.addEventListener('load', calculateCost);