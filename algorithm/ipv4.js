function ipv4(ip, prefix){
  let binary_ip = get_binary_by_ip(ip); // hệ nhị phân của ip
  let default_subnet = get_ipclass(prefix); // tìm class của chuỗi ip chia => lấy được số bit network id mặc định, octet bị mượn bit
  let networks = get_list_networks(ip, prefix, default_subnet) // lấy danh sách ip sau khi chia
  let subnet_mask = get_subnetmask(prefix);
  let binary_subnetmask = get_binary_by_ip(subnet_mask);
  let network_ip = get_ip_by_binary(and(binary_subnetmask, binary_ip)); // tìm subnet của ip
  let network = networks.find(nw => nw.network === network_ip); // lấy các thông tin Usable Host IP Range, Broadcast Address của ip
  let wildcard = get_wildcard(binary_subnetmask)
  let integer_id = get_decimal_by_binary(binary_ip);
  let hex_id = '0x' + get_hex_by_binary(binary_ip);
  let bit_host = 32 - prefix; // số bit phần host id = 32 - số bit network id
  let total_host = Math.pow(2, bit_host); // tổng số host của mỗi subnet = 2 ^ số bit host id
  let usable_host = total_host - 2; // số host có thể dùng của mỗi subnet
  let ip_type = get_typeIP(ip);
  let ip_info = { // lưu vào object
    ip_address: ip,
    binary_ip: binary_ip,
    network: network,
    total_host: total_host,
    usable_host: usable_host,
    subnet_mask: subnet_mask,
    wildcard: wildcard,
    binary_subnetmask: binary_subnetmask,
    integer_id: integer_id,
    hex_id: hex_id,
    ip_type: ip_type,
    ip_class: default_subnet.class,
    cidr: '/'+prefix,
    short: ip+' /'+prefix,
    networks: networks
  }
  show_result_table(ip_info, prefix);
}

function get_list_networks(ip, prefix, default_subnet){ // hàm chia ip
  let ip_address = get_binary_by_ip(ip.split('.').map((e, i) => i < default_subnet.octet-1 ? parseInt(e) : 0).join('.')); // lấy subnet đầu tiên của chuỗi ip được chia, chuyển về nhị phân
  let jump = get_binary_by_number(Math.pow(2, 32-prefix)); // bước nhảy 2 subnet = 2 ^ (32 - prefix)
  let networks = []; // mảng subnet và các thông tin ip host đầu, host cuối, broadcast
  let networks_count = Math.pow(2, prefix-default_subnet.prefix) // tổng số subnet = 2 ^ (8 - số bit mượn) = 2 ^ (32 - số bit net id mặc định của ip)
  while (networks.length < networks_count){ // duyệt cho đến khi tìm đủ subnet
    let next_network = sum_tow_binary(ip_address, jump); // tìm subnet tiếp theo = subnet hiện tại + số bước nhảy, sub net đầu tiên đã được tính phía trên
    let broadcast = sub_tow_binary(next_network, '1'); // tìm broadcast = subnet tiếp theo - 1
    let hostmin = sum_tow_binary(ip_address, '1'); // tìm hostmin = subnet + 1
    let hostmax = sub_tow_binary(broadcast, '1'); // tìm hostmax = broadcast - 1
    networks.push({ // thêm các thông tin của subnet cừa chia được vào mảng
      network: get_ip_by_binary(ip_address),
      hostmin: get_ip_by_binary(hostmin),
      hostmax: get_ip_by_binary(hostmax),
      broadcast: get_ip_by_binary(broadcast)

    })
    ip_address = next_network;
  }
  return networks;
}

function get_ipclass(prefix){ // hàm tìm xem chuỗi ip thuộc class nào, prefix = số bit mặc định của net id, octet bị mượn bit
  const DEFAULT_SUBNET_MASK = [
    { class: '', prefix: 0, octet : 1 },
    { class: 'A', prefix: 8, octet : 2 },
    { class: 'B', prefix: 16, octet : 3 },
    { class: 'C', prefix: 24, octet : 4 },
    { class: 'D', prefix: 32, octet : null }];
  for(let i = 1; i < DEFAULT_SUBNET_MASK.length; i++){
    if(DEFAULT_SUBNET_MASK[i].prefix > prefix) {
      return DEFAULT_SUBNET_MASK[i-1];
    }
  }
}

function get_subnetmask(prefix){ // hàm lấy subnet mask của ip
  return get_ip_by_binary('1'.repeat(prefix) + '0'.repeat(32-prefix));
}

function get_wildcard(binary_subnetmask){ // hàm lấy wildcard của ip
  return get_ip_by_binary(sub_tow_binary('1'.repeat(32), binary_subnetmask)) // 255.255.255.255 - subnetmask
}

function get_typeIP(ip){ // hàm kiểm tra type ip là public hay private
  // ip là private nếu no thuộc các nhóm 10.*.*.*, 172.16.*.* -> 172.31.*.*, 192.168.*.*
  return (ip.split('.')[0] == 10 ||
          (ip.split('.')[0] == 172 && ip.split('.')[1] <= 31 && ip.split('.')[1] >= 16 ) ||
            (ip.split('.')[0] == 192 && ip.split('.')[1] == 168)) ? "Private" : "Public";
}

function show_result_table(ip_info, prefix){ // hàm show kết quả
  //show result table
  let infor_table = $('#inforIP-table');
  infor_table.find('.ip_address').text(ip_info.ip_address);
  infor_table.find('.network_address').text(ip_info.network.network);
  infor_table.find('.usable_range_host').text(ip_info.network.hostmin + ' - ' + ip_info.network.hostmax);
  infor_table.find('.broadcast_address').text(ip_info.network.broadcast);
  infor_table.find('.total_host').text(ip_info.total_host);
  infor_table.find('.usable_host').text(ip_info.usable_host);
  infor_table.find('.subnet_mask').text(ip_info.subnet_mask);
  infor_table.find('.wildcard').text(ip_info.wildcard);
  infor_table.find('.binary_subnetmask').text(ip_info.binary_subnetmask);
  infor_table.find('.ip_class').text(ip_info.ip_class);
  infor_table.find('.cidr').text(ip_info.cidr);
  infor_table.find('.ip_type').text(ip_info.ip_type);
  infor_table.find('.short').text(ip_info.short);
  infor_table.find('.binary_ip').text(ip_info.binary_ip);
  infor_table.find('.integer_id').text(ip_info.integer_id);
  infor_table.find('.hex_id').text(ip_info.hex_id);

  //show subnet table
  let subnet_table = $('#subnet-table tbody');
  subnet_table.empty();
  let tbody = ``;
  for(let network of ip_info.networks){
    let disable_devide = prefix == 31 ?  `disable` : ``;
    tbody+= `<tr>
              <td class="network">${network.network} [ <i class='fa fa-plus devide ${disable_devide}' title="Chia mạng con"></i> ]</td>
              <td class="host_range">${network.hostmin} - ${network.hostmax}</td>
              <td class="broadcast">${network.broadcast}</td>
            </tr>`;
  }
  subnet_table.append(tbody);
  $('#infor-subnet').html(`All ${ip_info.networks.length} of the Possible ${ip_info.cidr} Networks <i class="fa fa-chevron-down"></i>`);
  toastr.success(`All ${ip_info.networks.length} of the Possible ${ip_info.cidr}`);
}
