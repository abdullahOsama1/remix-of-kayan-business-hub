import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/kayan/Layout";
import { CartProvider } from "@/lib/cart";
import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import Lab from "./pages/Lab.tsx";
import Shipping from "./pages/Shipping.tsx";
import About from "./pages/About.tsx";
import AdminGate from "./pages/AdminGate.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/about" element={<About />} />
            </Route>
            {/* Hidden admin route — Phase 2 */}
            <Route path="/kayan-control" element={<AdminGate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
