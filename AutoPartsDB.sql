CREATE TABLE productos(
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion_producto TEXT NOT NULL,
    precio INT NOT NULL,
    preciob2b INT NOT NULL,
    marca VARCHAR(50) NOT NULL,
    stock INT NOT NULL,
    url_imagen VARCHAR(255),
    product_weight DECIMAL(4,2) NOT NULL,
    product_height DECIMAL(4,2) NOT NULL,
    product_width DECIMAL(4,2) NOT NULL,
    product_length DECIMAL(5,2) NOT NULL
)
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE producto_categoria (
    id_producto INT,
    id_categoria INT,
    PRIMARY KEY (id_producto, id_categoria),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

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



INSERT INTO productos (nombre_producto, descripcion_producto, precio, preciob2b, marca,stock, url_imagen, product_weight, product_height, product_width, product_length)
VALUES ("Bujía de Níquel NGK BPR5EY",
 "Bujías de Encendido NGK cumplen una función vital en el motor de tu automóvil, ya que son las encargadas de encender la chispa que logra el arranque mediante la mezcla de combustible y oxígeno en cada cilindro.",
 2500,
 2000,
"NGK",
100,
"https://api.autoplanet.cl/medias/sys_master/images/h41/hf6/9713013686302/123008_1-1702994561/123008-1-1702994561.webp",
0.06,
3,
3,
9
)
INSERT INTO productos (nombre_producto, descripcion_producto, precio, preciob2b, marca,stock, url_imagen, product_weight, product_height, product_width, product_length)
VALUES("Batería de Auto BOSCH S4 39S470D-T 70AH 660CCA",
"Batería de auto BOSCH S4 39S470D-T de 70AH y 660CCA es uno de los elementos imprescindibles en todo vehículo, cumpliendo la función de almacenar la energía eléctrica para luego ser transmitida al motor de partida cada vez que quieras arrancar.",
135000,
120000,
"BOSCH",
10,
"https://api.autoplanet.cl/medias/sys_master/images/h20/hdd/9875066224670/1000330_1-1739980652/1000330-1-1739980652.webp",
17.09,
18,
18,
28
)

INSERT INTO productos (nombre_producto, descripcion_producto, precio, preciob2b, marca,stock, url_imagen, product_weight, product_height, product_width, product_length)
VALUES("Set de Ampolletas Pure Light W5w T10 de 12v y 5w",
"Ampolleta T10 12V 5W pertenece a la línea Pure Light de Bosch, cuyo diseño especial de filamento y la estructura del relleno de la bombilla le brindan parámetros idénticos a las bombillas de equipo de fábrica de los vehículos.",
6000,
5500,
"BOSCH",
35,
"https://easycl.vteximg.com.br/arquivos/ids/4819048/1098132-0000-001.jpg?v=638733510750100000",
0.01,
7,
14,
2
)