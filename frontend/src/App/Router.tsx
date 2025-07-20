import {BrowserRouter, Routes, Route} from "react-router-dom";
import {frontendPath} from '../../../shared/path'
import MainLayout from "../Layouts/MainLayout";
import AdminLayout from "../Layouts/AdminLayout";

import MainPage from "../Pages/App/MainPage/MainPage";
import CardPage from "../Pages/App/CardPage/CardPage";
import RegistrationPage from "../Pages/App/RegistrationPage/RegistrationPage";
import LoginPage from "../Pages/App/LoginPage/LoginPage";
import NotFaund from "../Pages/NonFaund";
import Basket from "../Pages/App/Basket/Basket";
import AccountPage from "../Pages/App/Account/AccountPage";
import FlowersPage from "../Pages/App/ProductsPage/FlowersPage";
import GiftPage from "../Pages/App/ProductsPage/GiftPage";
import AdminMainPage from "../Pages/Admin/AdminMainPage/AdminMainPage";
import AdminCreateProductPage from "../Pages/Admin/AdminCreateProductPage";



const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<MainLayout />} path={frontendPath.app}>
                <Route element={<MainPage />} index/>
                <Route element={<FlowersPage />} path={frontendPath.cards.flowers} />
                <Route element={<GiftPage />} path={frontendPath.cards.gifts} />
                <Route element={<CardPage />} path={`${frontendPath.cards.flowers}/:id`} />
                <Route element={<CardPage />} path={`${frontendPath.cards.gifts}/:id`} />
                <Route element={<CardPage />} path={`${frontendPath.cards.all}/:id`} />
                <Route element={<Basket />} path={frontendPath.basket} />                
                <Route element={<RegistrationPage />} path={frontendPath.registration} />
                <Route element={<LoginPage />} path={frontendPath.login} />
                <Route element={<AccountPage />} path={`${frontendPath.account}/:id`} />
            </Route>
            <Route element={<AdminLayout />} path={frontendPath.admin}>
                <Route element={<AdminMainPage />} index/>
                <Route element={<AdminCreateProductPage />} path={`${frontendPath.admin}${frontendPath.admins.create}`} />
            </Route>
            <Route element={<NotFaund />} path="*" />
        </Routes>
    </BrowserRouter>
);


export default Router