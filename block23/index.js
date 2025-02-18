//Cohort API variable
const COHORT = "2411-PUPPIES-AP";

//API LINK
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2411-PUPPIES-AP/players`;

//Object named "state" that contains an array

const state = {
    players: [],
}

//Function to fetch the data from the API
const fetchAllPuppies = async () => {
    try {
        //link API
        const response = await fetch(API_URL);
        //convert it to json
        const json = await response.json();

        //link the json data to the state
        state.players = json.data.players;

        //call the renderAllPuppies function after you create it
        renderAllPuppies();

        //Add a catch function and console log the error when it occurs
    } catch (error) {
        console.log("ERROR is fetchAllPuppies", error);
    };
};

//Make a getPuppies function to grab the puppies from the API
const createNewPuppy = async (id, name, breed) => {
    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                id,
                name,
                breed,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        await fetchAllPuppies();
    } catch (error) {
        console.log("ERROR is createNewPuppy");
    };
};

//Delete request function by ID
const removePuppy = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        }),
            fetchAllPuppies();
    } catch (error) {
        console.log("ERROR is removePuppy", error);
    };
};

//Render the puppies to the page
const renderAllPuppies = () => {
    const puppiesContainer = document.getElementById("puppies-container");
    const puppyList = state.players;
    if (!puppyList || puppyList.length === 0) {
        puppiesContainer.innerHTML = "<h3> No Puppies Left </h3>";
        return;
    };

    //Reset HTML of all puppies
    puppiesContainer.innerHTML = "";

    //Create a card for each puppy
    puppyList.forEach((players) => {
        const puppyElement = document.createElement("div");
        puppyElement.classList.add("puppy-card");
        puppyElement.innerHTML = `
    <h4> Id: ${players.id} </h4>
    <h4> ${players.name} </h4>
    <p> ${players.breed} </p>
    <button class="delete-button" data-id="${players.id}"> remove </button>
    `;
        puppiesContainer.appendChild(puppyElement);

        const deleteBtn = puppyElement.querySelector(".delete-button");
        //Add event listener to the delete button to delete the puppy 
        deleteBtn.addEventListener("click", (event) => {
            try {
                event.preventDefault();
                removePuppy(players.id);
            } catch (error) {
                console.log("ERROR is deleteBtn", error);

            }
        });
    });
};


//add an event listener to the form so when you submit it you create a new recipe
const addListener = () => {
    const form = document.querySelector("#addPuppy");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        await createNewPuppy(
            form.id.value,
            form.name.value,
            form.breed.value,
        );

        //clear the form after we create the new party
        form.id.value = "";
        form.name.value = "";
        form.breed.value = "";

    });
};

//initialize the function when the page loads
const init = async () => {
    //get all recipes from the API
    await fetchAllPuppies();
    //adds a listener to the form to be able to add the puppies
    addListener();
};

init();