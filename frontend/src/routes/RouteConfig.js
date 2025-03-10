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
  notFound: "*", // 404 페이지
};

export default RouteConfig;