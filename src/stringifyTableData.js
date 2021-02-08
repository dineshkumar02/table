/**
 * Casts all cell values to a string.
 *
 * @param {table~row[]} rows
 * @returns {table~row[]}
 */
export default (rows) => {
  return rows.map((cells) => {
    return cells.map((item) => {
      if (typeof(item) == "object") {
        return JSON.stringify(item, null, 2);
      }
      return String(item);
    });
  });
};
