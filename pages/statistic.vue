<template>
  <div>
    <Header :toggleMenu="toggleMenu" />
    <div class="statistic-chart">
      <h1>Post Statistics</h1>

      <!-- Date Range Filter -->
      <div class="date-filter">
        <label for="date-range">Date Range:</label>
        <VueDatePicker
          v-model="dateRange"
          :range="true"
          placeholder="Select date range"
        />

        <button @click="fetchStatistics">Update</button>
      </div>

      <!-- Chart -->
      <div class="chart-container">
        <canvas id="post-chart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";
import Header from "~/components/Header.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: {
    Header,
    VueDatePicker,
  },
  data() {
    return {
      userId: null, // User ID
      dateRange: null, // Range of dates (array of 2 Date objects)
      chart: null, // Chart object
    };
  },
  methods: {
    async fetchStatistics() {
      if (!this.dateRange || this.dateRange.length !== 2) {
        alert("Please select a valid date range.");
        return;
      }

      if (!this.userId) {
        alert("User ID is not available.");
        return;
      }

      const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      };

      const [startDate, endDate] = this.dateRange;

      try {
        // Fetch data from API
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${this.userId}/get_statistic`,
          {
            params: {
              start_date: formatDate(startDate),
              end_date: formatDate(endDate),
            },
          }
        );

        // Build chart with data
        this.updateChart(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        alert("Failed to load statistics.");
      }
    },
    updateChart(data) {
      const labels = data.map((item) => item.date); // Dates for X-axis
      const counts = data.map((item) => item.count); // Post counts for Y-axis

      // Destroy old chart if exists
      if (this.chart) {
        this.chart.destroy();
      }

      // Create new chart
      const ctx = document.getElementById("post-chart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "bar", // Chart type
        data: {
          labels: labels,
          datasets: [
            {
              label: "Number of Posts",
              data: counts,
              backgroundColor: "rgba(54, 162, 235, 0.5)", // Bar color
              borderColor: "rgba(54, 162, 235, 1)", // Border color
              borderWidth: 1, // Border width
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Date", // X-axis title
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Posts", // Y-axis title
              },
              ticks: {
                stepSize: 1, // Шаг между метками
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value; // Возвращаем только целые значения
                  }
                  return null; // Пропускаем дробные значения
                },
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    // Get userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10); // Convert to integer
    } else {
      console.warn("User ID is not found in localStorage.");
    }

    // Set default date range
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1); // Jan 1 of current year
    this.dateRange = [startOfYear, today];

    // Load data on initial render if userId exists
    if (this.userId) {
      this.fetchStatistics();
    }
  },
};
</script>

<style>
/* General styles for the page */

/* Statistics Card */
.statistic-chart {
  background: #ffffff;
  color: #333;
  border-radius: 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 800px;
  width: 100%;
  margin: 10px auto;
}

/* Title */
.statistic-chart h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

/* Date Filter */
.date-filter {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
}

.date-filter label {
  font-weight: bold;
  font-size: 16px;
}

.vue-datepicker {
  width: 100%;
  max-width: 250px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

/* Update Button */
.date-filter button {
  padding: 10px 20px;
  background-color: #6a11cb;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.date-filter button:hover {
  background-color: #2575fc;
}

/* Chart */
.chart-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

canvas {
  width: 100%;
  height: 300px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .statistic-chart {
    padding: 15px;
    max-width: 90%;
  }

  .statistic-chart h1 {
    font-size: 20px;
  }

  .date-filter {
    gap: 10px;
  }

  .vue-datepicker {
    max-width: 200px;
    font-size: 12px;
  }

  .date-filter button {
    font-size: 14px;
    padding: 8px 15px;
  }

  .chart-container {
    padding: 15px;
  }

  canvas {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .statistic-chart h1 {
    font-size: 18px;
  }

  .vue-datepicker {
    max-width: 100%;
    font-size: 12px;
  }

  .date-filter button {
    font-size: 12px;
    padding: 6px 12px;
  }

  canvas {
    height: 200px;
  }
}
</style>
