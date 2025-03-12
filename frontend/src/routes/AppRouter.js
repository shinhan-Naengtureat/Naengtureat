import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "pages/home/HomePage";
import RecipeList from "pages/recipe/RecipeList";
import InventoryList from "pages/inventory/InventoryList";
import StoreList from "pages/store/StoreList";
import MealPlanListDaily from "pages/mealPlan/MealPlanListDaily";
import BottomNav from "components/BottomNav";
import Layout from "components/Layout"; // 레이아웃 적용
import RouteConfig from "routes/RouteConfig";
import TopNav from "components/TopNav";

const AppRouter = () => {
  return (
    <div className="app">
      <TopNav/>
        <Routes>
          <Route path={RouteConfig.home} element={<Layout> <HomePage/> </Layout>}/>
          <Route path={RouteConfig.inventoryList} element={<Layout><InventoryList/></Layout>}/>
          <Route path={RouteConfig.mealPlanListDaily} element={<Layout><MealPlanListDaily/></Layout>}/>
          <Route path={RouteConfig.recipeList} element={<Layout><RecipeList/></Layout>}/>
          <Route path={RouteConfig.storeList} element={<Layout><StoreList/></Layout>}/>
          <Route path={RouteConfig.notFound} element={<h1>404 Not Found</h1>}/> {/* 404 페이지 */}
        </Routes>
      <BottomNav/>
    </div>
  );
}

export default AppRouter;