import {Outlet} from "react-router";
import {Header} from "@/components/header/Header.tsx";

function App() {
    return (
        <>
            <Header/>
            <main className='p-4'>
                <Outlet/>
            </main>
        </>
    )
}

export default App