import React from 'react';
import {Route, Router, Routes} from "react-router-dom";
import HomePage from "pages/home/HomePage";
import RecipeList from "pages/recipe/RecipeList";
import InventoryList from "pages/inventory/InventoryList";
import StoreList from "pages/store/StoreList";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import BottomNav from "components/BottomNav";
import RouteConfig from "routes/RouteConfig";

const AppRouter = () => {
  return (
    <div className="app">
      <Routes>
        <Route path={RouteConfig.home} element={<HomePage />} />
        <Route path={RouteConfig.inventoryList} element={<InventoryList />} />
        <Route path={RouteConfig.mealPlanListDaily} element={<MealPlanListDaily />} />
        <Route path={RouteConfig.recipeList} element={<RecipeList />} />
        <Route path={RouteConfig.storeList} element={<StoreList />} />
        <Route path={RouteConfig.notFound} element={<h1>404 Not Found</h1>} /> {/* 404 페이지 */}
      </Routes>
      <BottomNav />
    </div>
  );
}

export default AppRouter;