import axiosInstance from 'api/axios';
import { PROFILE_IMAGE_PATH } from 'config/pathConfig';
import { px } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaChevronRight, FaHeart, FaHistory, FaShoppingCart, FaSignOutAlt, FaUserEdit, FaUtensils } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function MyPage({handleClose}) {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    handleClose(); // Offcanvas 닫기
    navigate(path);
  };

  const [memberInfo, setMemberInfo] = useState({
    loginId: "",
    name: "",
    balance: "",
    point: 0,
    userImageUrl: `${PROFILE_IMAGE_PATH}/`
  });

  // 고객 정보, 페이정보 받아오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
        try {
            // `/pay`와 `/member/detail`을 동시에 요청
            const [payResponse, memberResponse] = await Promise.all([
                axiosInstance.get("/pay"),
                axiosInstance.get("/member/detail")
            ]);

            // 응답 데이터를 합쳐서 상태 업데이트
            setMemberInfo({
              loginId: memberResponse.data.loginId,
              name: memberResponse.data.name,
              balance: payResponse.data.balance || 0,
              point: memberResponse.data.point,
              userImageUrl: `${PROFILE_IMAGE_PATH}/`+memberResponse.data.image
            });
        } catch (error) {
            console.error("회원 정보 불러오기 실패:", error);
        }
    };

    fetchMemberInfo();
  }, []);

  return (
    <div style={containerStyle}>
      {/* 헤더 */}
      <div style={headerStyle}>
        <img src={memberInfo.userImageUrl} alt="User" style={profileImageStyle} />
        <div style={userInfoStyle}>
          <p style={nameHighlightStyle}>
            {memberInfo.name}
            <span style={highlightUnderline}></span>
          </p>
        </div>
      </div>

      {/* 냉털잇페이 정보 카드 */}
      <div style={payCardStyle}>
        <div style={cardRowStyle}>
          <div style={cardLabelStyle}>냉털잇페이 잔액</div>
          <div style={cardValueStyle}>{memberInfo.balance.toLocaleString()}원</div>
        </div>

        <div style={cardRowStyle}>
          <div style={cardLabelStyle}>포인트</div>
          <div style={cardValueStyle}>{memberInfo.point.toLocaleString()}P</div>
        </div>

        <div style={paymentActionsStyle}>
        <button 
            style={buttonStyle} 
            onClick={() => handleNavigate('/instant-charge')} 
          >
            페이 충전
          </button>
        </div>
      </div>

      {/* 메뉴 항목 */}
      <ul style={menuListStyle}>
        {menuItems.map((item, index) => (
          <li style={menuItemStyle} key={index}>
            <Link to={item.to} style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleClose}>
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
  padding: '20px',
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
  gap: '8px',
  justifyContent: 'right'
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

const nameHighlightStyle = {
  fontSize: '18px',            // 기존보다 더 크게
  fontWeight: 'bold',          // 진하게
  position: 'relative',        // 밑줄 배경용
  display: 'inline-block',     // 줄 높이만큼 크기 적용
  paddingBottom: '4px',
  marginTop: "13px",
  fontFamily:"var(--font-nanum)"
};

const highlightUnderline = {
  content: "''",
  position: 'absolute',
  bottom: "5px",
  left: 0,
  width: '100%',
  height: '10px',                // 밑줄 높이
  backgroundColor: '#FFE0B2',   // 연한 민트색 배경 (수정 가능)
  zIndex: -1,
  borderRadius: '4px'
};
