import TopNav from "components/common/TopNav";
import BottomNav from "components/common/BottomNav";
import "styles/common/Layout.css"; // 스타일 적용

const Layout = ({children}) => {
  return (
    <div className="home-container">
      <TopNav/>
      <div className="content">{children}</div>
      {/* 페이지별 컨텐츠 렌더링 */}
      <BottomNav/>
    </div>
  );
};

export default Layout;