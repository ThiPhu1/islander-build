import react from 'react';
import CardItem from './cardItem';
import CardList from './cardList';
import CategorySwitcher from './categorySwitcher';
import {items} from 'src/pages/landing/db';
import styles from './styles.module.scss';

const CardPicker = () => {
  const [cardList, setCardList] = react.useState();
  const [category, setCategory] = react.useState();

  return (
    <aside className={styles['card-picker']}>
      <CategorySwitcher 
        setCardList={setCardList} 
        items={items} 
        activeCategory={category}
        setCategory={setCategory}
      />
      <CardList>
        {cardList?.data?.map((item) => (
          <CardItem
            key={item?.code}
            item={{
              ...item,
              gridLevel: cardList?.gridLevel || item.gridLevel || 0,
              category,
              target: cardList?.target || item?.target
            }}
            
          />
        ))}
      </CardList>
    </aside>
  );
};

export default CardPicker;
