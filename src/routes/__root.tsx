import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { GlobalModals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";

interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => (
        <>
            <Outlet />
            <GlobalModals />
            <Toaster />
            {/* <TanStackDevtools */}
            {/*     config={{ */}
            {/*         position: "bottom-right", */}
            {/*     }} */}
            {/*     plugins={[ */}
            {/*         { */}
            {/*             name: "Tanstack Router", */}
            {/*             render: <TanStackRouterDevtoolsPanel />, */}
            {/*         }, */}
            {/*         TanStackQueryDevtools, */}
            {/*     ]} */}
            {/* /> */}
        </>
    ),
});
