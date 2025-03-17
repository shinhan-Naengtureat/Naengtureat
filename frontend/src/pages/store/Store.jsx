import MapWithBottomSheet from "pages/store/MapWithBottomSheet";
import { useState } from "react";

function Store() {
  const [places, setPlaces] = useState([]);

  return (
    <>
      <MapWithBottomSheet setPlaces={setPlaces} places={places} />
    </>
  );
}

export default Store;