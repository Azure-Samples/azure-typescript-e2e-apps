import './navbar.css';
import logo from './logo.png';

const NavBar = () => {
    return (
        <nav id="site-navigation" className="main-navigation">
            <div className="menu-website-menu-2021-container">
                <div className="logo"><img src={logo} alt="Home"></img></div>
                <ul id="menu-website-menu-2021" className="mega-menu">
                    <li id="menu-item-3135" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-3135"><a href="https://mimimoto.nl/">Home</a></li>
                    <li id="menu-item-3125" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3125"><a href="https://mimimoto.nl/products/">Products</a></li>
                    <li id="menu-item-3124" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3124"><a href="https://mimimoto.nl/mission/">Mission</a></li>
                    <li id="menu-item-3127" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3127"><a href="https://mimimoto.nl/business-2/">Business</a></li>
                    <li id="menu-item-3126" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3126"><a href="https://mimimoto.nl/cases/">Cases</a></li>
                    <li id="menu-item-3128" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3128"><a href="https://mimimoto.nl/impact/">Impact</a></li>
                    <li id="menu-item-3316" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3316"><a href="https://mimimoto.nl/gallery/">Gallery</a></li>
                    <li id="menu-item-3372" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3372"><a href="https://mimimoto.nl/faq/">FAQ</a></li>
                    <li id="menu-item-3130" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3130"><a href="https://mimimoto.nl/contact/">Contact</a></li>
                    <li id="menu-item-8745" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-8745"><a href="https://mimimoto.nl/built-in-mimi-moto/">Built-in Mimi Moto</a></li>
                </ul>
            </div>                    
        </nav>
    )
}
export default NavBar