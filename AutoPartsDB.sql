CREATE TABLE productos(
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion_producto TEXT NOT NULL,
    precio INT NOT NULL,
    preciob2b INT NOT NULL,
    marca VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    stock INT NOT NULL,
    url_imagen VARCHAR(255),
    product_weight (4,2) NOT NULL,
    product.height (4,2) NOT NULL,
    product.width (4,2) NOT NULL,
    product.length (5,2) NOT NULL,
)

CREATE TABLE clientes(
    rut_cliente VARCHAR(10) PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    apellido_cliente VARCHAR(100) NOT NULL,
    direccion_cliente VARCHAR(100) NOT NULL,
    telefono_cliente VARCHAR(15) NOT NULL,
    correo_cliente VARCHAR(100) NOT NULL,
    tipo_cliente ENUM('B2C', 'B2B') DEFAULT 'B2C' NOT NULL
)

CREATE TABLE empleados(
    rut_empleado VARCHAR(10) PRIMARY KEY,
    nombre_empleado VARCHAR(100) NOT NULL,
    apellido_empleado VARCHAR(100) NOT NULL,
    rol_empleado ENUM('admin','bodeguero','vendedor','contador') NOT NULL,
    telefono_empleado VARCHAR(15) NOT NULL,
    correo_empleado VARCHAR(100) NOT NULL
)

CREATE TABLE pagos(
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    rut_cliente VARCHAR(10) NOT NULL,
    buy_order VARCHAR(255) NOT NULL, 
    monto_pago INT NOT NULL,
    token VARCHAR(100) NOT NULL,
    estado_pago ENUM('pendiente', 'completado','fallido', 'cancelado') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rut_cliente) REFERENCES clientes(rut_cliente)
)

CREATE TABLE ordenes (
  id_orden INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(100) NOT NULL,
  rut_cliente VARCHAR(10) NOT NULL,
  correo_cliente VARCHAR(100) NOT NULL,
  telefono_cliente VARCHAR(15) NOT NULL,
  direccion_cliente VARCHAR(100) NOT NULL,
  region_cliente VARCHAR(50) NOT NULL,
  ciudad_cliente VARCHAR(50) NOT NULL,
  comuna_cliente VARCHAR(50) NOT NULL,
  valor_envio INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  metodo_pago ENUM('webpay', 'transferencia_bancaria', 'efectivo') NOT NULL,
  total INT NOT NULL,
  estado ENUM('pendiente', 'completado','fallido', 'cancelado') NOT NULL
);

CREATE TABLE detalle_orden (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_orden INT,
  id_producto INT,
  cantidad INT,
  precio_unitario INT NOT NULL,
  FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);
