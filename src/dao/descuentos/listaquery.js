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

const baseQueryDesc = "FROM orders_bot.descuentos de";
const baseOrder = "order by id_descuento asc";

const ftIdDescuento = (paramIndex) => `id_descuento = $${paramIndex}`;
const ftIdDescBot = (paramIndex) => `idbot_control = $${paramIndex}`;

export const queryInsertDesc = `INSERT INTO orders_bot.descuentos (${columnsInsDesc.join(",")}) 
        VALUES (${columnsInsDesc.map((e, i) => `$${i + 1}`).join(",")}) returning id_descuento`;

export const selColumnsDesc = `SELECT ${columnsGetDesc.join(",")} ${baseQueryDesc} WHERE ${ftIdDescuento(1)};`;

export const selColumnsDescByBot = `SELECT ${columnsGetDesc.join(",")} ${baseQueryDesc} WHERE ${ftIdDescBot(1)}`;

export const selColumnsDescPaguinado =  `SELECT COUNT(*) AS Totalrows ${baseQueryDesc} WHERE ${ftIdDescBot(1)}`;
export const ftSearchTerm = (paramIndex) =>  ` AND (nombre ILIKE $${paramIndex} OR descripcion ILIKE $${paramIndex})`;
export const ftType = (paramIndex) =>  ` AND tipo_descuento = $${paramIndex}`;
export const ftStartDate = (paramIndex) =>  ` AND fecha_inicio >= $${paramIndex}`;
export const ftEndDate = (paramIndex) =>  ` AND fecha_fin <= $${paramIndex}`;
export const ftOffsetDes = (paramIndex) =>  ` ORDER BY id_descuento ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

export const selTodoDes = `SELECT ${columnsGetDesc.join(",")} ${baseQueryDesc} ${baseOrder} WHERE ${ftIdDescBot(1)};`;

export const updColumnsDesc = `UPDATE orders_bot.descuentos
SET ${columnsUpdateDesc.map((e, j) => `${e} = $${j + 1}`).join(", ")} 
WHERE ${ftIdDescuento(columnsUpdateDesc.length+1)};`;
