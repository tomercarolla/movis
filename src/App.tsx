import {Outlet} from "react-router";

function App() {
    return (
        <>
            <header className='p-4 border-b border-gray-300'>🎬 Movis</header>
            <main className='p-4'>
                <Outlet/>
            </main>
        </>
    )
}

export default App