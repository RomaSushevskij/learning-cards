import React from 'react'
// import {EditProfilePage} from "../pages/profile/EditProfilePage/EditProfilePage";
import {RegistrationPage} from "../pages/registration/RegistrationPage";
import NewPasswordPage from "../pages/newPassword/NewPasswordPage";
import TestPage from "../pages/test/TestPage";
import {Error404Page} from "../pages/error/Error404Page";
import {Navigate, Route, Routes} from 'react-router-dom';
import RecoverPage from "../pages/recover/RecoverPage";
import LoginPage from "../pages/login/LoginPage";
import {Profile} from '../pages/profile/Profile/Profile';
import PacksPage from "../pages/packs/PacksPage";

export const PATH = {
    LOGIN: '/login',
    REGISTRATION: '/registration',
    NEW_PASSWORD: '/new-password/*',
    PROFILE: '/profile',
    TEST: '/test',
    RECOVER: '/recover',
    PACKS: '/packs',
    CARDS: '/cards/*'
};


const CardsPage = () => {
    return (
        <div>
            Cards
        </div>
    )
}

export const RoutesApp = () => (
    <div className='Routes'>
        <Routes>
            {/*в начале мы попадаем на страницу '/' и переходим сразу на страницу LOGIN*/}
            <Route path={'/'} element={<Navigate to={PATH.LOGIN}/>}/>
            <Route path={PATH.LOGIN} element={<LoginPage/>}/>
            <Route path={PATH.REGISTRATION} element={<RegistrationPage/>}/>
            <Route path={PATH.NEW_PASSWORD} element={<NewPasswordPage/>}/>
            <Route path={PATH.PROFILE} element={<Profile/>}/>
            <Route path={PATH.TEST} element={<TestPage/>}/>
            <Route path={PATH.RECOVER} element={<RecoverPage/>}/>
            <Route path={PATH.PACKS} element={<PacksPage/>}/>
            <Route path={PATH.CARDS} element={<CardsPage/>}/>
            {/*у этого роута нет пути, он отрисуется если пользователь захочет попасть на несуществующую страницу*/}
            <Route path='*' element={<Error404Page/>}/>
        </Routes>
    </div>
);

