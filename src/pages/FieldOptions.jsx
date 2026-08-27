import { useNavigate } from "react-router-dom";
import "./FieldOptions.css";

function FieldOptions() {

  const navigate = useNavigate();

  const selectFieldType = (type) => {

    localStorage.setItem(
      "agrisenseFieldType",
      type
    );

    navigate("/land-registration");
  };


  return (

    <div className="field-page">

      <div className="field-card">

        <div className="field-header">

          <button
            type="button"
            className="field-back"
            onClick={() =>
              navigate("/role-selection")
            }
          >
            ← Back
          </button>

          <h1>
            🌾 Field
          </h1>

          <p>
            Select the type of agricultural land
          </p>

        </div>


        <h2>
          Choose an option
        </h2>


        <div className="field-options">


          {/* OWN LAND */}

          <button
            type="button"
            className="field-option"
            onClick={() =>
              selectFieldType("own-land")
            }
          >

            <div className="field-option-icon">
              🌱
            </div>

            <div>
              <h3>
                My Own Land
              </h3>

              <p>
                Manage your own agricultural land
              </p>
            </div>

            <span>
              →
            </span>

          </button>



          {/* RENT */}

          <button
            type="button"
            className="field-option"
            onClick={() =>
              selectFieldType("rent")
            }
          >

            <div className="field-option-icon">
              🤝
            </div>

            <div>
              <h3>
                Rent
              </h3>

              <p>
                Manage agricultural land taken on rent
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

export default FieldOptions;