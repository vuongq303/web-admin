import React from 'react'

export default function trang_chu() {
  return (
    <div>
      <button className='btn btn-primary' onClick={() => {
        window.location.href = '/dang-nhap';
      }}>Đăng nhập</button>
    </div>
  )
}
