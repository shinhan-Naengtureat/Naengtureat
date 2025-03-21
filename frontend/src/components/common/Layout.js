import TopNav from "components/common/TopNav";
import BottomNav from "components/common/BottomNav";
import "styles/common/Layout.css";
import NotificationList from "components/notification/NotificationList";
import useFirebasePush from "hooks/useFirebasePush";
import {useCallback, useState} from "react"; // 스타일 적용

const Layout = ({children}) => {
  const [notifications, setNotifications] = useState([]);

  const handleReceive = useCallback((notification) => {
    setNotifications((prev) => [...prev, notification]);
  }, []);

  useFirebasePush(3, handleReceive);

  return (
    <div className="home-container">
      <TopNav />
      <NotificationList notifications={notifications} />
      <div className="content">{children}</div>
      <BottomNav />
    </div>
  );
};

export default Layout;