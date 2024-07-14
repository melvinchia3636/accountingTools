import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Book from "./pages/Book";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <main className="w-full h-dvh flex bg-zinc-950 text-zinc-200">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<Book />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer theme="dark" position="bottom-center" />
    </main>
  );
}

export default App;
