import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "pages/home/HomePage";
import RecipeList from "pages/recipe/RecipeList";
import InventoryList from "pages/inventory/InventoryList";
import StoreList from "pages/store/StoreList";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import routeConfig from "routes/routeConfig";
import Layout from "components/common/Layout";
import TopNav from "components/common/TopNav";
import BottomNav from "components/common/BottomNav";

import RecipeSearchPage from "pages/recipe/RecipeSearchPage";
import MyRecipes from 'pages/myPage/MyRecipes';
import RecipeDetail from 'pages/recipe/RecipeDetail';
import BudgetInputPage from "pages/mealPlan/BudgetInputPage";
import CategorySelectionPage from "pages/mealPlan/CategorySelectionPage";
import ThemeSelectionPage from "pages/mealPlan/ThemeSelectionPage";
import PreferredIngredientsPage from "pages/mealPlan/PreferredIngredientsPage";
import ExcludedIngredientsPage from "pages/mealPlan/ExcludedIngredientsPage";
import NotEnoughIngredientListPage from "pages/mealPlan/NotEnoughIngredientListPage";
import IngredientStoreListPage from "pages/mealPlan/IngredientStoreListPage";
import RecipeRegister from "pages/recipe/RecipeRegister";
import InventoryDetail from "pages/inventory/InventoryDetail";
import InventoryCreate from "pages/inventory/InventoryCreate";
import InventoryWastebucket from "pages/inventory/InventoryWastebucket";


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
        <Route path={routeConfig.paths.inventoryWastebucket} element={<Layout><InventoryWastebucket/></Layout>} />

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
        <Route path={routeConfig.paths.storeList} element={<Layout><StoreList/></Layout>} />


        {/* 필요한 경우 추가할 수 있는 라우트 */}
        <Route path="/search-recipe" element={<Layout><RecipeSearchPage/></Layout>} />
        <Route path={routeConfig.paths.myRecipeList} element={<Layout><MyRecipes/></Layout>} />
        <Route path={routeConfig.paths.searchRecipe} element={<Layout><RecipeSearchPage/></Layout>} />
        <Route path={routeConfig.paths.recipeDetail} element={<Layout><RecipeDetail/></Layout>} />
        <Route path={routeConfig.paths.recipeRegister} element={<Layout><RecipeRegister/></Layout>} />


        {/* 404 Not Found */}
        <Route path={routeConfig.paths.notFound} element={<h1>404 Not Found</h1>}/>
      </Routes>
      <BottomNav/>
    </div>
  );
};

export default AppRouter;
