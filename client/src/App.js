import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/product")
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      {product ? (
        <div>
          <img src={product.imageURL} alt={product.name} />
          <p>{product.description}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
