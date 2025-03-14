import { FaBell, FaCartArrowDown, FaSearch, FaUser } from "react-icons/fa";

const BASE_URL = process.env.PUBLIC_URL;

const RouteConfig = {
  paths: {
    home: `${BASE_URL}/`,
    login: `${BASE_URL}/login`,
    register: `${BASE_URL}/register`,
    myPage: `${BASE_URL}/mypage`,
    recipeList: `${BASE_URL}/recipes`,
    inventoryList: `${BASE_URL}/inventory`,
    mealPlanListDaily: `${BASE_URL}/mealplan`,
    storeList: `${BASE_URL}/store`,
    notFound: '*',
  },

  navConfig: {
    [`${BASE_URL}/`]: {
      title: "홈",
      links: [
        { to: `${BASE_URL}/notifications`, icon: <FaBell/>, alt: "알림" },
        { to: `${BASE_URL}/mypage`, icon: <FaUser/>, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/inventory`]: {
      title: "재료",
      links: [
        { to: `${BASE_URL}/notifications`, icon: <FaSearch/>, alt: "검색" },
        { to: `${BASE_URL}/mypage`, icon: <FaUser/>, alt: "마이페이지" },
      ],
    },
    [ `${BASE_URL}/recipes` ]: {
      title: "테마별 레시피",
      links: [
        { to: `${BASE_URL}/bookmarks`, icon: "bookmark-icon.png", alt: "북마크" },
        { to: `${BASE_URL}/mypage`, icon: "user-icon.png", alt: "마이페이지" },
      ],
    },
    mealPlanListDaily: {
      title: "식단 관리",
      links: [
        { to: `${BASE_URL}/calendar`, icon: "calendar-icon.png", alt: "캘린더" },
        { to: `${BASE_URL}/mypage`, icon: "user-icon.png", alt: "마이페이지" },
      ],
    },
    inventory: {
      title: "재료 관리",
      links: [
        { to: `${BASE_URL}/bookmarks`, icon: "bookmark-icon.png", alt: "북마크" },
        { to: `${BASE_URL}/mypage`, icon: "user-icon.png", alt: "마이페이지" },
      ],
    },
    [ `${BASE_URL}/store` ]: {
      title: "스토어",
      links: [
        { to: `${BASE_URL}/cart`, icon: <FaCartArrowDown/>, alt: "장바구니" },
        { to: `${BASE_URL}/mypage`, icon: <FaUser/>, alt: "마이페이지" },
      ],
    },
  },

  notFound: "*",
};

export default RouteConfig;