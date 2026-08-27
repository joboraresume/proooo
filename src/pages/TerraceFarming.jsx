import { useNavigate } from "react-router-dom";
import "./TerraceFarming.css";


function TerraceFarming() {

  const navigate = useNavigate();


  const selectType = (type) => {

    localStorage.setItem(
      "terraceType",
      type
    );


    navigate("/terrace-registration");

  };


  return (

    <div className="terrace-page">

      <div className="terrace-card">


        <button
          type="button"
          className="terrace-back"
          onClick={() =>
            navigate("/role-selection")
          }
        >
          ← Back
        </button>


        <h1>
          🪴 Terrace Farming
        </h1>


        <p className="terrace-subtitle">
          Choose your cultivation method
        </p>


        <h2>
          Choose an option
        </h2>


        <div className="terrace-options">


          {/* SOIL */}

          <button
            type="button"
            className="terrace-option"
            onClick={() =>
              selectType("soil")
            }
          >

            <div className="terrace-icon">
              🌱
            </div>


            <div>

              <h3>
                Cultivated in Soil
              </h3>

              <p>
                Grow crops directly in soil
              </p>

            </div>


            <span>
              →
            </span>

          </button>



          {/* VASE */}

          <button
            type="button"
            className="terrace-option"
            onClick={() =>
              selectType("vase")
            }
          >

            <div className="terrace-icon">
              🪴
            </div>


            <div>

              <h3>
                Cultivated in Vase
              </h3>

              <p>
                Grow crops in vases or pots
              </p>

            </div>


            <span>
              →
            </span>

          </button>


        </div>

      </div>

    </div>

  );

}


export default TerraceFarming;