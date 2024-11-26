import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'; 
import Login from './Login';
import Register from './Register';
import Bill from './Bill';
import CreateBill from './CreateBill';
import { NextUIProvider } from '@nextui-org/react';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <NextUIProvider className="dark text-foreground bg-background">
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/createBill" element={<CreateBill/>} />
          </Routes>
        </main>
      </Router>
    </NextUIProvider>
  </StrictMode>
);
