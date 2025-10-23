import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    return (
        <div className="min-h-screen">
            <div data-tauri-drag-region className="h-12 w-full bg-pink-400">
                <p>sfdsfsdfsf</p>
            </div>
        </div>
    );
}
