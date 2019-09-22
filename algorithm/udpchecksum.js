const LENGTH = 16;
function checksum(str_data){
  let data = [];
  let str = '';
  for (let i = 0; i < str_data.length; i++) { // chuyển từ về hệ nhị phân
    str+= get_binary_by_char(str_data.charAt(i));
  };

  while(str){ // tách từ ra các từ 16bit
    data.push(make_length_16(str.slice(0, LENGTH)));
    str = str.slice(LENGTH);
  }

  while(data.length > 1) { // lần lượt cộng từng từ 16bit
    let sum = sum_16bit(data[0], data[1]);
    data.splice(0, 2, sum);
  }

  let checksum = data[0].split('').map(e => e === '0' ? '1' : '0').join(''); // đảo ngược chuỗi bit tổng =>> checksum
  console.log(checksum);

  return checksum;
}

function sum_16bit(str1, str2){ // hàm tính tổng 2 từ 16 bit
  let sum = sum_tow_binary(str1, str2); // hàm sum_two_binary() trong file calculator.js
  while (sum.length > LENGTH) {
    sum = sum_tow_binary(sum.slice(1), '1');
  }
  return sum;
}

function make_length_16(str){ // hàm chuyển từ chưa đủ 16 bit về 16bit
  if(str.length < LENGTH){
      str = (str.toString(2) + '0'.repeat(16)).slice(0,16);
  }
  return str;
}
