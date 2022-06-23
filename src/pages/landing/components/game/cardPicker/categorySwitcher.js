import react from "react"
import styles from './styles.module.scss';

export default function CategorySwitcher(props)  {
  const {
    items, 
    setCardList,
    setCategory,
    activeCategory
  } = props || {} 

  const selectCategory = react.useCallback((category) => {
    // TODO: get items and activate selected category
    setCategory(category?.name);
    setCardList(category);
  }, [])

  const handleClick = react.useCallback((category) => {
    // TODO: change card list's item on category tab click
    return () => {
      selectCategory(category);
    }
  }, [])

  react.useEffect(() => {
    // TODO: load card list with first category in db
    selectCategory(items?.[0]);
  }, [])

  return (
    <div className={styles['category-switcher']}>
      <ul className={styles['category-switcher__list']}>
        {items?.map((item, index) => (
          <li
            key={index}
            className={`
              ${styles['category-switcher__item']}
              ${activeCategory == item?.name ? styles['active'] : ''}
            `}
            onClick={handleClick(item)}
          >
            <img
              src={activeCategory == item?.name ? item?.activeSrc : item?.src}
              alt={item?.name}
              height={24}
              width={24}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}