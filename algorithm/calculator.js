$(document).ready(function() {
  toastr.options = {
      closeButton: true,
      progressBar: true,
      showMethod: 'slideDown',
      timeOut: 4000
  };
  //BỘ CHUYỂN
  $('#calculator-btn').click(function() {
    $('#calModal').modal('show');
  })

  $('#btnTextToBinary').click(function() {
    let text = $('#txtTextIn').val();
    let binary = get_binary_by_text(text);
    $('#txtBinaryOut1').val(binary);
  });

  $('#btnNumberToBinary').click(function() {
    let number = $('#txtNumberIn').val();
    number = parseInt(number);
    let binary = get_binary_by_number(number);
    $('#txtBinaryOut2').val(binary.trim());
  });

  $('#btnIPToBinary').click(function() {
    let ip = $('#txtIPIn').val();
    let binary = get_binary_by_ip(ip);
    $('#txtBinaryOut3').val(binary);
  });

  $('#btnBinaryToText').click(function() {
    let binary = $('#txtBinaryIn1').val();
    binary = binary.replace(/\s/g, '');
    let text = '';
    if (binary.length % 8 === 0) {
      while (binary) {
        text += get_char_by_binary(binary.slice(0, 8));
        binary = binary.slice(8);
      }
      $('#txtTextOut').val(text);
    } else {
      toastr.error('Định dạng Binary không hợp lệ');
    }
  });

  $('#btnBinaryToNumber').click(function() {
    let binary = $('#txtBinaryIn2').val();
    binary = binary.replace(/\s/g, '');
    let number = get_number_by_binary(binary);
    $('#txtNumberOut').val(number);
  });

  $('#btnBinaryToIP').click(function() {
    let binary = $('#txtBinaryIn3').val();
    let ip = get_ip_by_binary(binary);
    $('#txtIPOut').val(ip);
  });

  $('#btnSumBinary').click(function() {
    let binary1 = $('#txtBinaryIn4').val().replace(/\s|\./g, '');
    let binary2 = $('#txtBinaryIn5').val().replace(/\s|\./g, '');
    let sum = sum_tow_binary(binary1, binary2);
    $('#txtSumBinary').val(sum);
  });
});

function get_binary_by_text(text){
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    binary += get_binary_by_char(text.charAt(i)) + ' ';
  }
  return binary.trim();
}

function get_binary_by_ip(ip){
  let binary = '';
  let ips = ip.split('.');
  for (ip of ips) {
    binary += get_binary_by_number(parseInt(ip)) + '.';
  }
  return binary.slice(0, binary.length - 1)
}

function get_ip_by_binary(binary){
  binary = binary.replace(/\s|\./g, '');
  if (binary.length % 8 === 0) {
    let ip = '';
    while (binary) {
      ip += get_number_by_binary(binary.slice(0, 8)) + '.';
      binary = binary.slice(8);
    }
    return ip.slice(0, ip.length - 1)
  } else {
    toastr.error('Định dạng Binary không hợp lệ');
    return '';
  }
}

function get_binary_by_char(_char) {
  let ascii_code = _char.charCodeAt(0);
  return get_binary_by_number(ascii_code);
}

function get_binary_by_number(number) {
  // return ("0".repeat(8) + number.toString(2)).slice(-8);
  let binary = number.toString(2);
  return binary.length >= 8 ? binary : '0'.repeat(8-binary.length)+binary;
}

function get_char_by_binary(binary) {
  return binary.replace(/[01]{8}/g, function(v) {
    return String.fromCharCode(parseInt(v, 2))
  });
}

function get_number_by_binary(binary) {
  return parseInt(binary, 2);
}

function sum_tow_binary(binary1, binary2) {
  binary1 = binary1.replace(/\s|\./g, '');
  binary2 = binary2.replace(/\s|\./g, '');
  let sum = (parseInt(binary1, 2) + parseInt(binary2, 2)).toString(2);
  return sum.length >= binary1.length ? sum : ('0'.repeat(binary1.length) + sum).slice(-binary1.length);
}

function sub_tow_binary(binary1, binary2) {
  binary1 = binary1.replace(/\s|\./g, '');
  binary2 = binary2.replace(/\s|\./g, '');
  if(binary1 === '0'.repeat(32)) {return '1'.repeat(32)}
  return ('0'.repeat(binary1.length) + (parseInt(binary1, 2) - parseInt(binary2, 2)).toString(2)).slice(-binary1.length);
}

function xor(binary1, binary2){
  return (parseInt(binary1, 2) ^ parseInt(binary2, 2)).toString(2);
}

function and(binary1, binary2) {
  binary1 = binary1.replace(/\s|\./g, '');
  binary2 = binary2.replace(/\s|\./g, '');
  let binary = '';
  for(let i = 0; i < binary1.length; i++){
    binary+= (binary1.charAt(i) == 1 && binary2.charAt(i) == 1)  ? '1' : '0';
  }
  return binary;
}

function get_decimal_by_binary(binary){
  binary = binary.replace(/\s|\./g, '');
  return parseInt(binary, 2);
}

function get_hex_by_binary(binary){
  binary = binary.replace(/\s|\./g, '');
  return parseInt(binary, 2).toString(16);
}
