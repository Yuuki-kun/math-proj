import React, { Suspense } from "react";
import { Route, Router, Routes } from "react-router-dom";
import routes from "./config/routes";
import ProtectedRoute from "./component/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute activeRoles={route.roles}>
                    {route.layout}
                  </ProtectedRoute>
                ) : (
                  route.layout
                )
              }
            >
              {route.index && <Route index element={route.index} />}
              {route.children.map((child, cidx) => (
                <Route key={cidx} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
