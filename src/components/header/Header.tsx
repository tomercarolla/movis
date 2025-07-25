import {Link} from "react-router";

export function Header() {
    return (
        <Link to='/'>
            <header className='p-4 border-b border-gray-300'>🎬 Movis</header>
        </Link>
    )
}