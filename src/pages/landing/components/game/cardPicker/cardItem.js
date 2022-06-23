import noImg from 'src/common/images/cards/noimg.webp';
import {useGame} from 'src/pages/landing/contexts/gameContextV2.js';
import react from 'react';
import { usePopup } from '../../popup';
import styles from './styles.module.scss';

export default function CardItem(props) {
  const {
    worldFloor,
    mode, setMode, 
    selectedElement,
    selectElement,
    worldBg
  } = useGame() || {};

  const {
    togglePopup,
    setPopupData
  } = usePopup() || {};
  const {item} = props || {};

  const cardThumbnail = react.useMemo(() => {
    return item?.item || noImg;
  }, [item])

  // TODO: active card on select
  const isActive = react.useMemo(() => {
    return mode==="create" && selectedElement?.code === item?.code
  }, [mode, selectedElement, item])

  const handleCardClick = () => {
    // TODO : handle card selection 
    switch (item?.category) {
      case 'background':
        // ! Prevent changing same background
        if (item?.code === worldBg?.code) {return}

        setMode('view');
        selectElement(item)
        break;
      case 'floor':
        // ! Prevent changing same floor
        if (item?.code === worldFloor?.code) {return}

        // TODO: toggle popup to ask for user confirmation
        setPopupData({
          withConfirmation: true,
          title: "Chú ý", 
          description: `
              Các vật thể trên đảo hiện tại sẽ mất sau khi thay đổi đảo!
              Bạn chắc chắn muốn thực hiện thao tác này?
          `, 
          onConfirm: () => {
            // TODO: handle confirmation
            console.log('Confirmed!!!')

            setMode('view');
            selectElement(item)
          }
        });
        togglePopup();
        break;
      default:
        // ! Prevent switch to creative mode on changing default elements
        if (!item?.target) {
          setMode('create');
        }
        else {
          setMode('view');
        }
        selectElement(item);
        break
    }
  } 

  return (
    <div
      className={`
        ${styles['card-item']} 
        ${isActive ? styles['active'] : ''}
      `}
      onClick={handleCardClick}
    >
      <div className={styles['card-item__thumbnail']}>
        <img src={cardThumbnail} alt={item?.name}/>
      </div>
      <h3 className={styles['card-item__name']}>
        {item?.name}
      </h3>
      <button className={styles['card-item__btn']}>Place</button>
    </div>
  )
}