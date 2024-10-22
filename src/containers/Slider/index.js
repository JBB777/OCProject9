import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  let byDateDesc = null;
  if (data && data.focus && data.focus.length > 0) {
      byDateDesc = data?.focus.sort((evtA, evtB) =>
      new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
    );
  }
  


  /* useEffect utilise une minuterie aussi !?
    Modif de nextCard directement dans useEffect
    utilisation de setInterval pour gérer les 5s entre chaque slide.
  */
  // const nextCard = () => {
  //   setTimeout(
  //     /* MàJ .lenght - 1 sinon 1 de trop ==> carrousel blanc */
  //     () => setIndex(index < byDateDesc.length-1 ? index + 1 : 0),
  //     5000
  //   );
  // };
  // useEffect(() => {
  //   nextCard();
  // });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex(prevIndex => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0));
    }, 5000);
  
    return () => clearInterval(intervalId); // Nettoyage de l'intervalle
  }, [byDateDesc]);


  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        /* Slider : each child need an unique key */
        /* modif <></> en <div> en déplacement key du <div> qui suit dans ce nouveau <div> */
        <div key={`${event.title}`}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum"/>
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                /* A VOIR MAP comprend pas le '_'
                  Modif key car event.id n'existe pas dans [focus] du json
                  key = {radioIdx}  ==> do not use array index in keys. Quoi d'autres ici ??
                  ajout id dans [focus].
                  
                  Encountered two children with the same key, `1`.
                  Keys should be unique so that components maintain their identity across updates.
                */
                <input
                  key={[event.title, '-', radioIdx].join()}
                  type="radio"
                  name="radio-button"
                  /* Modif idx en index 
                  ++
                  Warning: You provided a `checked` prop to a form field without an `onChange` handler.
                  This will render a read-only field. If the field should be mutable use `defaultChecked`.
                  Otherwise, set either `onChange` or `readOnly`.

                  ==> ajout readOnly
                  */
                  readOnly
                  checked={index === radioIdx}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
