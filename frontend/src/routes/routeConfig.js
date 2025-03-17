import {FaBars, FaBell, FaEdit, FaSearch, FaShoppingCart} from "react-icons/fa";
import {FaTrashCan} from "react-icons/fa6";

const BASE_URL = process.env.PUBLIC_URL;

const RouteConfig = {
  paths: {
    home: `${BASE_URL}/`,
    login: `${BASE_URL}/login`,
    register: `${BASE_URL}/register`,
    myPage: `${BASE_URL}/mypage`,
    recipeList: `${BASE_URL}/recipes`,
    inventoryList: `${BASE_URL}/inventory`,
    inventoryDetail: `${BASE_URL}/inventory/:id`,
    inventoryCreate: `${BASE_URL}/inventory/new`,
    mealPlanListDaily: `${BASE_URL}/mealplan`,
    
    budgetInput: `${BASE_URL}/budget`,
    categorySelection: `${BASE_URL}/category`,
    themeSelection: `${BASE_URL}/theme`,
    preferredIngredients: `${BASE_URL}/preferred-ingredients`,
    excludedIngredients: `${BASE_URL}/exclude-ingredients`,
    notEnoughIngredientList: `${BASE_URL}/shopping-container`,
    ingredientStoreList: `${BASE_URL}/store-shopping-container`,
    frequencyMealPlan: `${BASE_URL}/frequency`,
    makeMealPlan: `${BASE_URL}/make-mealplan`,

    store: `${BASE_URL}/store`,
    storeReview: `${BASE_URL}/store/:storeId/review`,
    storeDetail: `${BASE_URL}/store/:storeId/detail`,
    myRecipeList: `${BASE_URL}/my-recipe-list`,
    searchRecipe: `${BASE_URL}/search-recipe`,
    recipeDetail: `${BASE_URL}/recipe/:recipeId`,
    recipeRegister: `${BASE_URL}/recipe/register`,
    notFound: '*',
  },

  navConfig: {
    [`${BASE_URL}/`]: {
      title: "홈",
      links: [
        { to: `${BASE_URL}/notifications`, icon: <FaBell />, alt: "알림" },
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/inventory`]: {
      title: "재료 관리",
      links: [
        { to: `${BASE_URL}/notifications`, icon: <FaSearch />, alt: "검색" },
        { to: `${BASE_URL}/wastebaket`, icon: <FaTrashCan />, alt: "휴지통" },
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/mealplan`]: {
      title: "식단 관리",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/recipes`]: {
      title: "테마별 레시피",
      links: [
        { to: `${BASE_URL}/recipe/register`, icon: <FaEdit/>, alt: "레시피 추가" },
        { to: `${BASE_URL}/search-recipe`, icon: <FaSearch/>, alt: "레시피 검색" },
        { to: `${BASE_URL}/mypage`, icon: <FaBars/>, alt: "마이페이지" },
      ],
    },

    [`${BASE_URL}/store`]: {
      title: "스토어",
      links: [
        { to: `${BASE_URL}/cart`, icon: <FaShoppingCart />, alt: "장바구니" },
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },

  },

  notFound: "*",
};

export default RouteConfig;
