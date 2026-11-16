import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { usePrefs } from "../context/Preferences";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const { t } = usePrefs();
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#conteudo" className="skip-link">
        {t.nav.skip}
      </a>
      <Header />
      <main id="conteudo" key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
