//init const
const BITS = {
  P1: [1, 3, 5, 7, 9, 11],
  P2: [2, 3, 6, 7, 10, 11],
  P4: [4, 5, 6, 7, 12],
  P8: [8, 9, 10, 11, 12]
};
const HAMMING_LENGTH = 12;

function hamming_code(_char) { // tim mã hammming
  let binary = get_binary_by_char(_char); // lấy nhi phân của kí tự nhập
  let hamming_first = [];
  for (let i = 0; i < HAMMING_LENGTH; i++) { //  khởi tạo mã hamming, bỏ qua các vị trí parity(vị trí lũy thừa của 2)
    if (Math.log2(i + 1) % 1 === 0) {
      hamming_first.push('');
    } else {
      hamming_first.push(binary.charAt(0));
      binary = binary.substr(1);
    }
  }
  let hamming_completed = [...hamming_first];
  let bit_data = {}; // obj chứa kết quả
  for (let bit in BITS) { // các bit của dữ liệu được đặt vào vị trí tương thích của chúng, vị trí parity tạm thời để rỗng ''
    bit_data[bit] = [];
    for (let j = 0; j < HAMMING_LENGTH; j++) {
      if (BITS[bit].includes(j + 1)) {
        bit_data[bit].push(hamming_completed[j]);
      } else {
        bit_data[bit].push('');
      }
    }

    let parity_at = BITS[bit][0] - 1; // tìm vị trí parity
    let parity_bit = get_parity_bit(bit_data[bit]); // tính toán parity dùng quy luật bit chẵn lẻ số chẵn
    // bit_data[bit][parity] = '?';
    bit_data[bit][parity_at] = parity_bit;
    hamming_completed[parity_at] = parity_bit;
  }

  show_table_hamming_code(hamming_first, hamming_completed, bit_data);
}

function hamming_error(hamming) { // sua loi hamming code
  hamming = hamming.split('');
  let bit_data = {};
  let parity_bits = '';
  for (let bit in BITS) { // các bit của dữ liệu được đặt vào vị trí tương thích của chúng dựa theo hamming code đã cho
    bit_data[bit] = [];
    for (let j = 0; j < HAMMING_LENGTH; j++) {
      if (BITS[bit].includes(j + 1)) {
        bit_data[bit].push(hamming[j]);
      } else {
        bit_data[bit].push('');
      }
    }

    let parity_at = BITS[bit][0] - 1; // tìm vị trí parity
    let right_parity_bit = get_parity_bit(bit_data[bit], parity_at); // tính parity đúng
    let parity_bit = bit_data[bit][parity_at]; // parity theo hamming code đã cho

    if(parity_bit === right_parity_bit) {// kiểm tra pavity có đúng hay k, lưu vào kết quả
      parity_bits += '0'; // nếu đúng thì bit chẵn lẻ = 0
      bit_data[bit].push('Đúng');
      bit_data[bit].push('0');
    } else {
      parity_bits += '1'; // nếu sai thì bit chẵn lẻ = 1
      bit_data[bit].push('Sai');
      bit_data[bit].push('1');
    }
  }
  error_bit = parseInt(parity_bits.split('').reverse().join(''), 2); // đảo ngược chuỗi bit chẵn lẻ, tính ra thập phân => tìm vị trí bit sai trong hamming code
  let right_hamming = [...hamming];
  right_hamming[error_bit - 1] = right_hamming[error_bit - 1] === '1' ? '0' : '1'; // đổi giá trị của bit sai
  let binary = right_hamming.filter((v, i) => Math.log2(i + 1) % 1 !== 0).join(''); // bỏ phần mã hamming, lấy được mã nhị phân ban đầu
  let _char = get_char_by_binary(binary); // tìm kí tự đúng

  hamming.push(get_parity_bit(hamming));
  hamming.push('');

  show_table_hamming_error(hamming, bit_data, binary, _char, error_bit)
}


function get_parity_bit(arr, index = -1) { //ham tim parity
  return arr.filter((x, i) => x === '1' && i !== index).length % 2 === 0 ? '0' : '1';
}


//////////// ham show kết quả hamming code
function show_table_hamming_code(hamming_first, hamming_completed, bit_data) {
  let table = $('#hamming-code-table');
  let tbody = `<tr><th>Nhóm dữ liệu</th>`;
  let tfoot = `<tr><th>Mã Hamming</th>`;
  for (let td of hamming_first) {
    tbody += `<td>${td}</td>`;
  }
  tbody += `</tr>`;
  for (let bit in BITS) {
    tbody += `<tr><th>${bit}</th>`;
    bit_data[bit].forEach((td, index) => {
      let parity_bit = Math.log2(index + 1) % 1 === 0 ? `parity-bit` : ``;
      tbody += `<td class='${parity_bit}'>${td}</td>`;
    });
    tbody += `</tr>`;
  }
  for (let td of hamming_completed) {
    tfoot += `<td>${td}</td>`;
  }
  tfoot += `</tr>`;
  table.find('tbody').empty().append(tbody);
  table.find('tfoot').empty().append(tfoot);
  $('#txtHammingOutput').val(hamming_completed.join(''));
}



//////////// hàm show kết quả sửa lỗi hamming code
function show_table_hamming_error(hamming, bit_data, binary, _char, error_bit) {
  let table = $('#hamming-error-table');
  let tbody = `<tr><th>Nhóm dữ liệu nhận được</th>`;
  hamming.forEach((td, index) => {
    let error = index === error_bit-1 ? 'error' : '';
    tbody += `<td class="${error}">${td}</td>`;
  })
  tbody += `</tr>`;
  for (let bit in BITS) {
    tbody += `<tr><th>${bit}</th>`;
    bit_data[bit].forEach((td, index) => {
      let parity_bit = Math.log2(index + 1) % 1 === 0 ? `parity-bit` : ``;
      tbody += `<td class='${parity_bit}'>${td}</td>`;
    });
  }
  table.find('tbody').empty().append(tbody);
  $('#txtBinary').val(binary);
  $('#txtCharOutput').val(_char);
}
