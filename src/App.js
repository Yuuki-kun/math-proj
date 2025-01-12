import React, { Suspense, useEffect } from "react";
import { Route, Router, Routes } from "react-router-dom";
import routes from "./config/routes";
import ProtectedRoute from "./component/ProtectedRoute";
import ActionResultNotification from "./component/shared/notifications/ActionResultNotification";
import useAuth from "./hook/useAuth";

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
