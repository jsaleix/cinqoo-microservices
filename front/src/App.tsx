import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuthContext } from "./contexts/auth.context";
import AppLayout from "./layout/app-layout";
import HomeLayout from "./layout/home-layout";
import Home from "./pages/home";
import NotFound from "./pages/not-found";

const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const BecomeFreelancer = lazy(() => import("./pages/become-freelancer"));
const AccountSettings = lazy(() => import("./pages/account/settings"));
const AccountPrestations = lazy(() => import("./pages/account/prestations"));
const CreatePrestation = lazy(
    () => import("./pages/account/prestations/create")
);
const EditPrestation = lazy(() => import("./pages/account/prestations/edit"));
const Orders = lazy(() => import("./pages/account/orders"));
const Requests = lazy(() => import("./pages/account/requests"));
const Prestation = lazy(() => import("./pages/prestation"));
const Prestations = lazy(() => import("./pages/prestations"));
const Favorites = lazy(() => import("./pages/favorites"));

function App() {
    const { isConnected, isFreelancer } = useAuthContext();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>
                <Route element={<AppLayout />}>
                    <Route
                        path="/become-freelancer"
                        element={<BecomeFreelancer />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/prestations" element={<Prestations />} />
                    <Route path="/prestations/:id" element={<Prestation />} />
                    {isConnected && (
                        <>
                            <Route path="/account">
                                {isFreelancer && (
                                    <>
                                        <Route
                                            path="/account/prestations/:id/edit"
                                            element={<EditPrestation />}
                                        />
                                        <Route
                                            path="/account/prestations/create"
                                            element={<CreatePrestation />}
                                        />
                                        <Route
                                            path="/account/prestations"
                                            element={<AccountPrestations />}
                                        />
                                        <Route
                                            path="/account/requests"
                                            element={<Requests />}
                                        />
                                    </>
                                )}
                                <Route
                                    path="/account/favorites"
                                    element={<Favorites />}
                                />
                                <Route
                                    path="/account/orders"
                                    element={<Orders />}
                                />
                                <Route
                                    path="/account/settings"
                                    element={<AccountSettings />}
                                />
                            </Route>
                        </>
                    )}

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
