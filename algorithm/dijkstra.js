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
 ** (result là object chứa thông tin đường đi đến các đỉnh,
 **    mỗi đỉnh là 1 mảng chứa thông tin đường đi từ điểm bắt đầu đến đỉnh đó theo từng bước,
 **    dist: khoảng cách từ điểm bắt đầu đến đỉnh đó,
 **    prev: đỉnh trước nó
 ** way là object chứa đường đi ngắn nhất từ đỉnh bắt đầu đến 1 đỉnh)
 **
 ** result: {
 ** A: [{dist: 0, prev: "A"}]
 ** B: [{dist: Infinity, prev: ""}, {dist: 6, prev: "A"}, {dist: 3, prev: "D"}, {dist: 3, prev: "D"}]
 ** C: [{dist: Infinity, prev: ""}, {dist: Infinity, prev: ""}, {dist: Infinity, prev: ""}, {dist: 7, prev: "E"}, {dist: 7, prev: "E"}]
 ** D: [{dist: Infinity, prev: ""}, {dist: 1, prev: "A"}]
 ** E: [{dist: Infinity, prev: ""}, {dist: Infinity, prev: ""}, {dist: 2, prev: "D"}]
 ** }
 ** way: {
 ** A: 'A'
 ** B: 'ADB'
 ** C: 'ADEC'
 ** D: 'AD'
 ** E: 'ADE'
 ** }
 */
function dijstra(dataset, start_node) {
  let _nodes = dataset.nodes // mảng chứa các đỉnh
  let _edges = dataset.edges; // mảng chứa các cạnh nối giữa 2 đỉnh
  let current_node = start_node; // gán đỉnh hiện tại cho đỉnh bắt đầu
  let new_edges = [..._edges.map(edge => swap_source_target(edge)), ..._edges]; // chuyển đồ thị vô hướng về đồ thị có 2 hướng => đảo ngược đỉnh bắt đầu - kết thúc của các cạnh nối
  let unvisited_node = [..._nodes.filter(node => node !== current_node)]; // mảng chứa các đỉnh chưa được kiểm tra sẽ chứa tất cả các điểm trừ đỉnh bắt đầu
  let result = {}; //object lưu kết quả từng bước duyệt
  let way = {}; //đường đi ngắn nhất từ đỉnh bắt đầu đến 1 đỉnh
  unvisited_node.forEach(node => result[node] = [{
    dist: Infinity,
    prev: ''
  }]); // gán khoảng cách ban đầu từ đỉnh bắt đầu đến các đỉnh là vô cùng, đỉnh trước nó bằng rỗng
  result[current_node] = [{
    dist: 0,
    prev: current_node
  }]; // khoảng cách ban đầu từ đỉnh bắt đầu đến đỉnh bắt đầu là 0, đỉnh trước nó chính bằng nó
  way[current_node] = current_node; //

  while (unvisited_node.length > 0) { // khi các đỉnh chưa được duyệt hết
    let edges_current_node_is_source = new_edges.filter(edge => edge.source === current_node); // lấy tất cả các cạnh nối mà đỉnh bắt đầu là đỉnh hiện tại
    for (let node of unvisited_node) { // duyệt tất cả các đỉnh chưa được duyệt
      let shortest_dist = get_shortest_dist_obj_in_result(result, node); // lấy thông tin đường đi ngắn nhất hiện tại của đỉnh đang kiểm tra
      let current_dist = get_shortest_dist_obj_in_result(result, current_node).dist; // lấy khoảng cách ngắn nhất của đỉnh hiện tại
      let find_node_in_target = edges_current_node_is_source.find(edge => edge.target === node); // tìm cạnh nối mà đỉnh đến là đỉnh đang kiểm tra
      if (find_node_in_target && shortest_dist.dist > current_dist + find_node_in_target.value) {
        // nếu tồn tại cạnh nối giữa đỉnh hiện tại và đỉnh đang kiểm tra
        // và kc ngắn nhất của đỉnh đang kiểm tra > kc ngắn nhất của đỉnh hiện tại + kc giữa 2 đỉnh
        // => gán kc ngắn nhất của đỉnh đang duyệt là kc ngắn nhất của đỉnh hiện tại + kc giữa 2 đỉnh
        // => gán đỉnh trước nó là đỉnh hiện tại
        shortest_dist = {
          dist: current_dist + find_node_in_target.value,
          prev: current_node
        };
      }
      // nếu điều kiện trên không đúng thì giữ nguyên khoảng cách và đỉnh trước nó như cũ
      result[node].push(shortest_dist); // thêm vào mảnh kết quả
    }

    let node_shortest = check_shortest_dist(unvisited_node, result); // tìm đỉnh trong mảng chưa duyệt đỉnh có khoảng cách ngắn nhất sau lần duyệt (đỉnh *)
    if (node_shortest === '') break; // trường hợp có node không nối với cạnh nào thì dừng
    unvisited_node.splice(unvisited_node.indexOf(node_shortest), 1); // xóa đỉnh (*) ra khỏi danh sách chưa duyệt
    way[node_shortest] = way[get_shortest_dist_obj_in_result(result, node_shortest).prev] + node_shortest; // đường đi ngắn nhất từ đỉnh bắt đầu đến đỉnh (*) = đường đi ngắn nhất của đỉnh trước nó + chính nó
    current_node = node_shortest; // gán đỉnh hiện tại là đỉnh (*)
  }

  show_table_dijkstra(result, way, _nodes, start_node); // show kết quả ra table
}

function get_shortest_dist_obj_in_result(result, node) { // hàm tìm đỉnh trong mảng chưa duyệt đỉnh có khoảng cách ngắn nhất = mảng cuối của đỉnh trong đó trong obj kết quả
  let arr = result[node];
  return arr[arr.length - 1];
}

function swap_source_target(edge) { // hàm hoán đổi đỉnh bắt đầu đỉnh kết thúc
  let temp = edge.source;
  return {
    source: edge.target,
    target: temp,
    value: edge.value
  };
}

function get_max_length_result(result) { //hàm tìm chiều dài lớn nhất của đỉnh bảng kết quả ( dùng cho show kết quả )
  let max_lenght = 0;
  for (let node in result) {
    if (result[node].length > max_lenght) {
      max_lenght = result[node].length;
    }
  }
  return max_lenght;
}

function sortObject(o) { // hàm sắp xếp lại obj đúng thứ tự A - Z
  return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

function check_shortest_dist(unvisited_node, result) { // hàm tìm đỉnh có khoảng cách hiện tại ngắn nhất
  let shortest = Infinity;
  let node_shortest = '';
  for (let node in result) {
    if (unvisited_node.includes(node)) {
      shortest_dist = get_shortest_dist_obj_in_result(result, node);
      if (shortest_dist.dist < shortest) {
        shortest = shortest_dist.dist;
        node_shortest = node;
      }
    }
  }
  return node_shortest;
}

function show_table_dijkstra(result, way, _nodes, start_node) { // hàm show kết quả ra table
  result = sortObject(result);
  let table = $('#dijkstra-table');
  table.find('thead').empty();
  table.find('tbody').empty();
  table.find('tfoot').empty();
  let thead = `<tr>`;
  let tfoot = `<tr>`;
  let tbody = ``;
  let percent_width = 100 / _nodes.length;
  for (let node of _nodes) {
    thead += node === start_node ? `<th scope="col" style="width: ${percent_width}%" class="current">${node}</th>` :
      `<th scope="col" style="width: ${percent_width}%">${node}</th>`;
    tfoot += `<td><button class="btn btn-sm btn-info btn-way">${way[node]}</button></td>`;
  }
  thead += `</tr>`;
  tfoot += `</tr>`;
  let max_lenght = get_max_length_result(result);
  for (let i = 0; i < max_lenght; i++) {
    tbody += `<tr>`;
    for (let node in result) {
      let td = result[node][i];
      if (td) {
        let dist = td.dist === Infinity ? '&infin;' : td.dist;
        let prev = td.prev === '' ? '-' : td.prev;
        let tick = (result[node].length === i + 1 && way[node]) ? `<span> <i class="fa fa-check"></i></span>` : ``;
        tbody += `<td>[ ${dist}, ${prev} ] ${tick}</td>`;
      } else {
        tbody += `<td></td>`;
      }
    }
    tbody += `</tr>`;
  }
  table.find('thead').append(thead);
  table.find('tbody').append(tbody);
  table.find('tfoot').append(tfoot);
}
