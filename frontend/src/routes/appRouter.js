import Layout from "components/common/Layout";
import HomePage from "pages/home/HomePage";
import InventoryDetail from "pages/inventory/InventoryDetail";
import InventoryList from "pages/inventory/InventoryList";
import BudgetInputPage from "pages/mealPlan/BudgetInputPage";
import CategorySelectionPage from "pages/mealPlan/CategorySelectionPage";
import ExcludedIngredientsPage from "pages/mealPlan/ExcludedIngredientsPage";
import FrequencyInputPage from "pages/mealPlan/FrequencyInputPage";
import GPTChat from "pages/mealPlan/GPTchat";
import IngredientStoreListPage from "pages/mealPlan/IngredientStoreListPage";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import NotEnoughIngredientListPage from "pages/mealPlan/NotEnoughIngredientListPage";
import PreferredIngredientsPage from "pages/mealPlan/PreferredIngredientsPage";
import ThemeSelectionPage from "pages/mealPlan/ThemeSelectionPage";
import RecipeDetail from 'pages/recipe/RecipeDetail';
import RecipeList from "pages/recipe/RecipeList";
import RecipeSearchPage from 'pages/recipe/RecipeSearchPage';
import StoreList from "pages/store/StoreList";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import routeConfig from "routes/routeConfig";

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
      <Routes>
        {/*home*/}
        <Route path={routeConfig.paths.home} element={<Layout><HomePage /></Layout>}/>

        {/*inventoty*/}
        <Route path={routeConfig.paths.inventoryList} element={<Layout> <InventoryList /></Layout>}/>
        <Route path={routeConfig.paths.inventoryDetail} element={<Layout><InventoryDetail/></Layout>} />

        {/*mealPlan*/}
        <Route path={routeConfig.paths.mealPlanListDaily} element={ <Layout><MealPlanListDaily userSelections={userSelections} /></Layout>}/>
        <Route path={routeConfig.paths.budgetInput} element={<BudgetInputPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.categorySelection} element={<CategorySelectionPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.themeSelection} element={<ThemeSelectionPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.preferredIngredients} element={ <PreferredIngredientsPage setUserSelections={setUserSelections} />}/>
        <Route path={routeConfig.paths.excludedIngredients} element={<ExcludedIngredientsPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.frequencyMealPlan} element={<FrequencyInputPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.makeMealPlan} element={<GPTChat setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.notEnoughIngredientList} element={<NotEnoughIngredientListPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.ingredientStoreList} element={<IngredientStoreListPage setUserSelections={setUserSelections} />} />
     
        {/*recipe*/}
        <Route path={routeConfig.paths.recipeList} element={<Layout><RecipeList/></Layout>} />
        <Route path={routeConfig.paths.storeList} element={<Layout><StoreList/></Layout>} />
        <Route path={routeConfig.paths.searchRecipe} element={<Layout><RecipeSearchPage/></Layout>} />
        <Route path={routeConfig.paths.recipeDetail} element={<Layout><RecipeDetail/></Layout>} />

        {/* 404 Not Found */}
        <Route path={routeConfig.paths.notFound} element={<h1>404 Not Found</h1>}/>
        </Routes>
        
    </div>
  );
};

export default AppRouter;
