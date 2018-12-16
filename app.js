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
      let found = null;
      // Loop through meals
      data.meals.forEach(function(meal) {
        if (meal.id === id) {
          found = meal;
        }
      });
      return found;
    },
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
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
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

    // Edit icon click event
    document
      .querySelector(UISelectors.mealList)
      .addEventListener("click", mealUpdateSubmit);
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

  // Update meal submit
  const mealUpdateSubmit = function(e) {
    if (e.target.classList.contains("edit-meal")) {
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get meal
      const mealToEdit = MealCtrl.getMealById(id);

      // Set current meal
      MealCtrl.setCurrentMeal(mealToEdit);

      // Add meal to form
      UICtrl.addMealToForm();
    }

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
