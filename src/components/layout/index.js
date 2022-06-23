import Header from '../header';
// import Footer from '../footer';
import styles from './styles.module.scss';
const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main id={styles['wrapper']}>{children}</main>
        </>
    );
};

export default Layout;
