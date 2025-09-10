// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default ke ProductList dulu */}
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;
