export default function sort2d(matrix, _value) {
  var iter = 0;
  var flag = 'row';
  var row_id_order = matrix.row_id_order();
  var col_id_order = matrix.col_id_order();
  var new_id_order;
  var value = _value || matrix.cell_value();

  while (true) {
    new_id_order = id_order_by_sum(flag, matrix, value);
    // ++iter;
    if (flag === 'row') {
      if (!same_order(row_id_order, new_id_order) && iter < 10) {
        row_id_order = new_id_order;
        matrix.order_rows_by_id(row_id_order);
        flag = 'col';
      } else break;
    } else if (flag === 'col') {
      if (!same_order(col_id_order, new_id_order) && iter < 10) {
        col_id_order = new_id_order;
        matrix.order_cols_by_id(col_id_order);
        flag = 'row';
      } else break;
    }
  }
  return matrix;
}
function same_order(order1, order2) {
  if (order1.length !== order2.length) throw Error('order length not match.');
  for (var i = 0; i < order1.length; i++) {
    if (order1[i] !== order2[i]) return false;
  }
  return true;
}
function id_order_by_sum(flag, matrix, value) {
  var row_id_order = matrix.row_id_order();
  var col_id_order = matrix.col_id_order();
  var sums;
  if (flag === 'row') {
    sums = row_id_order.map(function(row_id, i) {
      var sum = 0;
      col_id_order.forEach(function(col_id, j) {
        sum +=
          (col_id_order.length - j) * value(matrix.cell_by_id(row_id, col_id));
      });
      return {id: row_id, sum: sum};
    });
  } else if (flag === 'col') {
    sums = col_id_order.map(function(col_id, j) {
      var sum = 0;
      row_id_order.forEach(function(row_id, i) {
        sum +=
          (row_id_order.length - i) * value(matrix.cell_by_id(row_id, col_id));
      });
      return {id: col_id, sum: sum};
    });
  }
  sums.sort(function(a, b) {
    return b.sum - a.sum;
  });
  return sums.map(function(d) {
    return d.id;
  });
}
