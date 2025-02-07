// boost.js
const BoostModule = {
    boostJuice: 100, // Starting power level
    maxBoostJuice: 100,

    // Function to spend power
    spendPower: function (amount) {
        if (this.boostJuice >= amount) {
            this.boostJuice -= amount;
        } else {
            console.log("Not enough power to boost!");
        }
    },

    // Function to recover power
    recoverPower: function (amount) {
        this.boostJuice = Math.min(100, this.boostJuice + amount); // Cap at 100
    },

    // Optional: Add a status function for debugging or UI
    getStatus: function () {
        return `Boost power is currently at ${this.boostJuice}`;
    },
};
