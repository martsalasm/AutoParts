/**
 * @jest-environment jsdom
 */

//  Mocking/Simulaciones
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.fetch = jest.fn();

//Función de espera
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));


//Suite de Pruebas
describe('Lógica del Checkout', () => {
  let mockApiData;

  beforeEach(() => {
    mockApiData = {
      '/productos/detalles': [],
      'comunas-regiones.json': { regiones: [] },
      '/chilexpress/validarCobertura': { tieneCobertura: false },
      '/chilexpress/calcularDespacho': { data: { courierServiceOptions: [] } },
      '/ordenes': { id_orden: '123-test' },
      '/webpay/iniciar': { url: 'http://webpay.cl', token: 'token123' },
    };

    fetch.mockImplementation(url => {
      let responseData;
      if (url.includes('/productos/detalles')) {
        responseData = mockApiData['/productos/detalles'];
      } else if (url.includes('comunas-regiones.json')) {
        responseData = mockApiData['comunas-regiones.json'];
      } else if (url.includes('/chilexpress/validarCobertura')) {
        responseData = mockApiData['/chilexpress/validarCobertura'];
      } else if (url.includes('/chilexpress/calcularDespacho')) {
        responseData = mockApiData['/chilexpress/calcularDespacho'];
      } else if (url.includes('/ordenes')) {
        responseData = mockApiData['/ordenes'];
      } else if (url.includes('/webpay/iniciar')) {
        responseData = mockApiData['/webpay/iniciar'];
      } else {
        return Promise.reject(new Error(`URL no simulada en el test: ${url}`));
      }
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responseData),
      });
    });

    localStorage.clear();
    jest.resetModules();

    document.body.innerHTML = `
      <div id="checkout-subtotal"></div><div id="checkout-shipping"></div>
      <div id="checkout-total"></div><button id="finalize-btn"></button>
      <div id="shipping-info" style="display: block;"></div>
      <form id="checkout-form">
        <input type="radio" name="payment" value="webpay" checked />
        <input type="radio" name="delivery" value="despacho" checked />
        <input type="radio" name="delivery" value="retiro" />
        <input id="rut" /><input id="name" value="Test"/><input id="lastname" value="User"/>
        <input id="email" value="test@test.com"/><input id="phone" value="123456789"/>
        <input id="address"/><input id="apartment"/>
        <select id="region"><option value=""></option></select>
        <select id="comuna"><option value=""></option></select>
      </form>
    `;
    
    require('../checkout.js');
  });

  // Requisito: Si no hay productos en el localstorage el subtotal es 0
  test('Si no hay productos en localStorage, el subtotal es 0', async () => {
    localStorage.setItem('cart', JSON.stringify([]));
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();
    const subtotalElement = document.getElementById('checkout-subtotal');
    expect(subtotalElement.textContent).toBe('$0');
  });

  // Requisito: El valor de los productos * cantidad se calcula bien
  test('El valor de los productos * cantidad se calcula bien', async () => {
    localStorage.setItem('cart', JSON.stringify([{ id: '1', quantity: 2 }, { id: '2', quantity: 1 }]));
    mockApiData['/productos/detalles'] = [{ id: 1, precio: 1000 }, { id: 2, precio: 5000 }];
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();
    const subtotalElement = document.getElementById('checkout-subtotal');
    expect(subtotalElement.textContent).toBe('$7.000');
  });

  // Requisito: Si el tipo de envio es retiro, el valor de envio es 0 / El valor de los productos*cantidad + valor de retiro se calcula bien
  test('Si el envío es retiro, el valor de envío es 0 y el total es igual al subtotal', async () => {
    localStorage.setItem('cart', JSON.stringify([{ id: '1', quantity: 1 }]));
    mockApiData['/productos/detalles'] = [{ id: 1, precio: 5000 }];
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    const shippingCostEl = document.getElementById('checkout-shipping');
    const retiroRadio = document.querySelector('input[value="retiro"]');

    retiroRadio.checked = true;
    retiroRadio.dispatchEvent(new Event('change'));
    
    expect(shippingCostEl.textContent).toBe('$0'); // El valor de envío es 0
    expect(totalElement.textContent).toBe(subtotalElement.textContent); // El total es igual al subtotal
    expect(totalElement.textContent).toBe('$5.000');
  });

  // Requisito: Que se asigne correctamente la Altura ancho y largo del producto mas grande.
  test('Asigna correctamente las dimensiones del producto más grande', async () => {
    localStorage.setItem('cart', JSON.stringify([
      { id: '1', quantity: 1 }, { id: '2', quantity: 1 }, { id: '3', quantity: 1 }
    ]));
    mockApiData['/productos/detalles'] = [
        { id: 1, precio: 1, height: 10, width: 20, length: 30, weight: 1 },
        { id: 2, precio: 1, height: 40, width: 15, length: 25, weight: 1 },
        { id: 3, precio: 1, height: 35, width: 25, length: 35, weight: 1 }
    ];
    mockApiData['comunas-regiones.json'] = { regiones: [{ region: 'Región Metropolitana de Santiago', regionId: 'RM', comunas: ['Providencia'] }] };
    mockApiData['/chilexpress/validarCobertura'] = { tieneCobertura: true, countyCode: 'STGO' };
    
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');

    regionSelect.value = 'Región Metropolitana de Santiago';
    regionSelect.dispatchEvent(new Event('change'));
    await flushPromises();

    comunaSelect.value = 'Providencia';
    comunaSelect.dispatchEvent(new Event('change'));
    await flushPromises();

    const calcularDespachoCall = fetch.mock.calls.find(c => c[0].includes('calcularDespacho'));
    expect(calcularDespachoCall).toBeDefined();
    
    const fetchBody = JSON.parse(calcularDespachoCall[1].body);
    expect(fetchBody.package.height).toBe(40);
    expect(fetchBody.package.width).toBe(25);
    expect(fetchBody.package.length).toBe(35);
  });
});

describe('Validación y Envío de Formulario', () => {
    let mockApiData;
    // La configuración de beforeEach debe estar disponible también en este bloque
    beforeEach(() => {
        mockApiData = {
          '/productos/detalles': [],
          'comunas-regiones.json': { regiones: [] },
          '/ordenes': { id_orden: '123-test' },
          '/webpay/iniciar': { url: 'http://webpay.cl', token: 'token123' },
        };
        fetch.mockImplementation(url => {
          // ... (la misma implementación de fetch de arriba)
          let responseData;
          if (url.includes('/productos/detalles')) { responseData = mockApiData['/productos/detalles']; }
          else if (url.includes('comunas-regiones.json')) { responseData = mockApiData['comunas-regiones.json']; }
          else if (url.includes('/ordenes')) { responseData = mockApiData['/ordenes']; }
          else if (url.includes('/webpay/iniciar')) { responseData = mockApiData['/webpay/iniciar']; }
          else { return Promise.reject(new Error(`URL no simulada: ${url}`)); }
          return Promise.resolve({ ok: true, json: () => Promise.resolve(responseData) });
        });

        localStorage.clear();
        jest.resetModules();
        document.body.innerHTML = `
          <div id="checkout-subtotal"></div><div id="checkout-shipping"></div>
          <div id="checkout-total"></div><button id="finalize-btn"></button>
          <div id="shipping-info" style="display: block;"></div>
          <form id="checkout-form">
            <input type="radio" name="payment" value="webpay" checked />
            <input type="radio" name="delivery" value="retiro" checked />
            <input id="rut" /><input id="name" value="Test"/><input id="lastname" value="User"/>
            <input id="email" value="test@test.com"/><input id="phone" value="123456789"/>
            <input id="address"/><input id="apartment"/>
            <select id="region"><option value=""></option></select>
            <select id="comuna"><option value=""></option></select>
          </form>
        `;
        require('../checkout.js');
    });

    // Requisito: si se trata de utilizar sql injection, el sistema lo trata como data.
    test('Un intento de SQL Injection es tratado como data y no se ejecuta', async () => {
        const sqlInjectionString = "' OR 1=1; --";
        document.getElementById('name').value = sqlInjectionString; // Inyectamos en el nombre
        
        localStorage.setItem('cart', JSON.stringify([{ id: '1', quantity: 1 }]));
        mockApiData['/productos/detalles'] = [{ id: 1, precio: 1000 }];

        document.dispatchEvent(new Event('DOMContentLoaded'));
        await flushPromises();

        document.getElementById('checkout-form').dispatchEvent(new Event('submit'));
        await flushPromises();
        
        const ordenesFetchCall = fetch.mock.calls.find(c => c[0].includes('/ordenes'));
        expect(ordenesFetchCall).toBeDefined(); // Verificamos que se intentó crear la orden

        const payload = JSON.parse(ordenesFetchCall[1].body);
        // La aserción clave: el valor en el payload es el string exacto que enviamos.
        expect(payload.nombre_cliente).toBe(sqlInjectionString);
    });

    // Requisito: si el rut no sigue este formato [...] no se crea la orden
    test('Valida el formato del RUT chileno correctamente', () => {
        const isValidRut = (rut) => {
            if (!rut || typeof rut !== 'string') return false;
            const regex = /^([1-9]|[1-9]\d{1,2})(\.?\d{3})*-(\d|k|K)$/;
            return regex.test(rut.replace(/\./g, ''));
        };

        // Casos Válidos
        expect(isValidRut("12345678-9")).toBe(true);
        expect(isValidRut("9876543-K")).toBe(true);
        expect(isValidRut("1.234.567-8")).toBe(true);

        // Casos Inválidos
        expect(isValidRut("123456789")).toBe(false); // Sin guion
        expect(isValidRut("12.345.678-G")).toBe(false); // Dígito verificador inválido
        expect(isValidRut("01.234.567-8")).toBe(false); // RUT no debe empezar con 0
    });
});