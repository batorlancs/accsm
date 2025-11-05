import { createFileRoute } from "@tanstack/react-router";
import { AccSetupManager } from "@/components/AccSetupManager";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    return <AccSetupManager />;
}
