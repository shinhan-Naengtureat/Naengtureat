import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "pages/home/HomePage";
import RecipeList from "pages/recipe/RecipeList";
import InventoryList from "pages/inventory/InventoryList";
import StoreList from "pages/store/StoreList";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import BottomNav from "components/BottomNav";
import RouteConfig from "routes/RouteConfig";
import CategorySelectionPage from "pages/mealPlan/CategorySelectionPage";
import BudgetInputPage from "pages/mealPlan/BudgetInputPage";
import PreferredIngredientsPage from "pages/mealPlan/PreferredIngredientsPage";
import ThemeSelectionPage from "pages/mealPlan/ThemeSelectionPage";
import ExcludedIngredientsPage from "pages/mealPlan/ExcludedIngredientsPage";
import ShoppingListPage from "pages/mealPlan/ShoppingListPage";

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
        <Route path={RouteConfig.home} element={<HomePage />} />
        <Route path={RouteConfig.inventoryList} element={<InventoryList />} />
        <Route
          path={RouteConfig.mealPlanListDaily}
          element={<MealPlanListDaily />}
        />
        <Route
          path={RouteConfig.budgetInput}
          element={<BudgetInputPage setUserSelections={setUserSelections} />}
        />
        <Route
          path={RouteConfig.categorySelection}
          element={
            <CategorySelectionPage setUserSelections={setUserSelections} />
          }
        />
        <Route
          path={RouteConfig.themeSelection}
          element={<ThemeSelectionPage setUserSelections={setUserSelections} />}
        />
        <Route
          path={RouteConfig.preferredIngredients}
          element={
            <PreferredIngredientsPage setUserSelections={setUserSelections} />
          }
        />
        <Route
          path={RouteConfig.excludedIngredients}
          element={
            <ExcludedIngredientsPage setUserSelections={setUserSelections} />
          }
        />
        <Route
          path={RouteConfig.notEnoughIngredientList}
          element={<ShoppingListPage setUserSelections={setUserSelections} />}
        />
        <Route
          path={RouteConfig.mealPlanListDaily}
          element={<MealPlanListDaily userSelections={userSelections} />}
        />
        <Route path={RouteConfig.recipeList} element={<RecipeList />} />
        <Route path={RouteConfig.storeList} element={<StoreList />} />
        <Route
          path={RouteConfig.notFound}
          element={<h1>404 Not Found</h1>}
        />{" "}
        {/* 404 페이지 */}
      </Routes>
      <BottomNav />
    </div>
  );
};

export default AppRouter;
