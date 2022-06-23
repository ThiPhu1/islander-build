import styles from './styles.module.scss'

export default function CardList(props) {
  const {children} = props || {}

  return (
    <ul
      className={styles['card-list']}
    >{children}</ul>
  )
}