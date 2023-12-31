import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { USER_TABS } from "../constants/header-tabs";

import { useAuthContext } from "../contexts/auth.context";
import MobileMenu from "./mobile-menu";

export default function Header() {
    const { data, isConnected, logout } = useAuthContext();
    const headerRef = useRef<HTMLHeadElement>(null);
    const subMenuRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const cb = (e: any) => {
            if (!subMenuRef?.current || !headerRef?.current) return;
            // if (subMenuRef.current.contains(e.target)) return;
            subMenuRef.current
                .getElementsByTagName("details")[0]
                .removeAttribute("open");
        };

        if (headerRef.current) {
            document.addEventListener("click", cb);

            return () => {
                document.removeEventListener("click", cb);
            };
        }
    }, [headerRef]);

    return (
        <header
            ref={headerRef}
            style={{ position: "relative", zIndex: 10000 }}
            className={`navbar top-0 relative bg-base-100 border border-b2 border-base-300`}
        >
            <MobileMenu color="black" />
            <div className={`container mx-auto `}>
                <div className="md:flex-1" style={{ zIndex: 10000 }}>
                    <Link
                        to="/"
                        className="capitalize text-2xl font-bold hover:opacity-75"
                    >
                        cinqoo
                    </Link>
                </div>
                <div className="flex-none hidden md:block">
                    <ul className="menu menu-horizontal px-1 flex items-center gap-2">
                        {isConnected ? (
                            <>
                                <li ref={subMenuRef}>
                                    <details>
                                        <summary className="text-xl">
                                            {data?.email}
                                        </summary>
                                        <ul className="p-2 bg-base-100 w-full">
                                            {USER_TABS.map((tab, index) => (
                                                <li
                                                    key={index}
                                                    className="capitalize"
                                                >
                                                    <Link to={tab.path}>
                                                        {tab.name}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <p onClick={logout}>Logout</p>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link className="text-xl" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="text-xl bg-transparent border border-primary text-primary hover:bg-primary hover:text-white hover:border-transparent"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}
