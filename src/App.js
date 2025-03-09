import React, { useState, useEffect, useRef } from "react";

const fetchItems = async (page) => {
  const response = await fetch(
    `https://dummyjson.com/products?limit=10&skip=${(page - 1) * 10}`
  );
  const data = await response.json();
  return data.products;
};

function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null)
  let totalProducts = 195;

  useEffect(() => {
    const loadMoreItems = async () => {
      setLoading(true);
      const newItems = await fetchItems(page);

      if (
        newItems.length === 0 ||
        items.length + newItems.length >= totalProducts
      ) {
        setHasMore(false);
      }
      setItems((prev) => [...prev, ...newItems]);
      setLoading(false);
    };
    if (hasMore) {
      loadMoreItems();
    }
  }, [page]);

useEffect(() => {
  observerRef.current = new IntersectionObserver(
    (entries) => {
      if(entries[0].isIntersecting && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1)
      }
    },
    { threshold: 1}
  )
}, [loading, hasMore])

useEffect(() => {
  const observer = observerRef.current;
  const lastItem = document.querySelector('#load-more-trigger');

  if (lastItem) {
    observer.observe(lastItem)
  }
  return() => {
    if(lastItem) {
      observer.unobserve(lastItem)
    }
  }
}, [items])

  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <img src={item.thumbnail} alt={item.title} width={50} height={50} />
            <p>{item.title}</p>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more products available</p>}
      <div id='load-more-trigger'></div>
    </div>
  );
}

export default App;
