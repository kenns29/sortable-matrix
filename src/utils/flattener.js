import Matrix from '../matrix';
export default function(_matrix) {
  let matrix = _matrix || Matrix();
  let boundary = {x0: -1, x1: -1, y0: -1, y1: -1};
  function cells() {
    const r_cells = [];
    const row_id_order = matrix.row_id_order();
    const col_id_order = matrix.col_id_order();
    let {x0, x1, y0, y1} = boundary;
    if (x0 < 0) x0 = 0;
    if (y0 < 0) y0 = 0;
    if (x1 < 0 || x1 > col_id_order.length) x1 = col_id_order.length;
    if (y1 < 0 || y1 > row_id_order.length) y1 = row_id_order.length;
    let row_index = 0;
    for (let i = y0; i < y1; i++) {
      const row_id = row_id_order[i];
      if (matrix.is_row_id_active(row_id)) {
        let col_index = 0;
        for (let j = x0; j < x1; j++) {
          const col_id = col_id_order[j];
          if (matrix.is_col_id_active(col_id)) {
            const data = matrix.cell_by_id(row_id, col_id);
            const v = value(data);
            r_cells.push({
              id: row_id + '-' + col_id,
              row_id,
              col_id,
              data,
              value: v,
              row_index,
              col_index,
              row_index_absolute: i,
              col_index_absolute: j
            });
            ++col_index;
          }
        }
        ++row_index;
      }
    }
    return r_cells;
  }
  const flatten = function() {
    return cells();
  };
  flatten.cells = cells;
  flatten.rows = function() {
    const row_id_order = matrix.row_id_order();
    let {y0, y1} = boundary;
    if (y0 < 0) y0 = 0;
    if (y1 < 0 || y1 > row_id_order.length) y1 = row_id_order.length;
    return matrix.row_id_order().slice(y0, y1);
  };
  flatten.cols = function() {
    const col_id_order = matrix.col_id_order();
    let {x0, x1} = boundary;
    if (x0 < 0) x0 = 0;
    if (x1 < 0 || x1 > col_id_order.length) x1 = col_id_order.length;
    return matrix.col_id_order().slice(x0, x1);
  };
  flatten.matrix = function(_) {
    return arguments.length ? ((matrix = _), flatten) : matrix;
  };
  flatten.boundary = function(_) {
    return arguments.length ? ((boundary = _), flatten) : boundary;
  };
  return flatten;
}
