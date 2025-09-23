
//script de filtro de productos

document.addEventListener('DOMContentLoaded', () => {
        const searchForm = document.querySelector('form[role="search"]');
        const searchInput = document.querySelector('input[type="search"]');
        const allProducts = document.querySelectorAll('.col');
        const categoryHeadings = document.querySelectorAll('main h4');

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterProducts();
        });

        searchInput.addEventListener('input', () => {
            filterProducts();
        });

        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const visibleCategories = new Set();

            allProducts.forEach(product => {
                const productName = product.querySelector('.card-title').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    product.style.display = 'block';
                    // Obtiene el título de la categoría padre y lo añade al conjunto
                    const categoryDiv = product.closest('.row').previousElementSibling;
                    if (categoryDiv && categoryDiv.tagName === 'H4') {
                        visibleCategories.add(categoryDiv.textContent.trim());
                    }
                } else {
                    product.style.display = 'none';
                }
            });

            // Oculta/muestra los títulos de las categorías
            categoryHeadings.forEach(heading => {
                if (visibleCategories.has(heading.textContent.trim())) {
                    heading.style.display = 'block';
                } else {
                    heading.style.display = 'none';
                }
            });
        }
    });





(function () {
  function init() {
    console.log('Carrito: init');
    document.body.addEventListener('click', function (e) {
      var addBtn = e.target.closest('.btn-panaderia');
      if (addBtn) { e.preventDefault(); handleAgregar(addBtn); return; }

      var plus = e.target.closest('.sumar-cantidad');
      if (plus) { e.preventDefault(); handleSumar(plus); return; }

      var minus = e.target.closest('.restar-cantidad');
      if (minus) { e.preventDefault(); handleRestar(minus); return; }

      var del = e.target.closest('.btn-eliminar');
      if (del) { e.preventDefault(); handleEliminar(del); return; }

      var pagar = e.target.closest('.btn-pagar');
      if (pagar) { e.preventDefault(); pagarClicked(); return; }
    });

    actualizarTotalCarrito();
  }

  function handleAgregar(button) {
    var card = button.closest('.card');
    if (!card) return;
    var titulo = (card.querySelector('.card-title') || {}).innerText.trim();
    var precio = (card.querySelector('.card-text') || {}).innerText.trim();
    var imagen = (card.querySelector('.card-img-top') || {}).src || '';
    agregarItemCarrito(titulo, precio, imagen);
  }

  function handleSumar(button) {
    var input = button.parentElement.querySelector('.carrito-item-cantidad');
    if (input) {
      input.value = parseInt(input.value, 10) + 1;
      actualizarTotalCarrito();
    }
  }

  function handleRestar(button) {
    var input = button.parentElement.querySelector('.carrito-item-cantidad');
    if (input) {
      var v = parseInt(input.value, 10) - 1;
      if (v >= 1) input.value = v;
      actualizarTotalCarrito();
    }
  }

  function handleEliminar(button) {
    var item = button.closest('.carrito-item');
    if (item) {
      item.remove();
      actualizarTotalCarrito();
      mostrarMensajeVacioSiNecesario();
    }
  }

  function agregarItemCarrito(titulo, precioStr, imagenSrc) {
    var itemsCarrito = document.querySelector('.carrito-items');
    var vacioMsg = itemsCarrito.querySelector('.carrito-vacio');
    if (vacioMsg) vacioMsg.remove(); // quita mensaje vacío si existe

    // Evitar duplicados
    var nombres = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombres.length; i++) {
      if (nombres[i].innerText.trim() === titulo) {
        var cantidadInput = nombres[i].parentElement.querySelector('.carrito-item-cantidad');
        cantidadInput.value = parseInt(cantidadInput.value, 10) + 1;
        actualizarTotalCarrito();
        return;
      }
    }

    var html = `
      <div class="carrito-item d-flex align-items-center mb-2">
        <img src="${imagenSrc}" alt="" width="60" class="me-2">
        <div class="carrito-item-detalles flex-grow-1">
          <span class="carrito-item-titulo d-block">${escapeHtml(titulo)}</span>
          <div class="selector-cantidad d-flex align-items-center">
            <i class="fa-solid fa-minus restar-cantidad me-2"></i>
            <input type="text" value="1" class="carrito-item-cantidad text-center" style="width:40px;" disabled>
            <i class="fa-solid fa-plus sumar-cantidad ms-2"></i>
          </div>
          <span class="carrito-item-precio">${escapeHtml(precioStr)}</span>
        </div>
        <span class="btn-eliminar ms-2"><i class="fa-solid fa-trash"></i></span>
      </div>`;
    itemsCarrito.insertAdjacentHTML('beforeend', html);
    actualizarTotalCarrito();
  }

  function actualizarTotalCarrito() {
    var items = document.querySelectorAll('.carrito-items .carrito-item');
    var total = 0;
    items.forEach(function (item) {
      var precioEl = item.querySelector('.carrito-item-precio');
      var cantidadEl = item.querySelector('.carrito-item-cantidad');
      if (precioEl && cantidadEl) {
        var precioNum = parsePrice(precioEl.innerText);
        var cantidad = parseInt(cantidadEl.value, 10);
        total += precioNum * cantidad;
      }
    });
    var totalEl = document.querySelector('.carrito-precio-total');
    totalEl.innerText = '$ ' + total.toFixed(2);
    mostrarMensajeVacioSiNecesario();
  }

  function mostrarMensajeVacioSiNecesario() {
    var itemsCarrito = document.querySelector('.carrito-items');
    if (itemsCarrito.children.length === 0) {
      itemsCarrito.innerHTML = '<p class="text-muted carrito-vacio">Tu carrito está vacío</p>';
    }
  }

  function pagarClicked() {
    alert('Gracias por su compra...');
    var itemsCarrito = document.querySelector('.carrito-items');
    itemsCarrito.innerHTML = '<p class="text-muted carrito-vacio">Tu carrito está vacío</p>';
    actualizarTotalCarrito();
  }

  function parsePrice(str) {
    var cleaned = ('' + str).replace(/[^0-9,.\-]/g, '').replace(',', '.');
    var n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }

  function escapeHtml(text) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return ('' + text).replace(/[&<>"']/g, m => map[m]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
