// 检查本地存储的登录状态
console.log('=== 检查本地存储登录状态 ===');
console.log('token:', localStorage.getItem('token'));
console.log('gamepartner_user:', localStorage.getItem('gamepartner_user'));
console.log('refresh_token:', localStorage.getItem('refresh_token'));
console.log('token_expiry:', localStorage.getItem('token_expiry'));

// 检查 token 是否过期
const tokenExpiry = localStorage.getItem('token_expiry');
if (tokenExpiry) {
  const expiryTime = parseInt(tokenExpiry);
  const now = Date.now();
  console.log('token 过期时间:', new Date(expiryTime).toLocaleString());
  console.log('当前时间:', new Date(now).toLocaleString());
  console.log('token 是否过期:', now > expiryTime);
}

// 模拟访问 profile 页面的 API 调用
console.log('\n=== 模拟访问 profile 页面 API ===');
fetch('http://localhost:5178/api/user/info', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => {
  console.log('响应状态:', response.status);
  return response.json();
})
.then(data => {
  console.log('响应数据:', data);
})
.catch(error => {
  console.error('API 调用失败:', error);
});