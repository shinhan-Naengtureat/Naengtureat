import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "pages/home/HomePage";
import RecipeList from "pages/recipe/RecipeList";
import InventoryList from "pages/inventory/InventoryList";
import StoreList from "pages/store/StoreList";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import routeConfig from "routes/routeConfig";

import BudgetInputPage from "pages/mealPlan/BudgetInputPage";
import CategorySelectionPage from "pages/mealPlan/CategorySelectionPage";
import ThemeSelectionPage from "pages/mealPlan/ThemeSelectionPage";
import PreferredIngredientsPage from "pages/mealPlan/PreferredIngredientsPage";
import ExcludedIngredientsPage from "pages/mealPlan/ExcludedIngredientsPage";
import Layout from "components/common/Layout";
import IngredientStoreListPage from "pages/mealPlan/IngredientStoreListPage";
import NotEnoughIngredientListPage from "pages/mealPlan/NotEnoughIngredientListPage";
import RecipeSearchPage from "pages/recipe/RecipeSearchPage";
import FrequencyInputPage from "pages/mealPlan/FrequencyInputPage";
import GPTChat from "pages/mealPlan/GPTchat";
import { MealPlanProvider } from "context/MealPlanContext";

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
        <Route path={routeConfig.paths.home} element={<Layout><HomePage /></Layout>} />
        <Route path={routeConfig.paths.inventoryList} element={<Layout> <InventoryList /></Layout>} />
        <Route path={routeConfig.paths.recipeList} element={<Layout><RecipeList /></Layout>} />
        <Route path={routeConfig.paths.storeList} element={<Layout><StoreList /></Layout>} />
       

        {/* 식단 생성 관련 페이지 */}
        {/* <MealPlanProvider> */}
        {/* <Routes> */}
        <Route path={routeConfig.paths.mealPlanListDaily} element={<Layout><MealPlanListDaily userSelections={userSelections} /></Layout>} />
        <Route path={routeConfig.paths.budgetInput} element={<BudgetInputPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.categorySelection} element={<CategorySelectionPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.themeSelection} element={<ThemeSelectionPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.preferredIngredients} element={<PreferredIngredientsPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.excludedIngredients} element={<ExcludedIngredientsPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.frequencyMealPlan} element={<FrequencyInputPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.makeMealPlan} element={<GPTChat setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.notEnoughIngredientList} element={<NotEnoughIngredientListPage setUserSelections={setUserSelections} />} />
        <Route path={routeConfig.paths.ingredientStoreList} element={<IngredientStoreListPage setUserSelections={setUserSelections} />} />
      {/* </Routes> */}
    {/* </MealPlanProvider> */}
       
        


        {/* 필요한 경우 추가할 수 있는 라우트 */}
        <Route path={routeConfig.paths.login} element={<Layout>Login Page</Layout>}/>
        <Route path={routeConfig.paths.register} element={<Layout>Register Page</Layout>}/>
        <Route path="/search-recipe" element={<Layout><RecipeSearchPage/></Layout>} />


        {/* 404 Not Found */}
        <Route path={routeConfig.paths.notFound} element={<h1>404 Not Found</h1>}/>
        </Routes>
        
    </div>
  );
};

export default AppRouter;
