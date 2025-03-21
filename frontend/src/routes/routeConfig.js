import {FaBars, FaEdit, FaPen, FaSearch, FaShoppingCart} from "react-icons/fa";
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
    multipleInventory: `${BASE_URL}/multiple-inventory`,
    inventoryWastebucket: `${BASE_URL}/wastebucket`,
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
    orderDetail: `${BASE_URL}/store/order`,
    orderComplete: `${BASE_URL}/store/order/complete`,
    orderSuccess: `${BASE_URL}/orders/success`,
    myRecipeList: `${BASE_URL}/my-recipe-list`,
    searchRecipe: `${BASE_URL}/search-recipe`,
    recipeDetail: `${BASE_URL}/recipe/:recipeId`,
    recipeRegister: `${BASE_URL}/recipe/register`,
    cart: `${BASE_URL}/cart`,
    recipeEdit: `${BASE_URL}/recipe/edit/:recipeId`,
    InstantCharge: `${BASE_URL}/instant-charge`,
    notFound: '*',
  },

  navConfig: {
    [`${BASE_URL}/`]: {
      title: "홈",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },

    /*==================재료==================*/
    [`${BASE_URL}/inventory`]: {
      title: "재료 관리",
      links: [
        { to: `${BASE_URL}/multiple-inventory`, icon: <FaPen />, alt: "다중선택" },
        { to: `${BASE_URL}/wastebucket`, icon: <FaTrashCan />, alt: "휴지통"},
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/inventory/:id`]: {
      title: "재료 상세 정보",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/inventory/new`]: {
      title: "재료 등록",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/multiple-inventory`]: {
      title: "재료 삭제",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/wastebucket`]: {
      title: "유통기한 지난 재료",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },

    /*==================식단==================*/
    [`${BASE_URL}/mealplan`]: {
      title: "식단 관리",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },

    /*==================레시피==================*/
    [`${BASE_URL}/recipes`]: {
      title: "테마별 레시피",
      links: [
        { to: `${BASE_URL}/recipe/register`, icon: <FaEdit/>, alt: "레시피 추가" },
        { to: `${BASE_URL}/search-recipe`, icon: <FaSearch/>, alt: "레시피 검색" },
        { to: `${BASE_URL}/mypage`, icon: <FaBars/>, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/recipe/:recipeId`]: {
      title: "상세 레시피",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars/>, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/recipe/register`]: {
      title: "레시피 등록",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars/>, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/search-recipe`]: {
      title: "레시피 검색",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars/>, alt: "마이페이지" },
      ],
    },

    /*==================스토어==================*/
    [`${BASE_URL}/store`]: {
      title: "스토어",
      links: [
        { to: `${BASE_URL}/cart`, icon: <FaShoppingCart />, alt: "장바구니" },
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/store/:storeId/detail`]: {
      title: "스토어 상세",
      links: [
        { to: `${BASE_URL}/cart`, icon: <FaShoppingCart />, alt: "장바구니" },
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/store/:storeId/review`]: {
      title: "스토어 후기",
      links: [
        { to: `${BASE_URL}/cart`, icon: <FaShoppingCart />, alt: "장바구니" },
        { to: `${BASE_URL}/mypage`, icon: <FaBars />, alt: "마이페이지" },
      ],
    },

    /*==================마이페이지==================*/
    [`${BASE_URL}/recipe/edit/:recipeId`]: {
      title: "레시피 수정",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars/>, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/instant-charge`]: {
      title: "냉털잇 페이",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars/>, alt: "마이페이지" },
      ],
    },
    [`${BASE_URL}/my-recipe-list`]: {
      title: "나의 레시피",
      links: [
        { to: `${BASE_URL}/mypage`, icon: <FaBars/>, alt: "마이페이지" },
      ],
    },
  },
  notFound: "*",
};

export default RouteConfig;