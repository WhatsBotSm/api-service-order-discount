//columnas para la insersion
const columnsInsDesc = [
  "id_client_admin_bot",
  "idbot_control",
  "nombre",
  "descripcion",
  "tipo_descuento",
  "valor",
  "fecha_inicio",
  "fecha_fin",
  "codigo"
];
//columnas para consulta
const columnsGetDesc = [
  "id_descuento",
  "id_client_admin_bot",
  "idbot_control",
  "nombre",
  "descripcion",
  "tipo_descuento",
  "valor",
  "fecha_inicio",
  "fecha_fin",
  "codigo"
];
// columnas para actualizar
const columnsUpdateDesc = [
  "id_client_admin_bot",
  "idbot_control",
  "nombre",
  "descripcion",
  "tipo_descuento",
  "valor",
  "fecha_inicio",
  "fecha_fin",
  "codigo"
];

const baseQueryDesc = "FROM orders_bot.descuentos de";//nombre de la tabla para descuento
const baseOrder = "order by id_descuento asc";//orden ascendente por id_descuento

const ftIdDescuento = (paramIndex) => `id_descuento = $${paramIndex}`;//id_descuento para where
const ftIdDescBot = (paramIndex) => `idbot_control = $${paramIndex}`;//id_bot para el uso de where

//insertar
export const queryInsertDesc = `INSERT INTO orders_bot.descuentos (${columnsInsDesc.join(",")}) 
        VALUES (${columnsInsDesc.map((e, i) => `$${i + 1}`).join(",")}) returning id_descuento`;

//consultar por id_descuento
export const selColumnsDesc = `SELECT ${columnsGetDesc.join(",")} ${baseQueryDesc} WHERE ${ftIdDescuento(1)};`;

//consultar por id_bot
export const selColumnsDescByBot = `SELECT ${columnsGetDesc.join(",")} ${baseQueryDesc} WHERE ${ftIdDescBot(1)}`;

//consulta por id_bot para el paginado
export const selColumnsDescPaguinado =  `SELECT COUNT(*) AS Totalrows ${baseQueryDesc} WHERE ${ftIdDescBot(1)}`;
//filtro de busqueda por nombre
export const ftSearchTerm = (paramIndex) =>  ` AND (nombre ILIKE $${paramIndex} OR descripcion ILIKE $${paramIndex} OR tipo_descuento ILIKE $${paramIndex})`;
export const ftType = (paramIndex) =>  ` AND tipo_descuento = $${paramIndex}`;//filtro por tipo de descuento
export const ftStartDate = (paramIndex) =>  ` AND fecha_inicio >= $${paramIndex}`;//filtro por fecha inicio
export const ftEndDate = (paramIndex) =>  ` AND fecha_fin <= $${paramIndex}`;//filtro por fecha fin
export const ftOffsetDes = (paramIndex) =>  ` ORDER BY id_descuento ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;//offset y limit para el paginado

//consulta por id_bot con orden ascendente
export const selTodoDes = `SELECT ${columnsGetDesc.join(",")} ${baseQueryDesc} ${baseOrder} WHERE ${ftIdDescBot(1)};`;

//actualizacion por id_descuento
export const updColumnsDesc = `UPDATE orders_bot.descuentos
SET ${columnsUpdateDesc.map((e, j) => `${e} = $${j + 1}`).join(", ")} 
WHERE ${ftIdDescuento(columnsUpdateDesc.length+1)};`;
