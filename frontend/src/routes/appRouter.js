import BottomNav from "components/common/BottomNav";
import Layout from "components/common/Layout";
import TopNav from "components/common/TopNav";
import HomePage from "pages/home/HomePage";
import InventoryCreate from "pages/inventory/InventoryCreate";
import InventoryDetail from "pages/inventory/InventoryDetail";
import InventoryList from "pages/inventory/InventoryList";
import BudgetInputPage from "pages/mealPlan/BudgetInputPage";
import CategorySelectionPage from "pages/mealPlan/CategorySelectionPage";
import ExcludedIngredientsPage from "pages/mealPlan/ExcludedIngredientsPage";
import IngredientStoreListPage from "pages/mealPlan/IngredientStoreListPage";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import NotEnoughIngredientListPage from "pages/mealPlan/NotEnoughIngredientListPage";
import PreferredIngredientsPage from "pages/mealPlan/PreferredIngredientsPage";
import ThemeSelectionPage from "pages/mealPlan/ThemeSelectionPage";
import MyRecipes from 'pages/myPage/MyRecipes';
import RecipeDetail from 'pages/recipe/RecipeDetail';
import RecipeList from "pages/recipe/RecipeList";
import RecipeRegister from "pages/recipe/RecipeRegister";
import RecipeSearchPage from "pages/recipe/RecipeSearchPage";
import Store from "pages/store/Store";
import StoreDetail from 'pages/store/StoreDetail';
import StoreReviewDetail from 'pages/store/StoreReviewDetail';
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import routeConfig from "routes/routeConfig";
import InventoryMultipleDelete from "pages/inventory/InventoryMultipleDelete";

const AppRouter = () => {
  const [userSelections, setUserSelections] = useState({
    budget: "",
    category: "",
    theme: "",
    preferredIngredients: [],
    excludedIngredients: [],
  });

  return (
    <div className="app">
      <TopNav />
      <Routes>
        {/*home*/}
        <Route path={routeConfig.paths.home} element={<Layout><HomePage /></Layout>}/>

        {/*inventoty*/}
        <Route path={routeConfig.paths.inventoryList} element={<Layout> <InventoryList /></Layout>}/>
        <Route path={routeConfig.paths.inventoryDetail} element={<Layout><InventoryDetail/></Layout>} />
        <Route path={routeConfig.paths.inventoryCreate} element={<Layout><InventoryCreate/></Layout>} />
        <Route path={routeConfig.paths.multipleInventory} element={<Layout><InventoryMultipleDelete/></Layout>} />

        {/*mealPlan*/}
        <Route path={routeConfig.paths.mealPlanListDaily} element={ <Layout><MealPlanListDaily userSelections={userSelections} /></Layout>}/>
        <Route path={routeConfig.paths.budgetInput} element={<BudgetInputPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.categorySelection} element={<CategorySelectionPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.themeSelection} element={<ThemeSelectionPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.preferredIngredients} element={ <PreferredIngredientsPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.excludedIngredients} element={<ExcludedIngredientsPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.notEnoughIngredientList} element={<NotEnoughIngredientListPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.ingredientStoreList} element={<IngredientStoreListPage setUserSelections={setUserSelections} />}/>

        {/*recipe*/}
        <Route path={routeConfig.paths.recipeList} element={<Layout><RecipeList/></Layout>} />
        <Route path={routeConfig.paths.searchRecipe} element={<Layout><RecipeSearchPage/></Layout>} />
        <Route path={routeConfig.paths.recipeDetail} element={<Layout><RecipeDetail/></Layout>} />
        <Route path={routeConfig.paths.recipeRegister} element={<Layout><RecipeRegister/></Layout>} />

        {/* mypage */}
        <Route path={routeConfig.paths.myRecipeList} element={<Layout><MyRecipes/></Layout>} />

        {/* store */}
        <Route path={routeConfig.paths.store} element={<Layout><Store/></Layout>} />
        <Route path={routeConfig.paths.storeReview} element={<Layout><StoreReviewDetail /></Layout>} />
        <Route path={routeConfig.paths.storeDetail} element={<Layout><StoreDetail /></Layout>} />

        {/* 404 Not Found */}
        <Route path={routeConfig.paths.notFound} element={<h1>404 Not Found</h1>} />
      </Routes>
      <BottomNav/>
    </div>
  );
};

export default AppRouter;
