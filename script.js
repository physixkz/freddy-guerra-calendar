$(document).ready(function () {
  // Display the current day at the top of the calendar
  function displayCurrentDay() {
    // Get the current date and format
    const currentDay = dayjs().format("dddd, MMMM D, YYYY");
    // Set the formatted date to the element
    $("#currentDay").text(currentDay);
  }
  // Generate time blocks from 9 AM to 5 PM
  function generateTimeBlocks() {
    // Define the starting and ending hour for the time blocks
    const startHour = 9;
    const endHour = 17;
    // Loop through each hour from the startHour to endHour
    for (let i = startHour; i <= endHour; i++) {
      // Format the hour for display
      const time = dayjs().hour(i).format("hA");

      // Create the HTML for the time block using template literals
      const timeBlockHTML = `
        <div id="hour-${i}" class="row time-block future">
          <div class="col-2 col-md-1 hour text-center py-3">${time}</div>
          <textarea class="col-8 col-md-10 description" rows="3"></textarea>
          <button class="btn saveBtn col-2 col-md-1" aria-label="save">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </div>
      `;
      // Append the time block HTML to the main container with class "container-fluid"
      $(".container-fluid").append(timeBlockHTML);
    }
  }
  // Color-code the time blocks based on the current hour
  function updateColorCoding() {
    // Get the current hour using Day.js
    const currentHour = dayjs().hour();
    // Loop through each time block
    $(".time-block").each(function () {
      // Extract the hour from the time block's ID
      const blockHour = parseInt($(this).attr("id").split("-")[1]);
      // Add appropriate classes based on the comparison between blockHour and currentHour
      if (blockHour < currentHour) {
        $(this).removeClass("present future").addClass("past");
      } else if (blockHour === currentHour) {
        $(this).removeClass("past future").addClass("present");
      } else {
        $(this).removeClass("past present").addClass("future");
      }
    });
  }
  // Save the events to local storage
  function saveEvents() {
    // Create an object to store the events
    const events = {};
    // Loop through each time block to collect event data
    $(".time-block").each(function () {
      const eventId = $(this).attr("id");
      const eventText = $(this).find("textarea").val();
      events[eventId] = eventText;
    });
    // Store the events object in local storage after converting to JSON
    localStorage.setItem("events", JSON.stringify(events));
  }
  // Load the events from local storage and populate the time blocks
  function loadSavedEvents() {
    // Retrieve the events object from local storage and parse it from JSON
    const savedEvents = JSON.parse(localStorage.getItem("events"));
    // Check if there are saved events
    if (savedEvents) {
      // Loop through each time block to display the saved event text
      $(".time-block").each(function () {
        const eventId = $(this).attr("id");
        const eventText = savedEvents[eventId];
        if (eventText) {
          $(this).find("textarea").val(eventText);
        }
      });
    }
  }
  // Save the events when the save button is clicked
  // Event delegation for the save buttons
  $(".container-fluid").on("click", ".saveBtn", function () {
    // Get the parent time block's ID and the event text from the textarea
    const eventId = $(this).parent().attr("id");
    const eventText = $(this).siblings(".description").val();
    // Check if both eventId and eventText are available
    if (eventId && eventText) {
      // Retrieve the events object from local storage or create a new object if none exists
      const events = JSON.parse(localStorage.getItem("events")) || {};
      // Update the events object with the new event data
      events[eventId] = eventText;
      // Store the updated events object in local storage after converting to JSON
      localStorage.setItem("events", JSON.stringify(events));
    }
  });
  // Initialize the scheduler
  displayCurrentDay();
  generateTimeBlocks();
  updateColorCoding();
  loadSavedEvents();
  // Update color coding every 60 seconds
  setInterval(updateColorCoding, 60000);
});