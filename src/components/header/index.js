import styles from './styles.module.scss';
import logoImg from 'src/common/images/logo.webp';

const Header = () => {
    const navItems = [
        {
            name: 'Home',
            url: '/',
        },
        {
            name: 'Whitepaper',
            url: '/',
        },
        {
            name: 'Deck',
            url: '/',
        },
        {
            name: 'Our World',
            url: '/',
        },
        {
            name: 'Features',
            url: '/',
        },
        {
            name: 'Team',
            url: '/',
        },
    ];
    return (
        <header id={styles['header']}>
            <div className={styles['wrap']}>
                <div id={styles['logo']}>
                    <img src={logoImg} alt="Islander" />
                </div>

                <div className={styles['navigation']}>
                    <ul className={styles['nav-lists']}>
                        {navItems?.map((item, i) => (
                            <li key={i} className={styles['nav-lists--item']}>
                                <a href={item?.url}>{item?.name}</a>
                            </li>
                        ))}
                    </ul>
                    <button className={styles['connect']}>
                        Connect wallet
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
