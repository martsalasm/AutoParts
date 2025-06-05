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
    product_length DECIMAL(5,2) NOT NULL,
    updated_by VARCHAR(10) DEFAULT NULL
);
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
    contrasena_cliente VARCHAR(255) NOT NULL,
    nombre_cliente VARCHAR(100) NOT NULL,
    apellido_cliente VARCHAR(100) NOT NULL,
    telefono_cliente VARCHAR(15) NOT NULL,
    correo_cliente VARCHAR(100) NOT NULL,
    tipo_cliente ENUM('B2C', 'B2B') DEFAULT 'B2C' NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(10) DEFAULT NULL
)

CREATE TABLE empleados(
    rut_empleado VARCHAR(10) PRIMARY KEY,
    contrasena_empleado VARCHAR(255) NOT NULL,
    nombre_empleado VARCHAR(100) NOT NULL,
    apellido_empleado VARCHAR(100) NOT NULL,
    rol_empleado ENUM('admin','bodeguero','vendedor','contador') NOT NULL,
    telefono_empleado VARCHAR(15) NOT NULL,
    correo_empleado VARCHAR(100) NOT NULL
);

CREATE TABLE pagos(
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    rut_cliente VARCHAR(10) NOT NULL,
    buy_order VARCHAR(255) NOT NULL, 
    monto_pago INT NOT NULL,
    token VARCHAR(100) NOT NULL,
    estado_pago ENUM('pendiente', 'completado','fallido', 'cancelado') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rut_cliente) REFERENCES clientes(rut_cliente)
);

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

-- admin
/* 
{
  "rutEmpleado": "12.345.678-9",
  "nombreEmpleado": "Juan",
  "apellidoEmpleado": "Perez",
  "rolEmpleado": "admin",
  "telefonoEmpleado": "+56912345678",
  "correoEmpleado": "juan.perez@example.com",
  "contrasenaEmpleado": "1234"
}

*/
-- Poblar productos
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
);
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
);

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
);
INSERT INTO productos (nombre_producto, descripcion_producto, precio, preciob2b, marca,stock, url_imagen, product_weight, product_height, product_width, product_length)
VALUES("Alternador Chevrolet Luv 2300 CC 8V Motor 4ZD1",
"Alternador Chevrolet Luv 2300 CC 8V Motor 4ZD1, con una potencia de 55A y un voltaje de 12V, es un componente esencial para el sistema eléctrico de tu vehículo, asegurando un suministro constante de energía.",
114000,
100000,
"Kuboshi",
10,
"https://media.falabella.com/falabellaCL/135611019_01/w=1500,h=1500,fit=pad",
4.1,
18,
22,
22
);

























-- Poblar Categorias 

INSERT INTO categorias (nombre_categoria) VALUES ('Destacados');  
INSERT INTO categorias (nombre_categoria) VALUES ('Motores y componentes');
INSERT INTO categorias (nombre_categoria) VALUES ('Filtros de aceite');
INSERT INTO categorias (nombre_categoria) VALUES ('Filtros de aire');
INSERT INTO categorias (nombre_categoria) VALUES ('Bujias');
INSERT INTO categorias (nombre_categoria) VALUES ('Correas de distribucion');
INSERT INTO categorias (nombre_categoria) VALUES ('Frenos y suspension');
INSERT INTO categorias (nombre_categoria) VALUES ('Pastillas de freno');
INSERT INTO categorias (nombre_categoria) VALUES ('Discos de freno');
INSERT INTO categorias (nombre_categoria) VALUES ('Amortiguadores');
INSERT INTO categorias (nombre_categoria) VALUES ('Rotulas');
INSERT INTO categorias (nombre_categoria) VALUES ('Electricidad y baterias');
INSERT INTO categorias (nombre_categoria) VALUES ('Alternadores');
INSERT INTO categorias (nombre_categoria) VALUES ('Baterias');
INSERT INTO categorias (nombre_categoria) VALUES ('Luces y faros');
INSERT INTO categorias (nombre_categoria) VALUES ('Sensores y fusibles');
INSERT INTO categorias (nombre_categoria) VALUES ('Accesorios de seguridad');
INSERT INTO categorias (nombre_categoria) VALUES ('Alarmas');
INSERT INTO categorias (nombre_categoria) VALUES ('Cinturones de seguridad');
INSERT INTO categorias (nombre_categoria) VALUES ('Cubre asientos');
INSERT INTO categorias (nombre_categoria) VALUES ('Kits de emergencia');

-- Poblar producto_categoria
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (1, 1); -- Bujía de Níquel NGK BPR5EY / Destacados
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (1, 2); -- Bujía de Níquel NGK BPR5EY / Motores y componentes
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (1, 5); -- Bujía de Níquel NGK BPR5EY / Bujias
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (2, 12); -- Batería de Auto BOSCH S4 39S470D-T 70AH 660CCA / Electricidad y baterias
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (2, 14); -- Batería de Auto BOSCH S4 39S470D-T 70AH 660CCA / Baterias