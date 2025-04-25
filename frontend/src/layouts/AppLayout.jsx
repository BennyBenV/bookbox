export default function AppLayout({ children }) {
    return (
        <main className="app-layout">
            <div className="container">
                {children}
            </div>
        </main>
    );
}