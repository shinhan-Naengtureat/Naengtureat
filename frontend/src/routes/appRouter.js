import React from "react";
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

const AppRouter = () => {
  return (
    <div className="app">
      <TopNav />
      <Routes>
        <Route
          path={routeConfig.paths.home}
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path={routeConfig.paths.inventoryList}
          element={
            <Layout>
              <InventoryList />
            </Layout>
          }
        />
        <Route
          path={routeConfig.paths.mealPlanListDaily}
          element={
            <Layout>
              <MealPlanListDaily />
            </Layout>
          }
        />
        <Route
          path={routeConfig.paths.recipeList}
          element={
            <Layout>
              <RecipeList />
            </Layout>
          }
        />
        <Route
          path={routeConfig.paths.storeList}
          element={
            <Layout>
              <StoreList />
            </Layout>
          }
        />

        {/* 필요한 경우 추가할 수 있는 라우트 */}
        <Route
          path={routeConfig.paths.login}
          element={<Layout>Login Page</Layout>}
        />
        <Route
          path={routeConfig.paths.register}
          element={<Layout>Register Page</Layout>}
        />
        <Route
          path={routeConfig.paths.myPage}
          element={<Layout>MyPage</Layout>}
        />

        {/* 404 Not Found */}
        <Route
          path={routeConfig.paths.notFound}
          element={<h1>404 Not Found</h1>}
        />
      </Routes>
      <BottomNav />
    </div>
  );
};

export default AppRouter;
