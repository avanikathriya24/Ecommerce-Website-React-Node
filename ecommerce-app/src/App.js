import Todo from './components/Todo/Todo';
import Navbar from './components/Navbar/Navbar';
import Weather from './components/Weather/Weather';
import Products from './components/Products/Products';
import Cart from './components/Products/CartPage';
import { CartProvider } from './components/Products/CartContex';



import { BrowserRouter,Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
          <BrowserRouter>

            <Navbar />
            <CartProvider>

            <Routes>
                <Route path='/' element={<Todo/>}/>
                <Route path='/weather' element={<Weather/>}/>

                  <Route path='/products' element={<Products/>}/>
                  <Route path='/cart' element={<Cart/>}/>


            </Routes>
            </CartProvider>

          </BrowserRouter>
      </div>
  );
}

export default App;
