const BASE_URL = process.env.PUBLIC_URL || "";

const RouteConfig = {
  home: `${BASE_URL}/`,
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,

  // myPage
  myPage: `${BASE_URL}/mypage`,

  // recipe
  recipeList: `${BASE_URL}/recipes`,
  recipeDetail: `${BASE_URL}/recipe/:recipeId`,

  // inventory
  inventoryList: `${BASE_URL}/inventory`,
  inventoryDetail: `${BASE_URL}/inventory/:inventoryId`,

  // store
  storeList: `${BASE_URL}/store`,
  storeDetail: `${BASE_URL}/store/:storeId`,

  // mealPlan
  mealPlanListDaily: `${BASE_URL}/mealplan`,
  budgetInput: `${BASE_URL}/budget`, //예산 입력 페이지
  categorySelection: `${BASE_URL}/category`, //카테고리 선택 페이지
  themeSelection: `${BASE_URL}/theme`, //테마 선택 페이지
  preferredIngredients: `${BASE_URL}/preferred-ingredients`, //선호 재료 선택 페이지
  excludedIngredients: `${BASE_URL}/exclude-ingredients`, //제외 재료 선택 페이지
  notEnoughIngredientList: `${BASE_URL}/shopping-container`, //부족한 재료 리스트 조회 페이지
  notFound: "*", // 404 페이지
};

export default RouteConfig;
