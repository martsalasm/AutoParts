// api/__mocks__/database.js

// Exportamos un objeto 'default' que simula la conexión a la base de datos.
// La propiedad 'query' es una función mock de Jest.
export default {
  query: jest.fn()
};