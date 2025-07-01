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
    updated_by VARCHAR(200) DEFAULT NULL
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
);

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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ordenes (
  id_orden INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(100) NOT NULL,
  apellido_cliente VARCHAR(100) NOT NULL,
  rut_cliente VARCHAR(10) NOT NULL,
  tipo_cliente ENUM('B2C', 'B2B') DEFAULT 'B2C' NOT NULL,
  correo_cliente VARCHAR(100) NOT NULL,
  telefono_cliente VARCHAR(15) NOT NULL,
  tipo_envio ENUM('retiro', 'despacho') NOT NULL,
  direccion_cliente VARCHAR(100) NOT NULL,
  apartamento_cliente VARCHAR(50) NULL,
  region_cliente VARCHAR(50) NOT NULL,
  comuna_cliente VARCHAR(50) NOT NULL,
  valor_envio INT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  metodo_pago ENUM('webpay', 'transferencia', 'efectivo') NOT NULL,
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
),
("Batería de Auto BOSCH S4 39S470D-T 70AH 660CCA",
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
),
("Set de Ampolletas Pure Light W5w T10 de 12v y 5w",
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
),
("Alternador Chevrolet Luv 2300 CC 8V Motor 4ZD1",
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
),
("Filtro de Aceite Hu7019z",
"Dale a tu motor la protección que se merece con el filtro de aceite Hu7019z de Bosch.
Fabricado con materiales de primera calidad, este filtro asegura una larga vida útil y un rendimiento óptimo.
 Su instalación es sencilla y viene con todo lo necesario para que puedas realizarla sin problemas.",
 9590,
 8990,
"Bosch",
  50,
  "https://dojiw2m9tvv09.cloudfront.net/40652/product/X_hu7019zhk3723.jpg?321&time=1749133689",
  0.3,
  10,
  10,
  10
  ),
("Filtro de aire de cabina HEPA",
"Los filtros de aire de cabina de alta eficiencia de Bosch están diseñados para proporcionar a tu vehículo lo último en aire limpio, fresco y sin olor para ti y tu familia.",
18900,
16900,
"Bosch",
35,
"https://m.media-amazon.com/images/I/71rzO4rpweL._AC_SL1500_.jpg",
0.5,
10,
10,
10),
(
  "Correa de Distribución Bosch B111SP170",
  "Correa de distribución original Bosch para vehículos Chevrolet.",
  14543,
  13990,
  "Bosch",
  30,
  "https://http2.mlstatic.com/D_NQ_NP_913289-MLA83528696566_042025-F.webp",
  0.5,
  10,
  10,
  10
),
(
  "Pastillas de Freno Delanteras Bosch VW Amarok 2.0 2010-2023",
  "Juego de pastillas de freno delanteras Bosch para Volkswagen Amarok 2.0, modelos 2010 a 2023.",
  67990,
  64990,
  "Bosch",
  10,
  "https://cdnx.jumpseller.com/solol200/image/45401026/resize/540/540?1707507084",
  1.5,
  10,
  10,
  10
),
(
  "Disco de Freno Bosch Delantero",
  "Disco de freno delantero Bosch, compatible con diversos modelos de vehículos.",
  37840,
  34990,
  "Bosch",
  15,
  "https://http2.mlstatic.com/D_NQ_NP_898347-MLU32026318976_082019-O.webp",
  4.0,
  10,
  10,
  10
),
(
  "Amortiguador Delantero Bosch",
  "Amortiguador delantero Bosch, diseñado para ofrecer un rendimiento óptimo y seguridad en la conducción.",
  27991,
  25990,
  "Bosch",
  20,
  "https://www.repuestosboston.cl/media/catalog/product/5/4/54661d3000a_1.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=566&width=756&canvas=756:566",
  3.5,
  10,
  10,
  10
),
(
  "Rótula de Suspensión Bosch",
  "Rótula de suspensión Bosch, fabricada con materiales de alta calidad para garantizar durabilidad y seguridad.",
  12000,
  11000,
  "Bosch",
  25,
  "https://cdn.autodoc.de/thumb?id=22285186&m=1&n=0&lng=es&rev=94077893",
  0.8,
  10,
  10,
  10
),
(
  "Kit de 300 Fusibles Automotrices",
  "Kit que incluye 300 fusibles automotrices de diferentes amperajes, ideal para reemplazo y mantenimiento.",
  5990,
  4990,
  "Bosch",
  50,
  "https://media.falabella.com/falabellaCL/119092953_01/w=800,h=800,fit=pad",
  0.3,
  10,
  10,
  10
),
(
  "Alarma Para Automóviles NEMESIS MP1",
  "Sistema de alarma NEMESIS MP1, diseñado para proteger tu vehículo con tecnología avanzada y fácil instalación.",
  20000,
  13700,
  "Bosch",
  5,
  "https://api.autoplanet.cl/medias/sys_master/images/h2f/he5/9875281969182/1050861_1-1739980652/1050861-1-1739980652.webp",
  0.64,
  15,
  12,
  19
),
(
  "Cinturón de Seguridad 3 Puntas",
  "Cinturón de seguridad de 3 puntos, compatible con diversos modelos de vehículos.",
  11000,
  10000,
  "Bosch",
  30,
  "https://api.autoplanet.cl/medias/sys_master/images/h1e/h14/9871490154526/120732_1-1739980652/120732-1-1739980652.webp",
  0.5,
  10,
  10,
  10
),
(
  "Fundas Cubreasiento Sparco Universal",
  "Fundas cubreasiento Sparco universales, color negro, fabricadas en poliéster, ideales para proteger los asientos.",
  33990,
  29990,
  "Sparco",
  40,
  "https://www.dimarsa.cl/media/catalog/product/m/a/marcassparcosps424bkr-negro1jpeg_0_1.jpg",
  1.0,
  10,
  10,
  10
),
(
  "Kit de Emergencia para Auto 11 Piezas",
  "¡Disfruta de la seguridad y la tranquilidad de contar con un kit de emergencia profesional! Es un producto especialmente diseñado para ser tu mejor compañero de viaje en cada recorrido, es imprescindible junto a tu caja de herramientas, las múltiples funciones de sus piezas te permitirán resolver de manera efectiva las anomalías mecánicas y eléctricas que presente tu vehículo.",
  56900,
  49900,
  "Power Grid",
  15,
  "https://api.autoplanet.cl/medias/sys_master/images/h89/h29/9875441877022/1073400_1-1739980652/1073400-1-1739980652.webp",
  2.5,
  10,
  10,
  10
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
-- Filtro de Aceite Hu7019z
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (5, 1); -- Destacados
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (5, 3); -- Filtros de aceite

-- Filtro de aire de cabina HEPA
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (6, 1); -- Destacados
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (6, 4); -- Filtros de aire

-- Correa de Distribución Bosch B111SP170
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (7, 2); -- Motores y componentes
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (7, 6); -- Correas de distribucion

-- Pastillas de Freno Delanteras Bosch VW Amarok 2.0 2010-2023
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (8, 1); -- Destacados
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (8, 7); -- Frenos y suspension
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (8, 8); -- Pastillas de freno

-- Disco de Freno Bosch Delantero
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (9, 7); -- Frenos y suspension
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (9, 9); -- Discos de freno

-- Amortiguador Delantero Bosch
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (10, 7); -- Frenos y suspension
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (10, 10); -- Amortiguadores

-- Rótula de Suspensión Bosch
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (15, 7); -- Frenos y suspension
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (15, 11); -- Rotulas

-- Kit de 300 Fusibles Automotrices
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (16, 12); -- Electricidad y baterias
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (16, 16); -- Sensores y fusibles

-- Sistema de Alarma Bosch Integral
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (13, 17); -- Accesorios de seguridad
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (13, 18); -- Alarmas

-- Cinturón de Seguridad 3 Puntas
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (14, 17); -- Accesorios de seguridad
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (14, 19); -- Cinturones de seguridad

-- Fundas Cubreasiento Sparco Universal
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (15, 17); -- Accesorios de seguridad
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (15, 20); -- Cubre asientos

-- Kit de Emergencia Starter 1
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (16, 17); -- Accesorios de seguridad
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (16, 21); -- Kits de emergencia



ALTER TABLE detalle_orden
DROP FOREIGN KEY detalle_orden_ibfk_2;

ALTER TABLE detalle_orden
ADD CONSTRAINT detalle_orden_ibfk_2
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
  ON DELETE CASCADE;


ALTER TABLE producto_categoria
DROP FOREIGN KEY producto_categoria_ibfk_1;

ALTER TABLE producto_categoria
ADD CONSTRAINT producto_categoria_ibfk_1
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
  ON DELETE CASCADE;
