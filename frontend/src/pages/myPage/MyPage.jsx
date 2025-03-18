import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bagicprofile from './bagicprofile.png';

import { 
  FaHeart, 
  FaUtensils, 
  FaHistory, 
  FaShoppingCart, 
  FaUserEdit, 
  FaSignOutAlt, 
  FaChevronRight 
} from 'react-icons/fa';

function MyPage() {
  const navigate = useNavigate();

  // 예시용 사용자 정보
  const userName = '홍길동';
  const userLoginId = 'hong123';
  const payBalance = '100,000원';
  const points = '1,000P';

  // 사용자 이미지 URL (같은 폴더 내의 이미지)
  const userImageUrl = bagicprofile;

  const containerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    fontFamily: 'sans-serif',
    padding: '13px'
  };

  // 헤더 영역 스타일
  const headerStyle = {
    display: 'flex',
    textAlign: 'center',
    marginBottom: '16px'
  };

  //MY 있던부분
  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold'
  };

  const profileImageStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginRight: '16px',
    objectFit: 'cover'
  };

  const userInfoStyle = {
    fontSize: '16px',
    color: '#555'
  };

  // 카드와 유사한 디자인 스타일
  const payCardStyle = {
    //background: 'linear-gradient(233deg, rgb(255 147 82), rgb(255 163 48))',
    background: 'linear-gradient(248deg, rgb(251 108 51), rgb(255 197 108))',
    color: '#fff',
    borderRadius: '12px',
    padding: '40px',
    marginBottom: '40px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  };

  const cardRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  };

  const cardLabelStyle = {
    fontSize: '16px'
  };

  const paymentActionsStyle = {
    display: 'flex',
    gap: '8px'
  };

  const cardValueStyle = {
    fontSize: '20px',
    fontWeight: 'bold'
  };

  const buttonStyle = {
    backgroundColor: '#fff',
    color: '#f76300',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  // 메뉴 항목 목록 (각 항목에 해당하는 아이콘 포함)
  const menuItems = [
    { title: "좋아요", icon: <FaHeart />, to: "/favorites" },
    { title: "나의 레시피", icon: <FaUtensils />, to: "/my-recipe-list" },
    { title: "주문 내역", icon: <FaHistory />, to: "/order-history" },
    { title: "장바구니", icon: <FaShoppingCart />, to: "/cart" },
    { title: "회원 정보 수정", icon: <FaUserEdit />, to: "/edit-profile" },
    { title: "로그아웃", icon: <FaSignOutAlt />, to: "/logout" },
  ];

  // 메뉴 항목 스타일: 폰트 크기를 줄이고 색상을 연하게 설정
  const menuListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const menuItemStyle = {
    fontSize: '14px',    // 폰트 사이즈를 줄임
    color: 'rgb(91 88 88)',       // 연한 컬러 적용
    padding: '12px 0',
    borderBottom: '1px solid #ddd'
  };

  return (
    <div style={containerStyle}>
      {/* 헤더 */}
      <div style={headerStyle}>
        <img src={userImageUrl} alt="User" style={profileImageStyle} />
        <div style={userInfoStyle}>
          <p style={userInfoStyle}>{userName}</p>
          <p style={userInfoStyle}>{userLoginId}</p>
        </div>
      </div>

      {/* 냉털잇페이 정보 카드 */}
      <div style={payCardStyle}>
        <div style={cardRowStyle}>
          <div style={cardLabelStyle}>냉털잇 페이 머니</div>
          <div style={cardValueStyle}>{payBalance}</div>
        </div>

        <div style={cardRowStyle}>
          <div style={cardLabelStyle}>포인트</div>
          <div style={cardValueStyle}>{points}</div>
        </div>

        <div style={paymentActionsStyle}>
        <button 
            style={buttonStyle} 
            onClick={() => navigate('/instant-charge')} 
          >
            즉시 충전
          </button>
          <button style={buttonStyle}>정기 결제</button>
        </div>
      </div>

      {/* 메뉴 항목 */}
      <ul style={menuListStyle}>
        {menuItems.map((item, index) => (
          <li style={menuItemStyle} key={index}>
            <Link to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                <FaChevronRight />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyPage;
