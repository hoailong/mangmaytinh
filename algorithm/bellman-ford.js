  /*===INPUT
   ** dataset = {
   **  nodes : ['A', 'B', 'C', 'D', 'E', 'F'],
   **  edges : [
   **         {source: 'A', target: 'B', value: 2},
   **         {source: 'A', target: 'C', value: 1},
   **         {source: 'B', target: 'D', value: 4},
   **         {source: 'B', target: 'E', value: 5},
   **         {source: 'C', target: 'E', value: 2},
   **         {source: 'D', target: 'F', value: 2},
   **         {source: 'D', target: 'E', value: 3}]
   ** }
   **===OUTPUT (theo cấu trúc để dễ hiển thị ra bảng kết quả)
   ** (result là object chứa thông tin các đường đến các đỉnh từ các đỉnh có nối với đỉnh bắt đầu,
   **    dist: khoảng cách từ điểm bắt đầu đến đỉnh đó,
   **    way: đường đi ngắn nhất đến đỉnh đó,
   **    ismin: nếu đấy là đờng đi ngắn nhất trong tất cả các đường
   **
   ** result: {
   ** B :{B : {dist: 6, way: "AB"}
   **     C : {dist: 11, way: "ABC"}
   **     D : {dist: 8, way: "ABD"}
   **     E : {dist: 8, way: "ABE"}},
   ** D :{B : {dist: 3, way: "ADB", ismin: true}
   **     C : {dist: 7, way: "ADEC", ismin: true}
   **     D : {dist: 1, way: "AD", ismin: true}
   **     E : {dist: 2, way: "ADE", ismin: true}},
   ** }
   */
  function bellman_ford(dataset, start_node) {
    let _nodes = dataset.nodes // mảng chứa các đỉnh
    let _edges = dataset.edges; // mảng chứa các cạnh nối giữa 2 đỉnh
    let current_node = start_node; // gán đỉnh hiện tại cho đỉnh bắt đầu

    let result = {};
    // duyệt khởi tạo kết quả ban đầu
    for (let node of _nodes) {
      if (get_distance_edge(_edges, start_node, node) != Infinity) { // nếu đỉnh này có nối với đỉnh bắt đầu thì khởi tạo object đỉnh đó trong obj kết quả
        result[node] = {};
        for (let _node of _nodes) { //khởi tạo object tất cả các đỉnh với kc là vô cùng và đường đi là rỗng
          result[node][_node] = {
            dist: Infinity,
            way: ''
          };
        }
        result[node][node] = { // kc đỉnh tại đỉnh đó = kc từ đỉnh bắt đầu đến đỉnh đó, đường đi là đỉnh bắt đầu+ đỉnh đó
          dist: get_distance_edge(_edges, node, start_node),
          way: start_node + node
        };
        result[node][start_node] = { // kc tại đỉnh bắt đầu = 2 lần khoảng cách đỉnh bắt đầu đến đỉnh đó, đường đi là đường đi là đỉnh bắt đầu+ đỉnh đó+ đỉnh bắt đầu
          dist: 2 * get_distance_edge(_edges, node, start_node),
          way: start_node + node + start_node
        };
      }
    }

    // tìm đường đi thông qua mỗi đỉnh kề đỉnh bắt đầu
    let have_change = true;
    while (have_change) { // lặp đến khi không có sự thay đổi nào nữa
      have_change = false;
      for (let i in result) { // duyệt tất cả đỉnh nối với đỉnh bắt đầu (kí hiệu đỉnh *)
        for (let j of _nodes) {
          for (let k of _nodes) {
            if (j != k) {
              // tính kc từ đỉnh này tới đỉnh khác thông qua đỉnh bắt đầu là đỉnh (*)
              // nếu kc ngắn nhất hiện tại của đỉnh này > kc ngắn nhất của đỉnh kia + kc đỉnh này đến đỉnh kia
              // thì gán kc ngắn nhất của đỉnh này =  kc ngắn nhất của đỉnh kia + kc đỉnh này đến đỉnh kia
              // và đường đi ngắn nhất của đỉnh này = đường đi ngắn nhất của đỉnh kia + đỉnh này
              // đánh dấu có sự thay đôi
              let dist = get_distance_edge(_edges, j, k);
              let node_k = result[i][k];
              let node_j = result[i][j];
              if (node_k.dist > node_j.dist + dist) {
                node_k.dist = node_j.dist + dist;
                node_k.way = node_j.way + k;
                have_change = true;
              }
            }
          }
        }
      }
    }

    // sau khi đã tìm được đường đi ngắn nhất đến các đỉnh thông qua từng đỉnh nối cạnh bắt đầu
    // đi tìm đường đi ngắn nhất trong các đường ngắn nhất trên
    for (let node of _nodes) {
      let max_dist = Infinity;
      for (let e in result) {
        if (result[e][node].dist < max_dist) {
          max_dist = result[e][node].dist;
        }
      }

      for (let e in result) {
        if (result[e][node].dist === max_dist) { // đánh dấu dấy là đường đi ngắn nhất cần tìm
          result[e][node].ismin = true;
        }
      }
    }

    // xóa object đỉnh bắt đầu ( cho dễ show kết quả )
    for (let node in result) {
      delete result[node][start_node];
    }

    show_table_bellman_ford(sortObject(result), _nodes, start_node);
  }

  function get_distance_edge(_edges, node_one, node_two) { // hàm tìm kc giữa 2 đỉnh
    let edge = _edges.find(edge => edge.source === node_one && edge.target === node_two ||
      edge.source === node_two && edge.target === node_one);
    if (edge) return edge.value;
    return Infinity;
  }

  function sortObject(o) { // hàm sắp xếp obj theo A-Z
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
  }

  function show_table_bellman_ford(result, _nodes, start_node) { // hàm show kết quả ra table
    result = sortObject(result);
    let table = $('#bellman-ford-table');
    table.find('thead').empty();
    table.find('tbody').empty();
    let percent_width = 90 / (Object.keys(result).length + 1);
    let thead = `<tr>
                <th scope="col" style="width: 10%" class="current">${start_node}</th>`;
    let tbody = ``;
    for (let node in result) {
      thead += node !== start_node ? `<td scope="col" style="width: ${percent_width}%">${node}</td>` : '';
    }
    thead += `</tr>`;
    for (let node of _nodes) {
      if (node !== start_node) {
        tbody += `<tr>
                <th>${node}</th>`;
        for (let e in result) {
          let td = result[e][node];
          let ismin = (td.ismin) ? ` <br/><button class="btn btn-sm btn-info btn-way">${td.way}</button>` : ``;
          tbody += `<td>${td.dist}${ismin}</td>`;
        }
        tbody += `</tr>`;
      }
    }
    table.find('thead').append(thead);
    table.find('tbody').append(tbody);
  }
