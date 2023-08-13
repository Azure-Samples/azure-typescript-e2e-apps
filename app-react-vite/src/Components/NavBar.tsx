import { useEffect } from 'react';
const NavBar = ({user}:any) => {

    const providers = ['twitter', 'github', 'aad'];
    const redirect = `/`;

    useEffect(() => {
        console.log(`NavBar user object: ${JSON.stringify(user)}`)
    }, [user]);

    return (
        <>
        {!user && providers.map((provider) => (
            <span key={provider} ><a href={`/.auth/login/${provider}?post_login_redirect_uri=${redirect}`}>{provider.toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')}</a> </span>
        ))}
        {user && (
            <div>
                <p>
                    <span>{user && user?.userDetails.toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')} ({user && user?.identityProvider})</span>
                    <span> <a href={`/.auth/logout?post_logout_redirect_uri=${redirect}`}>
                        Logout
                    </a>
                    </span>
                </p>
            </div>
        )}
        </>
    )

}
export default NavBar;