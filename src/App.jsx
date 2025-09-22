import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
