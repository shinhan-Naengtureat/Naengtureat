import BottomNav from "components/common/BottomNav";
import Layout from "components/common/Layout";
import { MealPlanProvider } from "context/MealPlanContext";
import HomePage from "pages/home/HomePage";
import InventoryCreate from "pages/inventory/InventoryCreate";
import InventoryDetail from "pages/inventory/InventoryDetail";
import InventoryList from "pages/inventory/InventoryList";
import InventoryWastebucket from "pages/inventory/InventoryWastebucket";
import GPTChat from "pages/mealPlan/GPTchat";
import IngredientStoreListPage from "pages/mealPlan/IngredientStoreListPage";
import BudgetInputPage from "pages/mealPlan/Input/BudgetInputPage";
import CategorySelectionPage from "pages/mealPlan/Input/CategorySelectionPage";
import ExcludedIngredientsPage from "pages/mealPlan/Input/ExcludedIngredientsPage";
import FrequencyInputPage from "pages/mealPlan/Input/FrequencyInputPage";
import PreferredIngredientsPage from "pages/mealPlan/Input/PreferredIngredientsPage";
import ThemeSelectionPage from "pages/mealPlan/Input/ThemeSelectionPage";
import InventoryMultipleDelete from "pages/inventory/InventoryMultipleDelete";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import NotEnoughIngredientListPage from "pages/mealPlan/NotEnoughIngredientListPage";
import InstantCharge from 'pages/myPage/InstantCharge';
import MyRecipes from 'pages/myPage/MyRecipes';
import RecipeEdit from "pages/myPage/RecipeEdit";
import RecipeDetail from 'pages/recipe/RecipeDetail/RecipeDetail';
import RecipeList from "pages/recipe/RecipeMain/RecipeList";
import RecipeRegister from "pages/recipe/RecipeRegister/RecipeRegister";
import RecipeSearchPage from 'pages/recipe/RecipeMain/RecipeSearchPage';
import Store from "pages/store/Store";
import StoreDetail from 'pages/store/StoreDetail';
import StoreReviewDetail from 'pages/store/StoreReviewDetail';
import Cart from "pages/store/Cart";
import { Route, Routes } from "react-router-dom";
import routeConfig from "routes/routeConfig";
import useFirebasePush from "hooks/useFirebasePush";
import OrderDetail from "pages/store/OrderDetail";
import OrderComplete from "pages/store/OrderComplete";
import OrderSuccess from "pages/store/OrderSuccess";


const AppRouter = () => {
  const userId = 3;
  useFirebasePush(userId);

  return (
    <div className="app">
      <MealPlanProvider>
      <Routes>
        {/*home*/}
        <Route path={routeConfig.paths.home} element={<Layout><HomePage /></Layout>}/>

        {/*inventoty*/}
        <Route path={routeConfig.paths.inventoryList} element={<Layout> <InventoryList /></Layout>}/>
        <Route path={routeConfig.paths.inventoryDetail} element={<Layout><InventoryDetail/></Layout>} />
        <Route path={routeConfig.paths.inventoryCreate} element={<Layout><InventoryCreate/></Layout>} />
        <Route path={routeConfig.paths.multipleInventory} element={<Layout><InventoryMultipleDelete/></Layout>} />
        <Route path={routeConfig.paths.inventoryWastebucket} element={<Layout><InventoryWastebucket/></Layout>} />

          {/* MealPlan */}
          <Route path={routeConfig.paths.mealPlanListDaily} element={<Layout><MealPlanListDaily /></Layout>} />
          <Route path={routeConfig.paths.budgetInput} element={<BudgetInputPage />} />
          <Route path={routeConfig.paths.categorySelection} element={<CategorySelectionPage />} />
          <Route path={routeConfig.paths.themeSelection} element={<ThemeSelectionPage />} />
          <Route path={routeConfig.paths.preferredIngredients} element={<PreferredIngredientsPage />} />
          <Route path={routeConfig.paths.excludedIngredients} element={<ExcludedIngredientsPage />} />
          <Route path={routeConfig.paths.frequencyMealPlan} element={<FrequencyInputPage />} />
          <Route path={routeConfig.paths.makeMealPlan} element={<GPTChat />} />
          <Route path={routeConfig.paths.notEnoughIngredientList} element={<NotEnoughIngredientListPage />} />
          <Route path={routeConfig.paths.ingredientStoreList} element={<IngredientStoreListPage />} />

        {/*recipe*/}
        <Route path={routeConfig.paths.recipeList} element={<Layout><RecipeList/></Layout>} />
        <Route path={routeConfig.paths.searchRecipe} element={<Layout><RecipeSearchPage/></Layout>} />
        <Route path={routeConfig.paths.recipeDetail} element={<Layout><RecipeDetail/></Layout>} />
        <Route path={routeConfig.paths.recipeRegister} element={<Layout><RecipeRegister/></Layout>} />

        {/* mypage */}
        <Route path={routeConfig.paths.myRecipeList} element={<Layout><MyRecipes/></Layout>} />
        <Route path={routeConfig.paths.recipeEdit} element={<Layout><RecipeEdit/></Layout>} />
        <Route path={routeConfig.paths.InstantCharge} element={<Layout><InstantCharge/></Layout>} />

        {/* store */}
        <Route path={routeConfig.paths.store} element={<Layout><Store/></Layout>} />
        <Route path={routeConfig.paths.storeReview} element={<Layout><StoreReviewDetail /></Layout>} />
        <Route path={routeConfig.paths.storeDetail} element={<Layout><StoreDetail /></Layout>} />
        <Route path={routeConfig.paths.orderDetail} element={<Layout><OrderDetail /></Layout>} />
        <Route path={routeConfig.paths.orderComplete} element={<OrderComplete />} />
        <Route path={routeConfig.paths.orderSuccess} element={<OrderSuccess />} />
        <Route path={routeConfig.paths.cart} element={<Layout><Cart /></Layout>} />

        {/* 404 Not Found */}
        <Route path={routeConfig.paths.notFound} element={<h1>404 Not Found</h1>} />
        </Routes>
         </MealPlanProvider>
      <BottomNav/>
    </div>
  );
};

export default AppRouter;