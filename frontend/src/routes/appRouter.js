import Layout from "components/common/Layout";
import { MealPlanProvider } from "context/MealPlanContext";
import HomePage from "pages/home/HomePage";
import InventoryDetail from "pages/inventory/InventoryDetail";
import InventoryList from "pages/inventory/InventoryList";
import BudgetInputPage from "pages/mealPlan/Input/BudgetInputPage";
import CategorySelectionPage from "pages/mealPlan/Input/CategorySelectionPage";
import ExcludedIngredientsPage from "pages/mealPlan/Input/ExcludedIngredientsPage";
import FrequencyInputPage from "pages/mealPlan/Input/FrequencyInputPage";
import GPTChat from "pages/mealPlan/GPTchat";
import IngredientStoreListPage from "pages/mealPlan/IngredientStoreListPage";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import NotEnoughIngredientListPage from "pages/mealPlan/NotEnoughIngredientListPage";
import PreferredIngredientsPage from "pages/mealPlan/Input/PreferredIngredientsPage";
import ThemeSelectionPage from "pages/mealPlan/Input/ThemeSelectionPage";
import RecipeDetail from 'pages/recipe/RecipeDetail';
import RecipeList from "pages/recipe/RecipeList";
import RecipeSearchPage from 'pages/recipe/RecipeSearchPage';
import StoreList from "pages/store/StoreList";
import { Route, Routes } from "react-router-dom";
import routeConfig from "routes/routeConfig";

const AppRouter = () => {

  return (
    <div className="app">
      <MealPlanProvider>
      <Routes>
        {/*home*/}
        <Route path={routeConfig.paths.home} element={<Layout><HomePage /></Layout>}/>

        {/*inventoty*/}
        <Route path={routeConfig.paths.inventoryList} element={<Layout> <InventoryList /></Layout>}/>
        <Route path={routeConfig.paths.inventoryDetail} element={<Layout><InventoryDetail/></Layout>} />

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
        <Route path={routeConfig.paths.storeList} element={<Layout><StoreList/></Layout>} />
        <Route path={routeConfig.paths.searchRecipe} element={<Layout><RecipeSearchPage/></Layout>} />
        <Route path={routeConfig.paths.recipeDetail} element={<Layout><RecipeDetail/></Layout>} />

        {/* 404 Not Found */}
        <Route path={routeConfig.paths.notFound} element={<h1>404 Not Found</h1>}/>
        </Routes>
        </MealPlanProvider>
    </div>
  );
};

export default AppRouter;
