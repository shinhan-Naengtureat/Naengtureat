import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import "styles/notificationList/notificationList.css";

const NotificationList = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const newNotification = notifications[notifications.length - 1];
      setVisibleNotifications((prev) => [...prev, newNotification]);

      const timer = setTimeout(() => {
        setVisibleNotifications((prev) => prev.slice(1));
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  useEffect(() => {
    console.log("visibleNotifications 업데이트됨: ", visibleNotifications);
  }, [visibleNotifications]);

  useEffect(() => {
    console.log("수신된 notifications: ", notifications);
  }, [notifications]);

  return (
    <div className="notification-container">
      <AnimatePresence>
        {visibleNotifications.map((noti, index) => (
          <motion.div
            key={index}
            initial={{ y: "-20%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-20%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="notification-item"
          >
            <div className="notification-content">
              <button onClick={() => setVisibleNotifications([])}>✖</button>
              <strong>{noti.title}</strong>
              <p>{noti.body}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationList;