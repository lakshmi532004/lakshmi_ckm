// Store chart instances globally to allow clearing
let heartRateChart, caloriesChart, sleepPatternChart, exerciseChart;

// Common color configuration for the charts
const chartColor = {
  borderColor: "rgba(255, 165, 0, 1)", //border color
  backgroundColor: "rgba(255, 165, 0, 0.6)", //background with slight transparency
  pointColor: "rgba(255, 165, 0, 0.6)", //points for scatter charts
  pointBorderColor: "rgba(255, 140, 0, 1)", //border for points
};
const axisColorX = "white";
const axisColorY = "white";
const legendColor = "white";

// Function to create the heart rate time series chart
function createHeartRateChart(timeLabels, heartRates) {
  const ctx = document.getElementById("heartRateChart").getContext("2d");
  if (heartRateChart) heartRateChart.destroy(); // Destroy previous instance
  heartRateChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timeLabels,
      datasets: [
        {
          label: "Heart Rate (bpm)",
          data: heartRates,
          borderColor: chartColor.borderColor,
          backgroundColor: chartColor.backgroundColor,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            color: axisColorY,
          },
        },
        x: {
          ticks: {
            color: axisColorX,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: legendColor,
          },
        },
      },
    },
  });
}

// Function to create the calories burned bar chart
function createCaloriesChart(activityLabels, caloriesBurned) {
  const ctx = document.getElementById("caloriesChart").getContext("2d");
  if (caloriesChart) caloriesChart.destroy(); // Destroy previous instance
  caloriesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: activityLabels,
      datasets: [
        {
          label: "Calories Burned",
          data: caloriesBurned,
          backgroundColor: chartColor.backgroundColor,
          borderColor: chartColor.borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: axisColorY,
          },
        },
        x: {
          ticks: {
            color: axisColorX,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: legendColor,
          },
        },
      },
    },
  });
}

// Function to create the sleep pattern scatter plot
function createSleepPatternChart(sleepHours, sleepQuality) {
  const ctx = document.getElementById("sleepPatternChart").getContext("2d");
  if (sleepPatternChart) sleepPatternChart.destroy(); // Destroy previous instance
  sleepPatternChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Sleep Quality (%) vs. Hours Slept",
          data: sleepHours.map((hours, index) => {
            return { x: hours, y: sleepQuality[index] };
          }),
          backgroundColor: chartColor.pointColor,
          borderColor: chartColor.pointBorderColor,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Hours Slept",
            color: axisColorX,
          },
          ticks: {
            color: axisColorX,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Sleep Quality (%)",
            color: axisColorY,
          },
          ticks: {
            color: axisColorY,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: legendColor,
          },
        },
      },
    },
  });
}

// Function to create the exercise routines scatter plot
function createExerciseChart(exerciseDuration, exerciseIntensity) {
  const ctx = document.getElementById("exerciseChart").getContext("2d");
  if (exerciseChart) exerciseChart.destroy(); // Destroy previous instance
  exerciseChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Exercise Intensity (%) vs. Duration (mins)",
          data: exerciseDuration.map((duration, index) => {
            return { x: duration, y: exerciseIntensity[index] };
          }),
          backgroundColor: chartColor.pointColor,
          borderColor: chartColor.pointBorderColor,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Duration (mins)",
            color: axisColorX,
          },
          ticks: {
            color: axisColorX,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Exercise Intensity (%)",
            color: axisColorY,
          },
          ticks: {
            color: axisColorY,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: legendColor,
          },
        },
      },
    },
  });
}

// Function to process user input and generate the charts
document
  .getElementById("dataForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get user inputs and split them into arrays
    const heartRates = document
      .getElementById("heartRateInput")
      .value.split(",")
      .map(Number);
    const timeLabels = document.getElementById("timeInput").value.split(",");

    const caloriesBurned = document
      .getElementById("caloriesInput")
      .value.split(",")
      .map(Number);
    const activityLabels = document
      .getElementById("activityLabelsInput")
      .value.split(",");

    const sleepHours = document
      .getElementById("sleepHoursInput")
      .value.split(",")
      .map(Number);
    const sleepQuality = document
      .getElementById("sleepQualityInput")
      .value.split(",")
      .map(Number);

    const exerciseDuration = document
      .getElementById("exerciseDurationInput")
      .value.split(",")
      .map(Number);
    const exerciseIntensity = document
      .getElementById("exerciseIntensityInput")
      .value.split(",")
      .map(Number);

    // Generate the charts based on user input
    createHeartRateChart(timeLabels, heartRates);
    createCaloriesChart(activityLabels, caloriesBurned);
    createSleepPatternChart(sleepHours, sleepQuality);
    createExerciseChart(exerciseDuration, exerciseIntensity);
  });

// Function to clear all data and visuals
document
  .getElementById("clearDataButton")
  .addEventListener("click", function () {
    // Destroy all chart instances
    if (heartRateChart) heartRateChart.destroy();
    if (caloriesChart) caloriesChart.destroy();
    if (sleepPatternChart) sleepPatternChart.destroy();
    if (exerciseChart) exerciseChart.destroy();

    // Clear input fields
    document.getElementById("heartRateInput").value = "";
    document.getElementById("timeInput").value = "";
    document.getElementById("caloriesInput").value = "";
    document.getElementById("activityLabelsInput").value = "";
    document.getElementById("sleepHoursInput").value = "";
    document.getElementById("sleepQualityInput").value = "";
    document.getElementById("exerciseDurationInput").value = "";
    document.getElementById("exerciseIntensityInput").value = "";

    // Clear canvas elements
    const canvasIds = [
      "heartRateChart",
      "caloriesChart",
      "sleepPatternChart",
      "exerciseChart",
    ];
    canvasIds.forEach((id) => {
      const canvas = document.getElementById(id);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  });

// Dummy Data for testing
document
  .getElementById("DummyDataButton")
  .addEventListener("click", function () {
    const heartRates = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * (100 - 60 + 1)) + 60
    );
    const timeLabels = Array.from(
      { length: 30 },
      (_, i) => `${String(i).padStart(2, "0")}:00`
    );
    const caloriesBurned = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * (500 - 100 + 1)) + 100
    );
    const activityLabels = Array.from(
      { length: 30 },
      () =>
        ["Running", "Cycling", "Swimming", "Walking", "Yoga"][
          Math.floor(Math.random() * 5)
        ]
    );
    const sleepHours = Array.from({ length: 30 }, () =>
      (Math.random() * (10 - 5) + 5).toFixed(2)
    );
    const sleepQuality = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * (100 - 50 + 1)) + 50
    );
    const exerciseDuration = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * (120 - 30 + 1)) + 30
    );
    const exerciseIntensity = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * (100 - 50 + 1)) + 50
    );

    document.getElementById("heartRateInput").value = heartRates.join(",");
    document.getElementById("timeInput").value = timeLabels.join(",");
    document.getElementById("caloriesInput").value = caloriesBurned.join(",");
    document.getElementById("activityLabelsInput").value =
      activityLabels.join(",");
    document.getElementById("sleepHoursInput").value = sleepHours.join(",");
    document.getElementById("sleepQualityInput").value = sleepQuality.join(",");
    document.getElementById("exerciseDurationInput").value =
      exerciseDuration.join(",");
    document.getElementById("exerciseIntensityInput").value =
      exerciseIntensity.join(",");
  });
