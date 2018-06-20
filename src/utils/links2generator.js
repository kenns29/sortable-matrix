import matrix from '../matrix';
import functor from './functor';

export default function links2generator(links) {
  let [source_accessor, target_accessor] = ['source', 'target'].map(e => d =>
    d[e]
  );
  const value_accessor = d => d.value;
  let null_value = 0;

  const generate = function() {
    const matrix_data = [],
      row_ids = [],
      col_ids = [],
      row_indexes = [],
      col_indexes = [];

    links.forEach(link => {
      const [source, target] = [source_accessor(link), target_accessor(link)];
      const value = value_accessor(link);
      if (row_indexes[source] === undefined) {
        row_indexes[source] = row_ids.length;
        row_ids.push(source);
      }
      if (col_indexes[target] === undefined) {
        col_indexes[target] = col_ids.length;
        col_ids.push(target);
      }
      if (!matrix_data[row_indexes[source_key]])
        matrix_data[row_indexes[source_key]] = [];
      matrix_data[row_indexes[source_key]][col_indexes[target_key]] = value;
    });
    const [r, l] = [row_ids, col_ids].map(d => d.length);
    for (let i = 0; i < r; i++)
      for (let j = 0; j < l; j++)
        if (matrix_data[i][j] === undefined) matrix_data[i][j] = null_value;
    return matrix()
      .row_ids(row_ids)
      .col_ids(col_ids)
      .matrix_data(matrix_data);
  };
  generate.source = function(_) {
    return arguments.length
      ? ((source_accessor = functor(_)), generate)
      : source_accessor;
  };
  generate.target = function(_) {
    return arguments.length
      ? ((target_accessor = functor(_)), generate)
      : target_accessor;
  };
  generate.key = function(_) {
    return arguments.length ? ((key = functor(_)), generate) : key;
  };
  generate.value = function(_) {
    return arguments.length ? ((value = functor(_)), generate) : value;
  };
  generate.null = function(_) {
    return arguments.length ? ((null_value = _), generate) : null_value;
  };
  return generate;
}
