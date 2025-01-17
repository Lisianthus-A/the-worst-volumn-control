import { lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { mapPathToRoute } from "@/routes";
import { Loading, Layout } from "@/components";
import Page404 from "@/pages/404";

function App() {
  const [location] = useLocation();

  const routeObj = mapPathToRoute.get(location);

  if (!routeObj) {
    return <Page404 />;
  }

  const Component = lazy(routeObj.route.component);

  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </Layout>
  );
}

export default App;
