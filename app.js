// Storage Controller

// Meal Controller
const MealCtrl = (function() {
  // Meal Constructor
  const Meal = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    meals: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 400},
      // {id: 2, name: 'Eggs', calories: 300}
    ],
    currentMeal: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getMeals: function() {
      return data.meals;
    },
    addMeal: function(name, calories) {
      let ID;
      // Create ID
      if (data.meals.length > 0) {
        ID = data.meals[data.meals.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new meal
      newMeal = new Meal(ID, name, calories);

      // Add to meals array
      data.meals.push(newMeal);

      return newMeal;
    },
    getMealById: function(id) {
      // Temp Var
      let found = null;

      // Loop through meals
      data.meals.forEach(function(meal) {
        if (meal.id === id) {
          found = meal;
        }
      });
      return found;
    },
    updateMeal: function(name, calories) {
      // Calories string -> number
      calories = parseInt(calories);
      let found = null;

      data.meals.forEach(function(meal) {
        if (meal.id === data.currentMeal.id) {
          meal.name = name;
          meal.calories = calories;
          found = meal;
        }
      });
      return found;
    },
    deleteMeal: function(id) {
      // GET all IDs in new Array
      const ids = data.meals.map(function(meal) {
        return meal.id;
      });

      // GET index
      const index = ids.indexOf(id);

      // REMOVE that meal
      data.meals.splice(index, 1);
    },
    // Setter + Getter for Current Meals
    setCurrentMeal: function(meal) {
      data.currentMeal = meal;
    },
    getCurrentMeal: function() {
      return data.currentMeal;
    },
    getTotalCalories: function() {
      let total = 0;

      // Loop through meals and add cals
      data.meals.forEach(function(meal) {
        total += meal.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    // Useful to log "data.meals[]" any time
    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  // Dynamic UI Selectors
  const UISelectors = {
    mealList: "#meal-list",
    listItems: "#meal-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    mealNameInput: "#meal-name",
    mealCaloriesInput: "#meal-calories",
    totalCalories: ".total-calories"
  };

  // Public methods
  return {
    populateMealList: function(meals) {
      let html = "";

      meals.forEach(function(meal) {
        html += `<li class="collection-meal" id="meal-${meal.id}">
        <strong>${meal.name}: </strong> <em>${meal.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-meal fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list meals
      document.querySelector(UISelectors.mealList).innerHTML = html;
    },
    getMealInput: function() {
      return {
        name: document.querySelector(UISelectors.mealNameInput).value,
        calories: document.querySelector(UISelectors.mealCaloriesInput).value
      };
    },
    addListItem: function(meal) {
      // Show the list
      document.querySelector(UISelectors.mealList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-meal";
      // Add ID
      li.id = `meal-${meal.id}`;
      // Add HTML
      li.innerHTML = `<strong>${meal.name}: </strong> <em>${
        meal.calories
      } Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-meal fa fa-pencil"></i>
      </a>`;
      // Insert meal
      document
        .querySelector(UISelectors.mealList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(meal) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // NodeList->Array[]
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `meal-${meal.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${
            meal.name
          }: </strong> <em>${meal.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-meal fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    clearInput: function() {
      document.querySelector(UISelectors.mealNameInput).value = "";
      document.querySelector(UISelectors.mealCaloriesInput).value = "";
    },
    addMealToForm: function() {
      document.querySelector(
        UISelectors.mealNameInput
      ).value = MealCtrl.getCurrentMeal().name;
      document.querySelector(
        UISelectors.mealCaloriesInput
      ).value = MealCtrl.getCurrentMeal().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.mealList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    // Change State onClick "CLEAR ALL"
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    // Change State
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(MealCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add meal event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", mealAddSubmit);

    // Disable re-submit on enter (because of Update Btn)
    document.addEventListener("keypress", e => {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();

        return false;
      }
    });
    // Edit icon click event
    document
      .querySelector(UISelectors.mealList)
      .addEventListener("click", mealEditClick);

    // Update icon click event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", mealUpdateSubmit);

    // Delete icon click event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", mealDeleteSubmit);

    // Back icon click event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);
  };

  // Add meal submit
  const mealAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getMealInput();

    // Check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      // Add meal
      const newmeal = MealCtrl.addMeal(input.name, input.calories);

      // Add meal to UI list
      UICtrl.addListItem(newMeal);

      // Get total calories
      const totalCalories = MealCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // onClick 'edit-meal' btn
  const mealEditClick = function(e) {
    if (e.target.classList.contains("edit-meal")) {
      // LOG that DOM structure details
      // console.log("e:", e);

      // GET that list item/meal.id [meal-0, meal-1, etc...]
      const listId = e.target.parentNode.parentNode.id;

      // BREAK that 'meal-id' into an array
      const listIdArr = listId.split("-");

      // GET that actual 'id' ONLY [index:1];
      const id = parseInt(listIdArr[1]);

      // GET that meal BY new Method of MeatCtrl(using 'id')
      const mealToEdit = MealCtrl.getMealById(id);

      // SET that current meal BY new Method of MeatCtrl
      MealCtrl.setCurrentMeal(mealToEdit);

      // Add meal to form
      UICtrl.addMealToForm();
    }

    e.preventDefault();
  };

  // Update meal submit
  const mealUpdateSubmit = function(e) {
    // GET that meal input
    const input = UICtrl.getMealInput();

    // UPDATE that meal
    const updatedMeal = MealCtrl.updateMeal(input.name, input.calories);

    // UPDATE the UI
    UICtrl.updateListItem(updatedMeal);

    // Get total calories
    const totalCalories = MealCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete meal submit
  const mealDeleteSubmit = function(e) {
    // GET current meal
    const currMeal = MealCtrl.getCurrentMeal();

    // Delete from DATA
    MealCtrl.deleteMeal(currMeal.id);

    e.preventDefault();
  };

  // Public methods
  return {
    init: function() {
      // Clear edit state / set initial set
      UICtrl.clearEditState();

      // Fetch meals from data structure
      const meals = MealCtrl.getMeals();

      // Check if any meals
      if (meals.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with meals
        UICtrl.populateMealList(meals);
      }

      // Get total calories
      const totalCalories = MealCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(MealCtrl, UICtrl);

// Initialize App
App.init();
