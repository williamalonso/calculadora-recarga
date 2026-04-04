// --- Constantes ---
const TOTAL_BATTERY_KWH = 44.9;

// --- Seletores do DOM ---
const priceInput = document.getElementById('price');
const percentageSlider = document.getElementById('percentageSlider');
const percentageInput = document.getElementById('percentageInput');
const activationFeeInput = document.getElementById('activationFee');
const totalCostFullEl = document.getElementById('totalCostFull');
const totalCostPartialEl = document.getElementById('totalCostPartial');
const partialChargeLabelEl = document.getElementById('partialChargeLabel');
const resultsEl = document.getElementById('results');

/**
 * Formata um número como moeda BRL (Ex: R$ 51,72)
 * @param {number} value - O valor numérico
 * @returns {string} - O valor formatado
 */
function formatCurrency(value) {
    // Garante que o valor é um número e fixa 2 casas decimais
    const fixedValue = Number(value).toFixed(2);
    // Troca o ponto decimal por vírgula
    return `R$ ${fixedValue.replace('.', ',')}`;
}

/**
 * Função principal que calcula e exibe os custos
 */
function calculateCost() {
    // --- 1. Obter Valores ---
    let pricePerKwh = parseFloat(priceInput.value) || 0;
    let activationFee = parseFloat(activationFeeInput.value) || 0; // Nova linha
    
    let currentPercentage = parseInt(percentageInput.value, 10);
    if (isNaN(currentPercentage)) {
        currentPercentage = 0;
    }

    // --- 2. Validar Valores --- (mantém igual)
    if (currentPercentage < 0) currentPercentage = 0;
    if (currentPercentage > 100) currentPercentage = 100;

    // --- 3. Fazer Cálculos ---
    
    // Cálculo 1: Custo para carga completa + Taxa
    const costFull = (pricePerKwh * TOTAL_BATTERY_KWH) + activationFee;
    
    // Cálculo 2: Custo para carga parcial + Taxa
    const percentageToCharge = 100 - currentPercentage;
    const kwhNeeded = (percentageToCharge / 100) * TOTAL_BATTERY_KWH;
    const costPartial = (pricePerKwh * kwhNeeded) + activationFee;

    // --- 4. Exibir Resultados --- (mantém igual)
    totalCostFullEl.textContent = formatCurrency(costFull);
    totalCostPartialEl.textContent = formatCurrency(costPartial);
    partialChargeLabelEl.textContent = `De ${currentPercentage}% até 100%`;
}

// --- 5. Sincronizar Inputs ---

// Quando o slider mudar, atualiza o input numérico
percentageSlider.addEventListener('input', () => {
    percentageInput.value = percentageSlider.value;
    calculateCost(); // Recalcula
});

// Quando o input numérico mudar, atualiza o slider
percentageInput.addEventListener('input', (e) => {
    let val = parseInt(e.target.value, 10);
    
    // Lida com input vazio temporariamente
    if (isNaN(val)) {
        // Não faz nada, espera o usuário terminar de digitar
    } else {
        // Limita o valor entre 0 e 100
        if (val < 0) {
            val = 0; 
            e.target.value = 0; // Corrige o input
        }
        if (val > 100) {
            val = 100;
            e.target.value = 100; // Corrige o input
        }
        percentageSlider.value = val; // Sincroniza o slider
    }
    calculateCost(); // Recalcula
});

// Recalcula quando o preço mudar
priceInput.addEventListener('input', calculateCost);

// --- 6. Cálculo Inicial ---
// Calcula os custos assim que a página carregar com os valores padrão
window.addEventListener('load', calculateCost);

// Recalcula quando a taxa de ativação mudar
activationFeeInput.addEventListener('input', calculateCost);