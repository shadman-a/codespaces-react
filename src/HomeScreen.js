import { useEffect, useState } from 'react';
import AddRestaurantForm from './AddRestaurantForm';
import './HomeScreen.css';

function HomeScreen({ onAdd }) {
  const images = [
    'https://loremflickr.com/800/400/pizza?lock=1',
    'https://loremflickr.com/800/400/burger?lock=2',
    'https://loremflickr.com/800/400/sushi?lock=3',
    'https://loremflickr.com/800/400/dessert?lock=4',
    'https://loremflickr.com/800/400/pasta?lock=5',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      3000
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="Home">
      <div className="Carousel">
        <img src={images[index]} alt="Delicious food" />
      </div>
      <div className="Intro">
        <h1>Restaurant Explorer</h1>
        <p>
          Discover and keep track of your favourite places to eat. Add new
          restaurants and see them on the map.
        </p>
      </div>
      <div className="FormCard">
        <h2>Add a Restaurant</h2>
        <AddRestaurantForm onAdd={onAdd} />
      </div>
    </div>
  );
}

export default HomeScreen;
