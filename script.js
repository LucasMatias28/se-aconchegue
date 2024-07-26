// script.js

// Variáveis Globais
const products = [
    { id: '1', name: 'Rede de Dormir Colorida', price: 120.00, image: 'rede1.jpg' },
    { id: '2', name: 'Rede de Dormir Listrada', price: 150.00, image: 'rede2.jpg' },
    { id: '3', name: 'Rede de Dormir Simples', price: 100.00, image: 'rede3.jpg' }
];
let cart = [];
const salesSummary = {
    totalSales: 0,
    productsSold: {},
    dailySales: []
};

// Função para carregar os produtos
function loadProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = products.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <p>Preço: R$ ${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.id}')">Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
}

// Função para adicionar produtos ao carrinho
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    updateTotal();
}

// Função para renderizar o carrinho
function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Quantidade: ${item.quantity}</p>
                <p>Preço: R$ ${item.price.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart('${item.id}')">Remover</button>
        </div>
    `).join('');
}

// Função para remover produtos do carrinho
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    updateTotal();
}

// Função para atualizar o total do carrinho
function updateTotal() {
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const totalAfterDiscount = total - discount;
    document.getElementById('totalAmount').textContent = `Total: R$ ${totalAfterDiscount.toFixed(2)}`;
}

// Função para finalizar a venda
function finalizeSale() {
    const total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    salesSummary.totalSales += total;

    cart.forEach(product => {
        if (!salesSummary.productsSold[product.id]) {
            salesSummary.productsSold[product.id] = {
                name: product.name,
                quantity: 0,
                total: 0
            };
        }
        salesSummary.productsSold[product.id].quantity += product.quantity;
        salesSummary.productsSold[product.id].total += product.price * product.quantity;
    });

    salesSummary.dailySales.push({
        date: new Date().toISOString().split('T')[0],
        total: total
    });

    cart = [];
    renderCart();
    updateTotal();
    renderDailySalesSummary();
}

// Função para abrir o resumo de vendas
function openSalesSummary() {
    renderDailySalesSummary();
    document.getElementById('salesSummaryPopup').style.display = 'flex';
}

// Função para fechar o resumo de vendas
function closeSalesSummary() {
    document.getElementById('salesSummaryPopup').style.display = 'none';
}

// Função para renderizar o resumo de vendas diárias
function renderDailySalesSummary() {
    const salesSummaryDiv = document.getElementById('salesSummary');
    salesSummaryDiv.innerHTML = `
        <h3>Resumo de Vendas Diárias</h3>
        <p>Total Arrecadado: R$ ${salesSummary.totalSales.toFixed(2)}</p>
        <h4>Produtos Vendidos</h4>
        <ul>
            ${Object.values(salesSummary.productsSold).map(product => `
                <li>${product.name}: ${product.quantity} unidades, Total: R$ ${product.total.toFixed(2)}</li>
            `).join('')}
        </ul>
        <h4>Vendas do Dia</h4>
        <ul>
            ${salesSummary.dailySales.map(sale => `
                <li>${sale.date}: R$ ${sale.total.toFixed(2)}</li>
            `).join('')}
        </ul>
    `;
}

// Função para exportar para Excel
function exportToExcel() {
    console.log("Exportando para Excel...");
    try {
        const wsData = [
            ['Data', 'Total']
        ];
        
        salesSummary.dailySales.forEach(sale => {
            wsData.push([sale.date, sale.total.toFixed(2)]);
        });

        wsData.push([]);
        wsData.push(['Produto', 'Quantidade Vendida', 'Total Arrecadado']);
        
        Object.values(salesSummary.productsSold).forEach(product => {
            wsData.push([product.name, product.quantity, product.total.toFixed(2)]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Resumo de Vendas Diárias');

        XLSX.writeFile(wb, 'relatorio_vendas_diarias.xlsx');
        console.log("Arquivo exportado com sucesso!");
    } catch (error) {
        console.error("Erro ao exportar para Excel:", error);
    }
}

// Carregar produtos quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', loadProducts);
