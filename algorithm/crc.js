function crc(str_data, divisor){
  let data = '';
  for (let i = 0; i < str_data.length; i++) { // chuyển từ về hệ nhị phân
    data+= get_binary_by_char(str_data.charAt(i));
  };

  let div_length = divisor.length;  // độ dài chuỗi crc
  let _data = data + '0'.repeat(div_length-1); // cộng số kí tự crc vào sau chuỗi nhị phân dữ liệu gửi đi

  while(_data.length >= div_length){ // lặp cho đến khi độ dài chuỗi data >= độ dài chuỗi crc
    let _xor = xor(_data.slice(0, div_length), divisor);   // thực hiện chia
    _data = _xor + _data.slice(div_length);
  }

  _data = '0'.repeat(div_length-1 - _data.length) + _data; // nếu độ dài chuỗi data sau khi chia < độ dài chuôi crc thì cộng thêm '0' đầu chuỗi data, đây là chuỗi crc
  console.log(_data);

  return _data;
}
