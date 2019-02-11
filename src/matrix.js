/**
 * Matrix -- sortable, row and column removable
 * Author: Hong Wang
 */

import {functor} from './utils';

export default function matrix() {
  var matrix = [];
  var row_ids = []; //index is matrix's row index, and values id
  var col_ids = []; //index is matrix's col index, and values id

  var row_indexes = []; //index is row's id, and value is index
  var col_indexes = []; //index is col's id, and value is index

  var row_index_active = []; //index is row's index, and value is boolean
  var col_index_active = []; //index is col's index, and value is boolean

  var row_dist_pairs = [];
  var col_dist_pairs = [];

  var row_order = []; //stores the row indexes with customized order
  var col_order = []; //stores the col indexes with customized order
  var order_on_dist = false;
  function cell_value(node) {
    return node;
  }

  function row_vector_by_id(id) {
    return row_vector(row_indexes[id]);
  }
  function col_vector_by_id(id) {
    return col_vector(col_indexes[id]);
  }
  function activate_row_by_id(id) {
    return activate_row(row_indexes[id]);
  }
  function activate_col_by_id(id) {
    return activate_col(col_indexes[id]);
  }
  function deactivate_row_by_id(id) {
    return deactivate_row(row_indexes[id]);
  }
  function deactivate_col_by_id(id) {
    return deactivate_col(col_indexes[id]);
  }
  function row_vector(index) {
    if (!row_index_active[index])
      throw 'Error, row on index ' + index + ' is not active';
    var row = [];
    matrix[index].forEach(function(value, idx) {
      if (col_index_active[index]) {
        row.push(value);
      }
    });
    return row;
  }

  function col_vector(index) {
    if (!col_index_active[index])
      throw 'Error, col on index ' + index + ' is not active';
    var col = [];
    matrix.forEach(function(row, idx) {
      if (row_index_active[idx]) {
        col.push(value);
      }
    });
    return col;
  }

  function activate_row(index) {
    row_index_active[index] = true;
    return ret;
  }

  function deactivate_row(index) {
    row_index_active[index] = false;
    return ret;
  }

  function activate_col(index) {
    col_index_active[index] = true;
    return ret;
  }

  function deactivate_col(index) {
    col_index_active[index] = false;
    return ret;
  }

  function calc_row_euclidean_dist(index1, index2) {
    var v,
      j,
      sum = 0;
    for (j = 0; j < matrix[index1].length; j++) {
      if (col_index_active[j]) {
        sum +=
          (v = cell_value(matrix[index1][j]) - cell_value(matrix[index2][j])) *
          v;
      }
    }
    return Math.sqrt(sum);
  }

  function calc_col_euclidean_dist(index1, index2) {
    var v,
      i,
      sum = 0;
    for (i = 0; i < matrix.length; i++) {
      if (row_index_active[i]) {
        sum +=
          (v = cell_value(matrix[i][index1]) - cell_value(matrix[i][index2])) *
          v;
      }
    }
    return Math.sqrt(sum);
  }

  function reset_row_dist_pairs() {
    row_dist_pairs = [];
    var i, j;
    for (i = 0; i < matrix.length; i++) {
      if (!row_dist_pairs[i]) row_dist_pairs[i] = [];
      for (j = i + 1; j < matrix.length; j++) {
        row_dist_pairs[i][j] = calc_row_euclidean_dist(i, j);
      }
    }
    return ret;
  }

  function reset_col_dist_pairs() {
    col_dist_pairs = [];
    var i, j;
    if (matrix[0]) {
      for (i = 0; i < matrix[0].length; i++) {
        if (!col_dist_pairs[i]) col_dist_pairs[i] = [];
        for (j = i + 1; j < matrix[0].length; j++) {
          col_dist_pairs[i][j] = calc_col_euclidean_dist(i, j);
        }
      }
    }
  }

  function row_dist(index1, index2) {
    if (index1 === index2) return 0;
    else
      return index1 < index2
        ? row_dist_pairs[index1][index2]
        : row_dist_pairs[index2][index1];
  }
  function col_dist(index1, index2) {
    if (index1 === index2) return 0;
    else
      return index1 < index2
        ? col_dist_pairs[index1][index2]
        : col_dist_pairs[index2][index1];
  }
  function row_dist_by_id(id1, id2) {
    return row_dist(row_indexes[id1], row_indexes[id2]);
  }
  function col_dist_by_id(id1, id2) {
    return col_dist(col_indexes[id1], col_indexes[id2]);
  }

  function maker() {
    if (matrix && row_ids && col_ids) {
      if (
        matrix.length === row_ids.length &&
        matrix[0] &&
        matrix[0].length === col_ids.length
      ) {
        var i;
        for (i = 0; i < row_ids.length; i++) {
          row_indexes[row_ids[i]] = i;
          row_index_active[i] = true;
        }
        for (i = 0; i < col_ids.length; i++) {
          col_indexes[col_ids[i]] = i;
          col_index_active[i] = true;
        }
        if (order_on_dist) {
          reset_row_dist_pairs();
          reset_col_dist_pairs();
        }
        row_order = matrix.map(function(d, i) {
          return i;
        });
        col_order = matrix[0].map(function(d, i) {
          return i;
        });
      }
    }
    return ret;
  }

  function order_rows_by_dist(index) {
    if (!order_on_dist) return;
    var i;
    var index_dist = []; //[{index, dist}]
    for (i = 0; i < matrix.length; i++) {
      if (i !== index) {
        index_dist.push({
          index: i,
          dist: row_dist(index, i)
        });
      }
    }
    index_dist.sort(function(a, b) {
      return a.dist - b.dist;
    });
    var indexes = index_dist.map(function(d) {
      return d.index;
    });
    indexes.unshift(index);
    row_order = indexes;
    reset_row_dist_pairs();
    return row_order;
  }
  function order_cols_by_dist(index) {
    if (!order_on_dist) return;
    var index_dist = [];
    if (matrix[0]) {
      for (j = 0; j < matrix[0].length; j++) {
        if (j !== index) {
          index_dist.push({
            index: j,
            dist: col_dist(index, j)
          });
        }
      }
    }
    index_dist.sort(function(a, b) {
      return a.dist - b.dist;
    });
    var indexes = index_dist.map(function(d) {
      return d.index;
    });
    indexes.unshift(index);
    col_order = indexes;
    reset_col_dist_pairs();
    return col_order;
  }

  function order_rows_by_array(_) {
    if (_.length !== row_order.length) throw Error('length of rows not match.');
    row_order = _;
  }
  function order_cols_by_array(_) {
    if (_.length !== col_order.length) throw Error('length of cols not match.');
    col_order = _;
  }
  function order_rows(_) {
    if (Object.prototype.toString.call(_) === '[object Array]') {
      order_rows_by_array(_);
    } else {
      order_rows_by_dist(_);
    }
  }

  function order_cols(_) {
    if (Object.prototype.toString.call(_) === '[object Array]') {
      order_cols_by_array(_);
    } else {
      order_cols_by_dist(_);
    }
  }

  function order_rows_by_id(_) {
    if (Object.prototype.toString.call(_) === '[object Array]') {
      var index_array = Array(_.length);
      for (var i = 0; i < _.length; i++) {
        index_array[i] = row_indexes[_[i]];
      }
      order_rows(index_array);
    } else return order_rows(row_indexes[_]);
  }

  function order_cols_by_id(_) {
    if (Object.prototype.toString.call(_) === '[object Array]') {
      var index_array = Array(_.length);
      for (var i = 0; i < _.length; i++) {
        index_array[i] = col_indexes[_[i]];
      }
      order_cols(index_array);
    } else return order_cols(col_indexes[_]);
  }

  function row_id_order() {
    return row_order.map(function(d) {
      return row_ids[d];
    });
  }
  function col_id_order() {
    return col_order.map(function(d) {
      return col_ids[d];
    });
  }
  function active_row_order() {
    var order = [];
    row_order.forEach(function(d) {
      if (row_index_active[d]) order.push(d);
    });
    return order;
  }
  function active_col_order() {
    var order = [];
    col_order.forEach(function(d) {
      if (col_index_active[d]) order.push(d);
    });
    return order;
  }
  function active_row_id_order() {
    return active_row_order().map(function(d) {
      return row_ids[d];
    });
  }
  function active_col_id_order() {
    return active_col_order().map(function(d) {
      return col_ids[d];
    });
  }
  function row_id(index) {
    return row_ids[index];
  }

  function col_id(index) {
    return col_ids[index];
  }

  function row_index(id) {
    return row_ids[id];
  }

  function col_index(id) {
    return col_ids[id];
  }

  function cell(r_index, c_index) {
    return matrix[r_index][c_index];
  }

  function cell_value_by_index(r_index, c_index) {
    return cell_value(cell(r_index, c_index));
  }

  function cell_by_id(r_id, c_id) {
    return matrix[row_indexes[r_id]][col_indexes[c_id]];
  }

  function cell_value_by_id(r_id, c_id) {
    return cell_value(cell_by_id(r_id, c_id));
  }

  function is_row_active(index) {
    return row_index_active[index];
  }
  function is_row_id_active(id) {
    return row_index_active[row_indexes[id]];
  }
  function is_col_active(index) {
    return col_index_active[index];
  }
  function is_col_id_active(id) {
    return col_index_active[col_indexes[id]];
  }

  /*
	 * Return Object
	 */
  const ret = {};
  ret.matrix_data = function(_) {
    if (arguments.length > 0) return (matrix = _), maker();
    else return matrix;
  };
  ret.row_ids = function(_) {
    if (arguments.length > 0) return (row_ids = _), maker();
    else return row_ids;
  };
  ret.col_ids = function(_) {
    if (arguments.length > 0) return (col_ids = _), maker();
    else return col_ids;
  };
  ret.col_indexes = function() {
    return col_indexes;
  };
  ret.rol_indexes = function() {
    return row_indexes;
  };
  ret.cell_value = function(_) {
    if (arguments.length > 0) {
      cell_value = functor(_);
      return ret;
    } else return cell_value;
  };
  ret.row_vector = row_vector;
  ret.col_vector = col_vector;
  ret.activate_row = activate_row;
  ret.activate_col = activate_col;
  ret.deactivate_row = deactivate_row;
  ret.deactivate_col = deactivate_col;
  ret.activate_row_by_id = activate_row_by_id;
  ret.activate_col_by_id = activate_col_by_id;
  ret.deactivate_col_by_id = deactivate_col_by_id;
  ret.deactivate_row_by_id = deactivate_row_by_id;
  ret.row_dist = row_dist;
  ret.col_dist = col_dist;
  ret.row_dist_by_id = row_dist_by_id;
  ret.col_dist_by_id = col_dist_by_id;
  ret.row_order = function() {
    return row_order;
  };
  ret.col_order = function() {
    return col_order;
  };
  ret.row_id_order = row_id_order;
  ret.col_id_order = col_id_order;
  ret.row_index = row_index;
  ret.col_index = col_index;
  ret.row_id = row_id;
  ret.col_id = col_id;
  ret.cell = cell;
  ret.cell_by_id = cell_by_id;
  ret.cell_value_by_index = cell_value_by_index;
  ret.cell_value_by_id = cell_value_by_id;
  ret.is_row_active = is_row_active;
  ret.is_col_active = is_col_active;
  ret.is_row_id_active = is_row_id_active;
  ret.is_col_id_active = is_col_id_active;
  ret.active_row_order = active_row_order;
  ret.active_col_order = active_col_order;
  ret.active_row_id_order = active_row_id_order;
  ret.active_col_id_order = active_col_id_order;
  ret.order_rows = order_rows;
  ret.order_cols = order_cols;
  ret.order_rows_by_id = order_rows_by_id;
  ret.order_cols_by_id = order_cols_by_id;
  ret.order_on_dist = function(_) {
    return arguments.length > 0 ? ((order_on_dist = _), ret) : order_on_dist;
  };
  return ret;
}
