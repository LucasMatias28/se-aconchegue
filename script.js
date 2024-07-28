// Variáveis Globais
const products = [
    { id: '2', name: 'Rede Indiana', price: 70.00, image: 'redeindiana.jpg' },
    { id: '3', name: 'Rede Tijubana', price: 90.00, image: 'Rede Tijubana.jpg' },
    { id: '4', name: 'Rede Nylon', price: 70.00, image: 'Rede nyln.png' },
    { id: '1', name: 'Rede Bucho de Boi', price: 180.00, image: 'buchodeboi.png' },
    { id: '5', name: 'Manta UGA', price: 40.00, image: 'Manta UGA.jpg' },
    { id: '6', name: 'Rede Cinza', price: 40.00, image: 'Rede cinza.jpg' },
    { id: '7', name: 'Rede Sol a Sol', price: 120.00, image: 'Rede sol a sol.jpg' },
    { id: '8', name: 'Rede Cadeira', price: 110.00, image: 'redecadeira.jpg' },
    { id: '9', name: 'Tapete Médio', price: 100.00, image: 'tapetemedio.jpg' },
    { id: '10', name: 'Tapete Grande', price: 180.00, image: 'tapeteG.jpg' },
    { id: '11', name: 'Tapete Pequeno', price: 80.00, image: 'tepeteP.jpg' },
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
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== id);
        }
    }

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


// Função para alternar a exibição do seletor de parcelas
function toggleInstallments() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const installments = document.getElementById('installments');

    if (paymentMethod === 'cartão') {
        installments.style.display = 'inline-block';
    } else {
        installments.style.display = 'none';
        installments.value = '1';
        updateTotal();
    }
}

// Função para abrir o popup de pagamento
function openPaymentPopup() {
    document.getElementById('paymentPopup').style.display = 'block';
}

// Função para fechar o popup de pagamento
function closePaymentPopup() {
    document.getElementById('paymentPopup').style.display = 'none';
}

// Função para finalizar a venda
function finalizeSale() {
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const totalAfterDiscount = total - discount;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const installments = parseInt(document.getElementById('installments').value) || 1;
    const totalPerInstallment = totalAfterDiscount / installments;

    salesSummary.totalSales += totalAfterDiscount;

    cart.forEach(product => {
        if (!salesSummary.productsSold[product.id]) {
            salesSummary.productsSold[product.id] = {
                name: product.name,
                quantity: 0,
                totalSales: 0
            };
        }

        salesSummary.productsSold[product.id].quantity += product.quantity;
        salesSummary.productsSold[product.id].totalSales += product.price * product.quantity;
    });

    salesSummary.dailySales.push({
        timestamp: new Date().toLocaleString(),
        total: totalAfterDiscount,
        paymentMethod: paymentMethod,
        installments: installments,
        totalPerInstallment: totalPerInstallment,
        cart: [...cart]
    });

    cart = [];
    renderCart();
    updateTotal();
    alert('Venda finalizada com sucesso!');
    closePaymentPopup(); // Fechar o popup após finalizar a venda
}

// Função para alternar a exibição do seletor de parcelas
function toggleInstallments() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const installments = document.getElementById('installments');

    if (paymentMethod === 'cartão') {
        installments.style.display = 'inline-block';
    } else {
        installments.style.display = 'none';
        installments.value = '1';
        updateTotal();
    }
}

// Função para abrir o resumo das vendas
function openSalesSummary() {
    const salesSummaryDiv = document.getElementById('salesSummary');
    salesSummaryDiv.innerHTML = `
        <h2>Resumo das Vendas</h2>
        <p>Total de Vendas: R$ ${salesSummary.totalSales.toFixed(2)}</p>
        <h3>Produtos Vendidos:</h3>
        <ul>
            ${Object.values(salesSummary.productsSold).map(product => `
                <li>${product.name}: ${product.quantity} vendidos (Total: R$ ${product.totalSales.toFixed(2)})</li>
            `).join('')}
        </ul>
        <h3>Vendas Diárias:</h3>
        <ul>
            ${salesSummary.dailySales.map(sale => `
                <li>${sale.timestamp} - Total: R$ ${sale.total.toFixed(2)}, Parcelas: ${sale.installments}x de R$ ${sale.totalPerInstallment.toFixed(2)} (${sale.paymentMethod})</li>
            `).join('')}
        </ul>
    `;

    document.getElementById('salesSummaryPopup').style.display = 'block';
}

// Função para fechar o resumo das vendas
function closeSalesSummary() {
    document.getElementById('salesSummaryPopup').style.display = 'none';
}

// Função para cancelar a última venda
function cancelLastSale() {
    const lastSale = salesSummary.dailySales.pop();

    if (lastSale) {
        salesSummary.totalSales -= lastSale.total;

        lastSale.cart.forEach(product => {
            if (salesSummary.productsSold[product.id]) {
                salesSummary.productsSold[product.id].quantity -= product.quantity;
                salesSummary.productsSold[product.id].totalSales -= product.price * product.quantity;

                if (salesSummary.productsSold[product.id].quantity <= 0) {
                    delete salesSummary.productsSold[product.id];
                }
            }
        });

        openSalesSummary();
        alert('Última venda cancelada com sucesso!');
    } else {
        alert('Nenhuma venda para cancelar!');
    }
}

// Função para exportar o resumo das vendas para o Excel
function exportToExcel() {
    const ws_data = [
        ['Resumo das Vendas'],
        ['Total de Vendas', salesSummary.totalSales.toFixed(2)],
        ['Produtos Vendidos']
    ];

    Object.values(salesSummary.productsSold).forEach(product => {
        ws_data.push([product.name, product.quantity, product.totalSales.toFixed(2)]);
    });

    ws_data.push(['Vendas Diárias']);

    salesSummary.dailySales.forEach(sale => {
        ws_data.push([sale.timestamp, sale.total.toFixed(2), `${sale.installments}x de R$ ${sale.totalPerInstallment.toFixed(2)}`, sale.paymentMethod]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumo das Vendas');
    XLSX.writeFile(wb, 'resumo_das_vendas.xlsx');
}

// Carregar produtos ao iniciar
document.addEventListener('DOMContentLoaded', loadProducts);
